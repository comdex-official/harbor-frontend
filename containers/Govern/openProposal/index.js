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

const GovernOpenProposal = ({ proposals }) => {
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

    const proposalEndDate = (_date) => {
        const enddate = new Date(_date);
        enddate.setSeconds(enddate.getSeconds());
        return enddate;

    }


    return (
        <>
            <div className={`mt-4 `}>

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
                                                    <div className="proposal_timer">
                                                        <svg width="13" height="15" viewBox="0 0 13 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M1.34375 14.0625C1.21943 14.0625 1.1002 14.0131 1.01229 13.9252C0.924386 13.8373 0.875 13.7181 0.875 13.5938C0.875 13.4694 0.924386 13.3502 1.01229 13.2623C1.1002 13.1744 1.21943 13.125 1.34375 13.125H2.28125V12.1875C2.28106 11.3915 2.50605 10.6117 2.93023 9.93823C3.35442 9.26471 3.96049 8.72493 4.67844 8.38125C4.95031 8.25094 5.09375 8.02781 5.09375 7.82813V7.17188C5.09375 6.97219 4.94938 6.74906 4.67844 6.61875C3.96049 6.27507 3.35442 5.73529 2.93023 5.06177C2.50605 4.38825 2.28106 3.60847 2.28125 2.8125V1.875H1.34375C1.21943 1.875 1.1002 1.82561 1.01229 1.73771C0.924386 1.6498 0.875 1.53057 0.875 1.40625C0.875 1.28193 0.924386 1.1627 1.01229 1.07479C1.1002 0.986886 1.21943 0.9375 1.34375 0.9375H11.6562C11.7806 0.9375 11.8998 0.986886 11.9877 1.07479C12.0756 1.1627 12.125 1.28193 12.125 1.40625C12.125 1.53057 12.0756 1.6498 11.9877 1.73771C11.8998 1.82561 11.7806 1.875 11.6562 1.875H10.7188V2.8125C10.7189 3.60847 10.494 4.38825 10.0698 5.06177C9.64558 5.73529 9.03951 6.27507 8.32156 6.61875C8.04969 6.74906 7.90625 6.97219 7.90625 7.17188V7.82813C7.90625 8.02781 8.05062 8.25094 8.32156 8.38125C9.03951 8.72493 9.64558 9.26471 10.0698 9.93823C10.494 10.6117 10.7189 11.3915 10.7188 12.1875V13.125H11.6562C11.7806 13.125 11.8998 13.1744 11.9877 13.2623C12.0756 13.3502 12.125 13.4694 12.125 13.5938C12.125 13.7181 12.0756 13.8373 11.9877 13.9252C11.8998 14.0131 11.7806 14.0625 11.6562 14.0625H1.34375ZM3.21875 1.875V2.8125C3.21875 3.31594 3.33125 3.79219 3.53469 4.21875H9.46531C9.66781 3.79219 9.78125 3.31594 9.78125 2.8125V1.875H3.21875ZM6.03125 7.82813C6.03125 8.48531 5.58312 8.98687 5.08344 9.22688C4.52496 9.49417 4.05351 9.91401 3.72355 10.4379C3.39359 10.9618 3.21858 11.5684 3.21875 12.1875C3.21875 12.1875 4.03062 10.9697 6.03125 10.8V7.82813ZM6.96875 7.82813V10.8C8.96937 10.9697 9.78125 12.1875 9.78125 12.1875C9.78142 11.5684 9.60641 10.9618 9.27645 10.4379C8.94649 9.91401 8.47504 9.49417 7.91656 9.22688C7.41687 8.98687 6.96875 8.48531 6.96875 7.82813Z" fill="url(#paint0_linear_1984_12870)" />
                                                            <defs>
                                                                <linearGradient id="paint0_linear_1984_12870" x1="6.5" y1="0.9375" x2="7" y2="27" gradientUnits="userSpaceOnUse">
                                                                    <stop stop-color="#6359E9" />
                                                                    <stop offset="1" stop-color="#7209B7" stop-opacity="0.9" />
                                                                </linearGradient>
                                                            </defs>
                                                        </svg>
                                                        {/* 6d 23h 12m */}
                                                        <MyTimer expiryTimestamp={proposalEndDate(formatTime(item?.voting_end_time))} />
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
GovernOpenProposal.propTypes = {
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

export default connect(stateToProps, actionsToProps)(GovernOpenProposal);
