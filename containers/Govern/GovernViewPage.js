import * as PropTypes from "prop-types";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Col, Row, SvgIcon } from "../../components/common";
import { connect } from "react-redux";
import { Button, List, Spin } from "antd";
// import "./index.scss";
import VoteNowModal from "./VoteNowModal";
import Link from "next/link";
import { useParams } from "react-router";
import { checkUserVote, fetchSpecificProposalData } from "../../services/contractsRead";
import { useEffect } from "react";
import { setCurrentProposal, setUserVote } from "../../actions/govern";
import { stringTagParser, truncateString } from "../../utils/string";
import Copy from "../../components/Copy";
import { useState } from "react";
import moment from "moment";
import { formatNumber } from "../../utils/number";
import { amountConversion, amountConversionWithComma } from "../../utils/coin";
import { DOLLAR_DECIMALS } from "../../constants/common";
import { totalVTokens } from "../../services/voteContractsRead";
import { MyTimer } from "../../components/TimerForAirdrop";
import TooltipIcon from "../../components/TooltipIcon";
import { useRouter } from "next/router";
import { Progress } from "@mantine/core";

const GovernViewPage = ({
    lang,
    address,
    currentProposal,
    setCurrentProposal,
    userVote,
    setUserVote,
    voteCount,

}) => {

    const router = useRouter();
    const { proposalId } = router.query;
    let currentProposalId = Number(proposalId);
    const [loading, setLoading] = useState()
    const [getVotes, setGetVotes] = useState({
        yes: 0,
        no: 0,
        veto: 0,
        abstain: 0
    });
    const [totalVoteVotingPower, setVoteTotalVotingPower] = useState(0);

    const fetchSpecificProposal = (proposalId) => {
        fetchSpecificProposalData(proposalId).then((res) => {
            setCurrentProposal(res);
        }).catch((err) => {
        })
    }
    const fetchUserVote = (proposalId, address) => {
        setLoading(true)
        checkUserVote(proposalId, address).then((res) => {
            setUserVote(res.vote)
            setLoading(false)
        }).catch((err) => {
            setLoading(false)
        })
    }

    const fetchTotalVTokens = (address, height) => {
        totalVTokens(address, height).then((res) => {
            setVoteTotalVotingPower(res)
        }).catch((error) => {
            console.log(error);
        })
    }

    useEffect(() => {
        if (currentProposalId) {
            fetchSpecificProposal(currentProposalId)
        }
    }, [currentProposalId, voteCount])

    useEffect(() => {
        if (currentProposalId && address) {
            fetchUserVote(currentProposalId, address)
            if (currentProposal?.start_height) {
                fetchTotalVTokens(address, currentProposal?.start_height)
            }
        }
    }, [address, currentProposal])


    useEffect(() => {
        calculateVotes()
    }, [address, currentProposal])


    const calculateTotalValue = () => {
        let value = currentProposal?.votes;
        let yes = Number(value?.yes);
        let no = Number(value?.no);
        let veto = Number(value?.veto);
        let abstain = Number(value?.abstain);
        let totalValue = yes + no + abstain + veto
        totalValue = (totalValue / 1000000)
        totalValue = formatNumber(totalValue)
        return totalValue;
    }

    const calculateQuorem = () => {
        let value = currentProposal;
        let totalWeight = value?.total_weight;
        let quoremWeight = value?.threshold?.threshold_quorum?.quorum;
        let quorem = Number(totalWeight) * Number(quoremWeight);
        quorem = formatNumber(amountConversion(quorem, DOLLAR_DECIMALS))
        return quorem;

    }

    const calculateVotes = () => {
        let value = currentProposal?.votes;
        let yes = Number(value?.yes);
        let no = Number(value?.no);
        let veto = Number(value?.veto);
        let abstain = Number(value?.abstain);
        let totalValue = yes + no + abstain + veto;

        yes = Number(((yes / totalValue) * 100) || 0).toFixed(2)
        no = Number(((no / totalValue) * 100) || 0).toFixed(2)
        veto = Number(((veto / totalValue) * 100) || 0).toFixed(2)
        abstain = Number(((abstain / totalValue) * 100) || 0).toFixed(2)
        setGetVotes({
            ...getVotes,
            yes: yes,
            no: no,
            veto: veto,
            abstain: abstain
        })
    }

    const unixToGMTTime = (time) => {
        // *Removing miliSec from unix time 
        let newTime = Math.floor(time / 1000000000);
        var timestamp = moment.unix(newTime);
        timestamp = timestamp.format("DD-MM-YYYY ")
        return timestamp;
    }
    const votingStartTime = unixToGMTTime(currentProposal?.start_time);
    const votingEndTime = unixToGMTTime(currentProposal?.expires?.at_time);

    let time = currentProposal?.expires?.at_time;
    time = (time / 1000000);



    const getUserVote = (vote) => {
        if (vote === "veto") {
            return "No with veto"
        }
        else {
            return vote
        }
    }


    const parsedVotingStatustext = (text) => {
        if (text === "open") {
            return "voting Period"
        }
        return text;
    }

    if (loading) {
        return <div className="spinner"><Spin /></div>
    }

    return (
        <>
            <div className="proposal_view_back_button_container mt-4">
                <Link href="/govern">
                    <Button type="primary">Back</Button>
                </Link>
            </div>

            <div className="govern_view_main_container mt-4 ">
                <div className="govern_view_container">

                    <div className="proposal_detail_main_container card_container">
                        <div className="proposal_detail_container">
                            <div className="proposal_id"> #{currentProposal?.id || "-"}</div>
                            <div className="proposal_title">{currentProposal?.title || "------"}</div>
                            <div className="proposal_overview_container">
                                <div className="proposal_stats_container">
                                    <div className="title">Voting Starts</div>
                                    <div className="value">
                                        {votingStartTime !== "Invalid date" ? `${votingStartTime} ` : "--/--/-- 00:00:00"}
                                    </div>
                                </div>
                                <div className="proposal_stats_container">
                                    <div className="title">Voting Ends</div>
                                    <div className="value">
                                        {
                                            votingEndTime !== "Invalid date" ? `${votingEndTime} ` : "--/--/-- 00:00:00"
                                        }
                                    </div>
                                </div>
                                <div className="proposal_stats_container">
                                    <div className="title">Proposer</div>
                                    <div className="value">{currentProposal?.proposer ? truncateString(currentProposal?.proposer, 6, 6) : "------"}</div>
                                </div>
                                <div className="proposal_stats_container">
                                    <div className="title">My Voting power</div>
                                    <div className="value">{amountConversionWithComma(totalVoteVotingPower) || 0} veHARBOR</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="proposal_vote_details_main_container card_container">

                        <div className="proposal_vote_details_container">
                            <div className="title_and_user_vote_container">
                                <div className="vote_title">Vote Details</div>
                                <div className="user_vote"> {address && userVote !== null && (
                                    <span>
                                        Your Vote :{" "}
                                        <span> {getUserVote(userVote?.vote)}</span>
                                    </span>
                                )}</div>

                            </div>
                            <div className="proposal_vote_details_main">

                                <div className="proposal_vote_column">
                                    <div className="total_votel_container">
                                        <div className="title">Total Votes</div>
                                        <div className="value">
                                            <div >
                                                {currentProposal ? `${(calculateTotalValue() || "0") + " " + "veHARBOR"}` : 0}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="proposal_quorem_container">
                                        <div className="total_quorem">
                                            <div className="title">Current Quorum: 8%</div>
                                            <div className="value primary_values">1.47M veHARBOR</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="proposal_vote_detail_column">
                                    <div className="proposal_vote_up_row">
                                        <div className="stata_main_container">
                                            <div className="stats_container">
                                                <div className="color" style={{ backgroundColor: "#52B788" }}></div>
                                                <div className="data_container">
                                                    <div className="title">Yes</div>
                                                    <div className="value"> {Number(getVotes?.yes || "0.00")}%</div>
                                                </div>
                                            </div>
                                            <div className="stats_container">
                                                <div className="color" style={{ backgroundColor: "#D74A4A" }}></div>
                                                <div className="data_container">
                                                    <div className="title">No</div>
                                                    <div className="value"> {Number(getVotes?.no || "0.00")}%</div>
                                                </div>
                                            </div>
                                            <div className="stats_container">
                                                <div className="color" style={{ backgroundColor: "#C2A3A3" }}></div>
                                                <div className="data_container">
                                                    <div className="title">No With Veto</div>
                                                    <div className="value">{Number(getVotes?.veto || "0.00")}%</div>
                                                </div>
                                            </div>
                                            <div className="stats_container">
                                                <div className="color" style={{ backgroundColor: "#9FA4AD" }}></div>
                                                <div className="data_container">
                                                    <div className="title">Abstain</div>
                                                    <div className="value">{Number(getVotes?.abstain || "0.00")}%</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="proposal_vote_botom_row">
                                        <div className="mt-3 mask_container_relative">
                                            <div>
                                                <Progress
                                                    className="vote-progress-bar"
                                                    radius="xl"
                                                    size={13}
                                                    sections={[
                                                        {
                                                            value: Number(getVotes?.yes || 0),
                                                            color: "#52B788",
                                                            tooltip: `Yes ${Number(getVotes?.yes || 0)} %`,
                                                        },
                                                        {
                                                            value: Number(getVotes?.no || 0),
                                                            color: "#D74A4A",
                                                            tooltip: `No ${Number(getVotes?.no || 0)} %`,
                                                        },
                                                        {
                                                            value: Number(getVotes?.veto || 0),
                                                            color: "#C2A3A3",

                                                            tooltip: `No With Veto ${Number(getVotes?.veto || 0)} %`,
                                                        },
                                                        {
                                                            value: Number(getVotes?.abstain || 0),
                                                            color: "#9FA4AD",

                                                            tooltip: `Abstain ${Number(getVotes?.abstain || 0)} %`,
                                                        },
                                                    ]}
                                                />
                                            </div>
                                            <div className="mask_container">
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="proposal_vote_btn_container">
                                    {/* <Button type="primary" className="btn-filled"> Vote</Button> */}
                                    <VoteNowModal
                                        votingPower={amountConversionWithComma(totalVoteVotingPower) || 0}
                                    />
                                </div>


                            </div>
                        </div>
                    </div>

                    <div className="proposal_description_main_container">
                        <div className="proposal_heading">
                            Description
                        </div>
                        <div className="proposal_para">
                            {stringTagParser(currentProposal?.description || " ")}
                        </div>

                        <div className="proposal_suggest_box">
                            <p>No other parameters are being changed.</p>
                            <p>  Vote <span>YES</span>  to approve the increase of debt ceiling.</p>
                            <p> Vote <span>NO</span>  to disapprove the increase of debt ceiling.</p>
                            <p>  Vote <span>ABSTAIN</span>  to express no interest in the proposal.</p>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};

GovernViewPage.propTypes = {
    lang: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    currentProposal: PropTypes.array.isRequired,
    userVote: PropTypes.array.isRequired,
    voteCount: PropTypes.number.isRequired
};

const stateToProps = (state) => {
    return {
        lang: state.language,
        address: state.account.address,
        currentProposal: state.govern.currentProposal,
        userVote: state.govern.userVote,
        voteCount: state.govern.voteCount,
    };
};

const actionsToProps = {
    setCurrentProposal,
    setUserVote,
};

export default connect(stateToProps, actionsToProps)(GovernViewPage)