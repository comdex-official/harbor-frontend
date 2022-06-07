import * as PropTypes from "prop-types";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Col, Row, SvgIcon } from "../../../../components/common";
import { connect } from "react-redux";
import { Button, List } from "antd";
import "./index.scss";
import VoteNowModal from "../VoteNowModal";
import { Link } from "react-router-dom";
import { useParams } from "react-router";
import { checkUserVote, fetchSpecificProposalData } from "../../../../services/contractsRead";
import { useEffect } from "react";
import { setCurrentProposal, setUserVote } from "../../../../actions/govern";
import { truncateString } from "../../../../utils/string";
import Copy from "../../../../components/Copy";
import { useState } from "react";
import moment from "moment";
import { formatNumber } from "../../../../utils/number";

const GovernDetails = ({
  lang,
  address,
  currentProposal,
  setCurrentProposal,
  userVote,
  setUserVote
}) => {
  const { proposalId } = useParams();
  let currentProposalId = Number(proposalId);
  const [getVotes, setGetVotes] = useState({
    yes: 0,
    no: 0,
    veto: 0,
    abstain: 0
  });


  const fetchSpecificProposal = (proposalId) => {
    fetchSpecificProposalData(proposalId).then((res) => {
      setCurrentProposal(res);
    }).catch((err) => {
    })
  }
  const fetchUserVote = (proposalId, address) => {
    checkUserVote(proposalId, address).then((res) => {
      setUserVote(res.vote)
    }).catch((err) => {
    })
  }


  useEffect(() => {
    fetchSpecificProposal(currentProposalId)
    fetchUserVote(currentProposalId, address)
  }, [address])

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
  const calculateVotes = () => {
    let value = currentProposal?.votes;
    let yes = Number(value?.yes);
    let no = Number(value?.no);
    let veto = Number(value?.veto);
    let abstain = Number(value?.abstain);
    let totalValue = yes + no + abstain + veto;

    yes = Number((yes / totalValue) * 100).toFixed(2)
    no = Number((no / totalValue) * 100).toFixed(2)
    veto = Number((veto / totalValue) * 100).toFixed(2)
    abstain = Number((abstain / totalValue) * 100).toFixed(2)

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
    timestamp = timestamp.format("DD/MM/YYYY hh:mm:ss")
    return timestamp;
  }
  const votingStartTime = unixToGMTTime(currentProposal?.start_time);
  const votingEndTime = unixToGMTTime(currentProposal?.expires?.at_time);
  const duration = moment.duration(currentProposal?.duration?.time, 'seconds');



  const data = [
    {
      title: "Voting Starts",
      counts: votingStartTime != "Invalid date" ? votingStartTime : "--/--/-- 00:00:00"
    },
    {
      title: "Voting Ends",
      counts: votingEndTime != "Invalid date" ? votingEndTime : "--/--/-- 00:00:00"
    },
    {
      title: "Duration",
      counts: votingEndTime != "Invalid date" ? `${duration.days()} Days ${duration.hours()} Hours` : "--/--/-- 00:00:00"
    },
    {
      title: "Proposer",
      counts: currentProposal?.proposer ? <div className="flex "><span className="mr-2">{truncateString(currentProposal?.proposer, 6, 6)}</span><span><Copy text={currentProposal?.proposer} /></span> </div> : "------",

    }
  ];
  const dataVote = [
    {
      title: "Total Vote",
      counts: currentProposal ? `${(calculateTotalValue() || "0") + " " + "HARBOR"}` : 0,
    }
  ];
  const Options = {
    chart: {
      type: "pie",
      backgroundColor: null,
      height: 180,
      margin: 5,
    },
    credits: {
      enabled: false,
    },
    title: {
      text: null,
    },
    subtitle: {
      floating: true,
      style: {
        fontSize: "25px",
        fontWeight: "500",
        fontFamily: "Lexend Deca",
        color: "#fff",
      },
      y: 70,
    },
    plotOptions: {
      pie: {
        showInLegend: false,
        size: "120%",
        innerSize: "75%",
        borderWidth: 0,
        dataLabels: {
          enabled: false,
          distance: -14,
          style: {
            fontsize: 50,
          },
        },
      },
    },
    series: [
      {
        states: {
          hover: {
            enabled: true,
          },
        },
        name: "",
        data: [
          {
            name: "Yes",
            y: Number(getVotes?.yes || 0),
            color: "#665AA6",
          },
          {
            name: "No",
            y: Number(getVotes?.no || 0),
            color: "#BFA9D7",
          },
          {
            name: "No With Veto",
            y: Number(getVotes?.veto || 0),
            color: "#E7DDF1",
          },
          {
            name: "Abstain",
            y: Number(getVotes?.abstain || 0),
            color: "#81808F",
          },
        ],
      },
    ],
  };

  const getUserVote = (vote) => {
    if (vote == "veto") {
      return "No with veto"
    }
    else {
      return vote
    }
  }

  return (
    <div className="app-content-wrapper">
      <Row>
        <Col className="text-right mb-3">
          <Link to="/govern"><Button className="back-btn" type="primary">Back</Button></Link>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="composite-card myhome-upper earn-deposite-card d-block">
            <div className="card-header">
              PROPOSAL DETAILS
            </div>
            <div className="myhome-upper-left w-100">
              <List
                grid={{
                  gutter: 16,
                  xs: 1,
                  sm: 2,
                  md: 2,
                  lg: 4,
                  xl: 4,
                  xxl: 4,
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


      <Row>
        <Col md="6">
          <div className="composite-card govern-card2 earn-deposite-card h-100">
            <Row>
              <Col>
                <h3>#{currentProposal?.id || "-"}</h3>
              </Col>
              <Col className="text-right">
                <Button type="primary" className="btn-filled">{currentProposal?.status || "-"}</Button>
              </Col>
            </Row>
            <Row>
              <Col>
                <h2>{currentProposal?.title || "---"}</h2>
                <p>{currentProposal?.description || "----"} </p>
              </Col>
            </Row>
          </div>
        </Col>
        <Col md="6">
          <div className="composite-card govern-card2 earn-deposite-card">
            <Row>
              <Col className="text-right">
                {/* {userVote == null ? <VoteNowModal /> : <Button className="back-btn" type="primary">Your Vote :  <span className="user-vote"> {getUserVote(userVote?.vote) || " ---"}</span> </Button>} */}
                <VoteNowModal />

              </Col>
            </Row>
            <Row>
              <Col>
                <div className="govern-dlt-card">
                  <div className="govern-dlt-chart">
                    <HighchartsReact highcharts={Highcharts} options={Options} />
                  </div>
                  <div className="govern-dlt-right">
                    <List
                      grid={{
                        gutter: 16,
                        xs: 1,
                      }}
                      dataSource={dataVote}
                      renderItem={item => (
                        <List.Item>
                          <div>
                            <p>{item.title}</p>
                            <h3>{item.counts}</h3>
                          </div>
                        </List.Item>
                      )}
                    />
                    <ul className="vote-lists">
                      <li>
                        <SvgIcon name="rectangle" viewbox="0 0 34 34" />
                        <div>
                          <label>Yes</label>
                          <p>{getVotes?.yes || 0}%</p>
                        </div>
                      </li>
                      <li>
                        <SvgIcon name="rectangle" viewbox="0 0 34 34" />
                        <div>
                          <label>No</label>
                          <p>{getVotes?.no || 0}%</p>
                        </div>
                      </li>
                      <li>
                        <SvgIcon name="rectangle" viewbox="0 0 34 34" />
                        <div>
                          <label>No With Veto </label>
                          <p>{getVotes?.veto || 0}%</p>
                        </div>
                      </li>
                      <li>
                        <SvgIcon name="rectangle" viewbox="0 0 34 34" />
                        <div>
                          <label>Abstain</label>
                          <p>{getVotes?.abstain || 0}%</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </div>
  );
};

GovernDetails.propTypes = {
  lang: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  currentProposal: PropTypes.array.isRequired,
  userVote: PropTypes.array.isRequired,
};

const stateToProps = (state) => {
  return {
    lang: state.language,
    address: state.account.address,
    currentProposal: state.govern.currentProposal,
    userVote: state.govern.userVote,
  };
};

const actionsToProps = {
  setCurrentProposal,
  setUserVote,
};

export default connect(stateToProps, actionsToProps)(GovernDetails);
