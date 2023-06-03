import { Button, List, Pagination, Select, Spin, Tabs } from "antd";
import { Progress } from '@mantine/core';
import moment from "moment";
import * as PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, useNavigate } from 'react-router-dom';
import { setAllProposal, setProposalUpData } from "../../actions/govern";
import { Col, Row, SvgIcon } from "../../components/common";
import NoDataIcon from "../../components/common/NoDataIcon";
// import NoData from "../../components/NoData";
import GovernOpenProposal from "./openProposal/index";
import GovernPastProposal from "./pastProposal/index";
import { DEFAULT_PAGE_NUMBER, DOLLAR_DECIMALS, HALF_DEFAULT_PAGE_SIZE, PRODUCT_ID } from '../../constants/common';
import { fetchParticipationStats, fetchProposalUpData, totalProposal, totalveHarborSupply } from "../../services/contractsRead";
import { amountConversionWithComma } from "../../utils/coin";
import { stringTagParser } from "../../utils/string";
import { useRouter } from "next/router";

const { Option } = Select;

const Govern = ({
  lang,
  address,
  allProposal,
  setAllProposal,
  proposalUpData,
  setProposalUpData,
  voteCount,
}) => {
  const router = useRouter();

  const [proposalList, setProposalList] = useState()
  const [activeKey, setActiveKey] = useState("1");
  const [totalSupply, setTotalSupply] = useState(0)
  const [totalProposalCount, setTotalProposalCount] = useState(1)
  const [filterValue, setFilterValue] = useState();
  const [currentActivePage, setCurrentActivePage] = useState(1)
  const [loading, setLoading] = useState();
  const [participationStats, setParticipationStats] = useState({})
  const [pageNumber, setPageNumber] = useState(DEFAULT_PAGE_NUMBER);
  const [pageSize, setPageSize] = useState(HALF_DEFAULT_PAGE_SIZE);
  const [inProgress, setInprogress] = useState(false)
  const [pastProposals, setPastProposals] = useState();
  const [activeProposals, setActiveProposals] = useState();
  const [filteredProposal, setFilteredProposal] = useState();

  const fetchAllProposal = (pageNumber, productId, limit, status) => {
    setInprogress(true)
    totalProposal(pageNumber, productId, limit, status).then((res) => {
      console.log(res?.proposals, "res?.proposals");
      setProposalList(res?.proposals)
      setFilteredProposal(res?.proposals)
      setInprogress(false)
      setTotalProposalCount(res?.proposal_count)
    }).catch((err) => {
      console.log(err);
      setInprogress(false)
    })
  }

  const fetchAllProposalUpData = (productId) => {
    setLoading(true)
    fetchProposalUpData(productId).then((res) => {
      setProposalUpData(res)
      setLoading(false)
    }).catch((err) => {
      setLoading(false)
    })
  }

  const queryParticipationStats = (productId) => {
    setLoading(true)
    fetchParticipationStats(productId).then((res) => {
      setParticipationStats(res)
      setLoading(false)
    }).catch((err) => {
      setLoading(false)
    })
  }

  const fetchTotalveHarborSupply = () => {
    setLoading(true)
    totalveHarborSupply().then((res) => {
      setTotalSupply(res)
      setLoading(false)
    }).catch((err) => {
      setLoading(false)
    })
  }

  const unixToGMTTime = (time) => {
    let newTime = Math.floor(time / 1000000000);
    var timestamp = moment.unix(newTime);
    timestamp = timestamp.format("DD-MM-YYYY HH:mm:ss")
    return timestamp;
  }

  useEffect(() => {
    fetchAllProposal((pageNumber - 1) * pageSize, PRODUCT_ID, pageSize)
    fetchAllProposalUpData(PRODUCT_ID)
    queryParticipationStats(PRODUCT_ID)
    fetchTotalveHarborSupply()
  }, [address])

  const calculateAverageParticipation = () => {
    let avgParticipation = proposalUpData?.active_participation_supply
    avgParticipation = avgParticipation / proposalUpData?.proposal_count
    avgParticipation = avgParticipation / (totalSupply?.vtoken)
    avgParticipation = Number(avgParticipation * 100).toFixed(2)
    return avgParticipation;
  }

  const onPageChange = (currentPage) => {
    if (filterValue === "all") {
      setCurrentActivePage(currentPage)
      fetchAllProposal((currentPage - 1) * pageSize, PRODUCT_ID, pageSize)
      return
    }
    else {
      setCurrentActivePage(currentPage)
      fetchAllProposal((currentPage - 1) * pageSize, PRODUCT_ID, pageSize, filterValue)
    }

  }

  const data = [
    {
      title: "Total Supply",
      counts: totalSupply ? amountConversionWithComma(totalSupply?.vtoken, DOLLAR_DECIMALS) + " veHARBOR" : "-"

    },
    {
      title: "Total Proposals",
      counts: proposalUpData ? participationStats?.proposal_count || 0 : "-"
    },
    {
      title: "Average Participation",
      counts: proposalUpData ? `${Number((participationStats?.active_participation) * 100 || 0).toFixed(DOLLAR_DECIMALS) + "%"}` : "-"
    }
  ];

  const getDuration = (data) => {
    let duration;
    duration = moment.duration(data, "seconds");
    duration = `${duration.days()} Days ${duration.hours()} Hours`
    return duration;
  }

  const calculateDurationPercentage = (startTime, duration) => {
    // formula = ((currentTime - start time)/duration )*100
    let start = Number(startTime)
    let totalDuration = Number(duration)
    let currentTime = Math.round((new Date()).getTime() / 1000)

    // Calculating start time in sec 
    // ***Removing nanosec from unix time*** 
    start = Math.floor(start / 1000000000);

    // Calculating percentage 
    let percentage = ((currentTime - start) / totalDuration) * 100
    percentage = Number(percentage).toFixed(2)
    percentage = Math.abs(percentage)
    return percentage;
  }

  const parsedVotingStatustext = (text) => {
    if (text === "open") {
      return "voting Period"
    }
    return text;
  }

  // const navigate = useNavigate();

  const filterAllProposal = (value) => {
    setFilterValue(value);
    if (value === "all") {
      setCurrentActivePage(1)
      fetchAllProposal((pageNumber - 1) * pageSize, PRODUCT_ID, pageSize)
      return;
    }
    else {
      setCurrentActivePage(1)
      fetchAllProposal((pageNumber - 1) * pageSize, PRODUCT_ID, pageSize, value)
      return;
    }
  }

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

  const onSearchChange = (searchKey) => {
    // if (activeKey === "2") {
    //   let oldProposals = proposals?.filter(
    //     (item) => item?.status !== "PROPOSAL_STATUS_VOTING_PERIOD"
    //   );
    //   oldProposals = oldProposals?.filter(
    //     (item) =>
    //       item?.content?.title?.toLowerCase().includes(searchKey) ||
    //       (item?.proposal_id).includes(searchKey)
    //   );
    //   setFilteredProposal(oldProposals);
    // } else {
    //   let ActiveProposals = proposals?.filter(
    //     (item) => item?.status === "PROPOSAL_STATUS_VOTING_PERIOD"
    //   );
    //   ActiveProposals = ActiveProposals?.filter(
    //     (item) =>
    //       item?.content?.title?.toLowerCase().includes(searchKey) ||
    //       (item?.proposal_id).includes(searchKey)
    //   );
    //   setFilteredProposal(ActiveProposals);
    // }
  };

  const handleTabChange = (key) => {
    let openProposal = proposals?.filter(
      (item) => item?.status === "PROPOSAL_STATUS_VOTING_PERIOD"
    );
    let pastProposal = proposals?.filter(
      (item) => item?.status !== "PROPOSAL_STATUS_VOTING_PERIOD"
    );
    if (key === "1") {
      setFilteredProposal(openProposal);
      setActiveProposals(openProposal);
    } else {
      setFilteredProposal(pastProposal);
      setPastProposals(pastProposal);
    }
    setActiveKey(key);
  };

  const tabItems = [
    {
      key: "1",
      label: "Open Proposals",
    },
    {
      key: "2",
      label: "Past Proposals",
    },
  ];

  if (loading) {
    return <Spin />;
  }

  return (
    <>
      <div className={`mt-4 govern_max_width`}>
        <div className="govern_main_container">
          <div className="govern_container">
            <div className="govern_tab_main_container">
              <div className="govern_tab">
                <Row className="pl-2">
                  <Col>
                    <div className="portifolio-tabs">
                      <Tabs
                        className="comdex-tabs"
                        onChange={handleTabChange}
                        activeKey={activeKey}
                        type="card"
                        items={tabItems}
                      />
                    </div>
                  </Col>
                </Row>
              </div>
              <div className="govern_search ">
                {activeKey === "2" && (
                  <Select
                    defaultValue="Filter"
                    className="select-primary filter-select govern-filter-search"
                    style={{ width: 150 }}
                    onChange={(e) => filterAllProposal(e)}
                    suffixIcon={<Icon className={"bi bi-chevron-down"} />}
                  >
                    <Option value="all" className="govern-select-option">
                      All
                    </Option>
                    <Option value="PROPOSAL_STATUS_DEPOSIT_PERIOD">
                      Pending
                    </Option>
                    <Option value="PROPOSAL_STATUS_PASSED">Passed</Option>
                    <Option value="PROPOSAL_STATUS_FAILED">Failed</Option>
                    <Option value="PROPOSAL_STATUS_REJECTED">Rejected</Option>
                  </Select>
                )}
                {/* <Input
                  placeholder="Search..."
                  onChange={(event) => onSearchChange(event.target.value)}
                  className="asset_search_input"
                  suffix={<Icon className={"bi bi-search"} />}
                /> */}
              </div>
            </div>

            <div className="proposal_box_parent_container">
              {activeKey === "1" ? (
                filteredProposal?.length > 0 ? (
                  <GovernOpenProposal proposals={filteredProposal} />
                ) : (
                  <h1 className="no_data">No Active proposal</h1>
                )
              ) : filteredProposal?.length > 0 ? (
                <GovernPastProposal proposals={filteredProposal} />
              ) : (
                <h1 className="no_data">No data found</h1>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
Govern.propTypes = {
  lang: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  allProposal: PropTypes.array.isRequired,
  proposalUpData: PropTypes.array.isRequired,
  voteCount: PropTypes.number.isRequired
};

const stateToProps = (state) => {
  return {
    lang: state.language,
    address: state.account.address,
    allProposal: state.govern.allProposal,
    proposalUpData: state.govern.proposalUpData,
    voteCount: state.govern.voteCount,
  };
};

const actionsToProps = {
  setAllProposal,
  setProposalUpData,
};

export default connect(stateToProps, actionsToProps)(Govern);
