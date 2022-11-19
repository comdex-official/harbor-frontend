import { Button, List, Pagination, Progress, Select, Spin } from "antd";
import moment from "moment";
import * as PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, useNavigate } from 'react-router-dom';
import { setAllProposal, setProposalUpData } from "../../../actions/govern";
import { Col, Row, SvgIcon } from "../../../components/common";
import NoDataIcon from "../../../components/common/NoDataIcon";
import NoData from "../../../components/NoData";
import { DEFAULT_PAGE_NUMBER, DOLLAR_DECIMALS, HALF_DEFAULT_PAGE_SIZE, PRODUCT_ID } from '../../../constants/common';
import { fetchProposalUpData, totalProposal, totalveHarborSupply } from "../../../services/contractsRead";
import { amountConversionWithComma } from "../../../utils/coin";
import "./index.scss";

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

  const [proposalList, setProposalList] = useState()
  const [totalSupply, setTotalSupply] = useState(0)
  const [totalProposalCount, setTotalProposalCount] = useState(1)
  const [filterValue, setFilterValue] = useState();
  const [currentActivePage, setCurrentActivePage] = useState(1)
  const [loading, setLoading] = useState();
  const [pageNumber, setPageNumber] = useState(DEFAULT_PAGE_NUMBER);
  const [pageSize, setPageSize] = useState(HALF_DEFAULT_PAGE_SIZE);
  const [inProgress, setInprogress] = useState(false)

  const fetchAllProposal = (pageNumber, productId, limit, status) => {
    setInprogress(true)
    totalProposal(pageNumber, productId, limit, status).then((res) => {
      setProposalList(res?.proposals)
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
    timestamp = timestamp.format("DD/MMMM/YYYY")
    return timestamp;
  }

  useEffect(() => {
    fetchAllProposal((pageNumber - 1) * pageSize, PRODUCT_ID, pageSize)
    fetchAllProposalUpData(PRODUCT_ID)
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
      counts: proposalUpData ? proposalUpData?.proposal_count : "-"
    },
    {
      title: "Average Participation",
      counts: proposalUpData ? `${calculateAverageParticipation() + "%"}` : "-"
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
  const navigate = useNavigate();

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
  if (loading) {
    return <Spin />;
  }

  return (
    <div className="app-content-wrapper">
      <div className="back-btn-container">
        <Link to="/more">
          <Button className="back-btn" type="primary">
            Back
          </Button>
        </Link>
      </div>
      <Row>
        <Col>
          <div className="composite-card earn-deposite-card myhome-upper d-block ">
            <div className="myhome-upper-left w-100 ">
              <List
                grid={{
                  gutter: 16,
                  xs: 1,
                  sm: 2,
                  md: 3,
                  lg: 3,
                  xl: 3,
                  xxl: 3,
                }}
                dataSource={data}
                renderItem={item => (
                  <List.Item>
                    <div>
                      <p>{item.title}</p>
                      <h3 className="claim-drop-amount">{item.counts}</h3>
                    </div>
                  </List.Item>
                )}
              />
            </div>
          </div>
        </Col>
      </Row>

      <Row className="mt-3">
        <Col>
          <div className="comdex-card govern-card earn-deposite-card " style={{ padding: "5px 25px 35px 25px" }}>
            <div className="governcard-head ">
              <a href="https://forum.comdex.one/" target="_blank" rel="noreferrer"><Button type="primary" className="btn-filled">Forum</Button></a>
              <Select defaultValue="Filter" className="select-primary ml-2" onChange={(e) => filterAllProposal(e)} suffixIcon={<SvgIcon name="arrow-down" viewbox="0 0 19.244 10.483" />} style={{ width: 120 }} notFoundContent={<NoDataIcon />}>
                <Option value="all" className="govern-select-option">All</Option>
                <Option value="open" >Open</Option>
                <Option value="pending">Pending</Option>
                <Option value="passed" >Passed</Option>
                <Option value="executed">Executed</Option>
                <Option value="rejected">Rejected</Option>
              </Select>
            </div>
            <div className="govern-card-content ">
              {proposalList && proposalList?.length > 0 ? (
                <>
                  {inProgress ? <div className="spinner"><Spin /></div> :
                    proposalList && proposalList.map((item) => {
                      return (
                        <React.Fragment key={item?.id}>
                          <div className="governlist-row" onClick={() => navigate(`./govern-details/${item?.id}`)} >
                            <div className="left-section">
                              <h3>#{item?.id}</h3>
                              <h3>{item?.title}</h3>
                              <p>{item?.description} </p>
                            </div>
                            <div className="right-section">
                              <Row>
                                <Col sm="6">
                                  <label>Vote Starts :</label>
                                  <p>{unixToGMTTime(item?.start_time) || "--/--/--"}</p>
                                </Col>
                                <Col sm="6">
                                  <label>Voting Ends :</label>
                                  <p>{unixToGMTTime(item?.expires?.at_time) || "--/--/--"}</p>
                                </Col>
                                <Col sm="6">
                                  <label>Duration : </label>
                                  <p>{getDuration(item?.duration?.time)}</p>
                                </Col>
                              </Row>
                              <Row>
                                <Col>
                                  <Progress percent={calculateDurationPercentage(item?.start_time, item?.duration?.time)} size="small" />
                                </Col>
                              </Row>
                            </div>
                          </div>
                        </React.Fragment>
                      )
                    })
                  }
                </>

              ) : <div className="mt-3"><NoDataIcon /></div>

              }

            </div>
          </div>
          <Pagination
            defaultCurrent={1}
            onChange={(event) => onPageChange(event)}
            total={totalProposalCount && totalProposalCount}
            pageSize={pageSize}
            hideOnSinglePage={true}
            current={currentActivePage}
          />
        </Col>
      </Row>
    </div>
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
