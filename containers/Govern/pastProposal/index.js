import { useRouter } from "next/navigation";
import { Button, List, message, Select, Spin } from "antd";
import * as PropTypes from "prop-types";
import { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import { stringTagParser } from "../../../utils/string";
import { DOLLAR_DECIMALS } from "../../../constants/common";
// import style from "./Govern.moduleOld.scss";
import { Progress } from "@mantine/core";
import { useTimer } from "react-timer-hook";
// import MyTimer from "../../../shared/components/governTimer";
import { formatTime } from "../../../utils/date";
import MyTimer from "@/components/governTimer";

const { Option } = Select;

const GovernPastProposal = ({ proposals }) => {
    const router = useRouter();

    const calculateYesVote = (proposalData, voteOf) => {
        let value = proposalData?.votes;
        let yes = Number(value?.yes);
        let no = Number(value?.no);
        let veto = Number(value?.veto);
        let abstain = Number(value?.abstain);
        let totalValue = yes + no + abstain + veto;

        yes = Number(((yes / totalValue) * 100) || 0).toFixed(2)
        no = Number(((no / totalValue) * 100) || 0).toFixed(2)
        veto = Number(((veto / totalValue) * 100) || 0).toFixed(2)
        abstain = Number(((abstain / totalValue) * 100) || 0).toFixed(2)

        if (voteOf === "yes") {
            return Number(yes);
        }
        else if (voteOf === "no") {
            return Number(no)
        }
        else if (voteOf === "veto") {
            return Number(veto);
        }
        else if (voteOf === "abstain") {
            return Number(abstain);
        }
    }


    const parsedVotingStatustext = (text) => {
        if (text === "open") {
            return "voting Period"
        }
        return text;
    }


    return (
        <>
            <div>

                <div className="govern_main_container">
                    <div className="govern_container">
                        <div className="govern_tab_main_container">
                            <div className="govern_tab"></div>
                            <div className="govern_search"></div>
                        </div>
                        {/* ist container start */}
                        <div className="proposal_box_parent_container">

                            {proposals?.length > 0 ?
                                proposals?.map((item) => {
                                    return (
                                        <div className="proposal_main_container card_container" key={item?.proposal_id} onClick={() =>
                                            router.push(`/govern/${item?.id}`)
                                        } >
                                            <div className="proposal_container">
                                                {/* Id and Timer Container  */}
                                                <div className="id_timer_container">
                                                    <div className="proposal_id">#{item?.id}</div>
                                                    <div className="proposal-status-container">
                                                        <div className={item?.status === "open" ? "proposal-status open-color"
                                                            : item?.status === "passed" || item?.status === "executed" ? "proposal-status passed-color"
                                                                : item?.status === "rejected" ? "proposal-status reject-color"
                                                                    : item?.status === "pending" ? "proposal-status pending-color" : "proposal-status"

                                                        }> {item ? parsedVotingStatustext(item?.status) : "-" || "-"}</div>
                                                    </div>
                                                </div>

                                                {/* Title Container  */}

                                                <div className="haeading_container">
                                                    <div className="heading">
                                                        {item?.title}
                                                    </div>
                                                </div>

                                                {/* Pairagraph container  */}
                                                <div className="para_main_container">
                                                    <div className="para_container">
                                                        {stringTagParser(item?.description.substring(0, 150) || " ") + "......"}                                               </div>
                                                </div>

                                                {/* Progress bar container  */}

                                                <div className="progress_bar_main_container">
                                                    <div className="progress_bar_container">
                                                        <div className="stata_main_container">
                                                            <div className="stats_container">
                                                                <div className="color" style={{ backgroundColor: "#52B788" }}></div>
                                                                <div className="data_container">
                                                                    <div className="title">Yes</div>
                                                                    <div className="value">  {calculateYesVote(item, "yes")}%</div>
                                                                </div>
                                                            </div>
                                                            <div className="stats_container">
                                                                <div className="color" style={{ backgroundColor: "#D74A4A" }}></div>
                                                                <div className="data_container">
                                                                    <div className="title">No</div>
                                                                    <div className="value">{calculateYesVote(item, "no")}%</div>
                                                                </div>
                                                            </div>
                                                            <div className="stats_container">
                                                                <div className="color" style={{ backgroundColor: "#C2A3A3" }}></div>
                                                                <div className="data_container">
                                                                    <div className="title">No With Veto</div>
                                                                    <div className="value">  {calculateYesVote(item, "yeto")}%</div>
                                                                </div>
                                                            </div>
                                                            <div className="stats_container">
                                                                <div className="color" style={{ backgroundColor: "#C58E3D" }}></div>
                                                                <div className="data_container">
                                                                    <div className="title">Abstain</div>
                                                                    <div className="value">   {calculateYesVote(item, "abstain")}%</div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="progress_bar">
                                                            <div className="mt-3">
                                                                <div>
                                                                    <Progress
                                                                        className="vote-progress-bar"
                                                                        radius="xl"
                                                                        size={10}
                                                                        sections={[
                                                                            { value: calculateYesVote(item, "yes"), color: '#52B788', tooltip: 'Yes' + " " + calculateYesVote(item, "yes") + "%" },
                                                                            { value: calculateYesVote(item, "no"), color: '#D74A4A', tooltip: 'No' + " " + calculateYesVote(item, "no") + "%", },
                                                                            { value: calculateYesVote(item, "veto"), color: '#C2A3A3', tooltip: 'No With Veto' + " " + calculateYesVote(item, "veto") + "%" },
                                                                            { value: calculateYesVote(item, "abstain"), color: '#C58E3D', tooltip: 'Abstain' + " " + calculateYesVote(item, "abstain") + "%" },
                                                                        ]}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    )
                                })
                                : null
                            }
                            {/* 1st container end  */}

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
GovernPastProposal.propTypes = {
    lang: PropTypes.string.isRequired,
    setAllProposals: PropTypes.func.isRequired,
    setProposals: PropTypes.func.isRequired,
    allProposals: PropTypes.array,
};

const stateToProps = (state) => {
    return {
        lang: state.language,
        allProposals: state.govern.allProposals,
        // proposals: state.govern.proposals,
    };
};

const actionsToProps = {

};

export default connect(stateToProps, actionsToProps)(GovernPastProposal);
