import * as PropTypes from "prop-types";
import { Col, Row, SvgIcon } from "../../../components/common";
import { connect } from "react-redux";
import { Link, useNavigate } from 'react-router-dom';
import { Button, List, Select, Progress } from "antd";
import "./index.scss";
import { fetchProposalUpData, totalProposal } from "../../../services/contractsRead";
import React, { useEffect } from "react";
import { PRODUCT_ID } from '../../../constants/common';
import moment from "moment";
import { setAllProposal, setProposalUpData } from "../../../actions/govern";

const { Option } = Select;



const Govern = ({
  lang,
  address,
  allProposal,
  setAllProposal,
  proposalUpData,
  setProposalUpData,
}) => {

  // ******* Get Vault Query *********
  // *****Fetch all proposal***** 
  const fetchAllProposal = (productId) => {
    totalProposal(productId).then((res) => {
      setAllProposal(res)
    })
  }
  const fetchAllProposalUpData = (productId) => {
    fetchProposalUpData(productId).then((res) => {
      setProposalUpData(res)
    })
  }

  const unixToGMTTime = (time) => {
    let newTime = Math.floor(time / 1000000000);
    var timestamp = moment.unix(newTime);
    timestamp = timestamp.format("DD/MMMM/YYYY")
    return timestamp;
  }

  useEffect(() => {
    fetchAllProposal(PRODUCT_ID)
    fetchAllProposalUpData(PRODUCT_ID)
  }, [address])

  const calculateAverageParticipation = () => {
    let avgParticipation = proposalUpData?.active_participation_supply
    avgParticipation = avgParticipation / proposalUpData?.proposal_count
    avgParticipation = avgParticipation / ((proposalUpData?.current_supply))
    avgParticipation = avgParticipation * 100
    return avgParticipation;
  }

  const data = [
    {
      title: "Total Staked",
      counts: proposalUpData ? (proposalUpData?.current_supply) / 1000000 : "-"
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
  const navigate = useNavigate();

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
          <div className="comdex-card govern-card earn-deposite-card ">
            <div className="governcard-head ">
              {/* <Button type="primary" className="btn-filled">New Proposal</Button> */}
              <Button type="primary" className="btn-filled">Forum</Button>
              <Select defaultValue="Filter" className="select-primary   ml-2" suffixIcon={<SvgIcon name="arrow-down" viewbox="0 0 19.244 10.483" />} style={{ width: 120 }}>
                <Option value="passed" className="govern-select-option">Passed</Option>
                <Option value="rejected">Rejected</Option>
                <Option value="pending">Pending</Option>
                <Option value="voting">Voting</Option>
              </Select>
            </div>
            <div className="govern-card-content ">
              {allProposal && allProposal.map((item) => {
                return (
                  <React.Fragment key={item?.id}>
                    <div className="governlist-row" onClick={() => navigate(`/govern-details/${item?.id}`)} >
                      <div className="left-section">
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
                            <Progress percent={30} size="small" />
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </React.Fragment>
                )

              })}



              {/* <div className="governlist-row" onClick={() => navigate("/govern-details")}>
                <div className="left-section">
                  <h3>Increasing MaxValidator to 100</h3>
                  <p>adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, </p>
                </div>
                <div className="right-section">
                  <Row>
                    <Col sm="6">
                      <label>Vote Starts :</label>
                      <p>24th April, 2022</p>
                    </Col>
                    <Col sm="6">
                      <label>Voting Ends :</label>
                      <p>26th April, 2022</p>
                    </Col>
                    <Col sm="6">
                      <label>Duration : </label>
                      <p>3 days</p>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Progress percent={30} size="small" />
                    </Col>
                  </Row>
                </div>
              </div> */}

            </div>
          </div>
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
};

const stateToProps = (state) => {
  return {
    lang: state.language,
    address: state.account.address,
    allProposal: state.govern.allProposal,
    proposalUpData: state.govern.proposalUpData
  };
};

const actionsToProps = {
  setAllProposal,
  setProposalUpData,
};

export default connect(stateToProps, actionsToProps)(Govern);
