import * as PropTypes from "prop-types";
import React, { useEffect, useState } from 'react';
import { Col, Row } from "../../../components/common";
import { connect } from "react-redux";
import { Button, message } from "antd";
import Highcharts from "highcharts";
import highchartsMore from "highcharts/highcharts-more";
import solidGauge from "highcharts/modules/solid-gauge";
import HighchartsReact from "highcharts-react-official";
import TooltipIcon from "../../../components/TooltipIcon";
import "./index.scss";

import PlanePic from '../../../assets/images/plane-img.svg';
import MissonCardBg from '../../../assets/images/card-bg.jpg';
import CRONOS_ICON from '../../../assets/images/icons/CRONOS.png';
import EVMOS_ICON from '../../../assets/images/icons/EVMOS.png';
import MNTL_ICON from '../../../assets/images/icons/MNTL.png';
import XPRT_ICON from '../../../assets/images/icons/XPRT.png';
import INJECTIVE_ICON from '../../../assets/images/icons/INJECTIVE.png';
import LUNA2_ICON from '../../../assets/images/icons/LUNA2.png';
import SCRT_ICON from '../../../assets/images/icons/SCRT.png';

import AGORIC_ICON from '../../../assets/images/icons/AGORIC.png';
import AKASH_ICON from '../../../assets/images/icons/AKASH.png';
import ATOM_ICON from '../../../assets/images/icons/ATOM.png';
import AXELAR_ICON from '../../../assets/images/icons/AXELAR.png';
import COMDEX_ICON from '../../../assets/images/icons/COMDEX.png';
import CRESENT_ICON from '../../../assets/images/icons/CRESENT.png';
import JUNO_ICON from '../../../assets/images/icons/JUNO.png';
import XKI_ICON from '../../../assets/images/icons/XKI.png';
import KAVA_ICON from '../../../assets/images/icons/Kava.png';
import OSMO_ICON from '../../../assets/images/icons/OSMO.png';
import REGEN_ICON from '../../../assets/images/icons/REGEN.png';
import SIFCHAIN_ICON from '../../../assets/images/icons/SIFCHAIN.png';
import STARGAZE_ICON from '../../../assets/images/icons/STARGAZE.png';
import UMEE_ICON from '../../../assets/images/icons/UMEE.png';
import KUJIRA_ICON from '../../../assets/images/icons/KUJIRA.png';
import HUAHUA_ICON from '../../../assets/images/icons/HUAHUA.png';
import STATOM_ICON from '../../../assets/images/icons/STATOM.png';
import ChainModal from "./ChainModal";
import { Link } from "react-router-dom";
import { checkEligibility, checkTotalEligibility, timeLeftToClaim, totalStatsOFClaimedData } from '../../../services/airdropContractRead';
import { unixToGMTTime } from '../../../utils/string'
import { useTimer } from 'react-timer-hook';
import { amountConversion, amountConversionWithComma } from "../../../utils/coin";
import { formatNumber } from "../../../utils/number";
import { maginTxChain } from "./magicTxChain";
import { MyTimer } from "../../../components/TimerForAirdrop";
import { setuserEligibilityData } from "../../../actions/airdrop";
import { DEFAULT_CHAIN_ID_FOR_CLAIM_AIRDROP, TOTAL_ACTIVITY, TOTAL_VEHARBOR_ACTIVITY } from "../../../constants/common";
import { useNavigate } from 'react-router-dom';


highchartsMore(Highcharts);
solidGauge(Highcharts);

const Airdrop = ({
  lang,
  address,
  refreshBalance,
  userEligibilityData,
  setuserEligibilityData,

}) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false)
  const [totalTimeLeft, setTotalTimeLeft] = useState(0);
  const [counterEndTime, setCounterEndTime] = useState(0);
  const [totalAllocation, setTotalAllocation] = useState(0)
  const [totalClaimedHarbor, setTotalClaimedHarbor] = useState(0);
  const [totalClaimedveHarbor, setTotalClaimedveHarbor] = useState(0);
  const [claimAllEligibility, setClaimAllEligibility] = useState(false)
  const [totalEligibleToken, setTotalEligibletoken] = useState(0)

  // Query 
  const fetchTimeLeftToClaim = () => {
    timeLeftToClaim().then((res) => {
      setTotalTimeLeft(res)
    }).catch((error) => {
      console.log(error);
    })
  }

  const fetchCheckEligibility = (address, chainId) => {
    setLoading(true)
    checkEligibility(address, chainId).then((res) => {
      setClaimAllEligibility(res)
      setLoading(false)
    }).catch((error) => {
      setLoading(false)
      console.log(error);
    })
  }

  const fetchCheckTotalEligibility = (address) => {
    setLoading(true)
    checkTotalEligibility(address).then((res) => {
      setTotalEligibletoken(res)
      setLoading(false)
    }).catch((error) => {
      setLoading(false)
      console.log(error);
    })
  }

  const fetchTotalStatsOFClaimedData = () => {
    totalStatsOFClaimedData().then((res) => {
      setTotalAllocation(res?.total_allocated)
      setTotalClaimedHarbor(res?.total_harbor_claimed)
      setTotalClaimedveHarbor(res?.total_ve_harbor_claimed)

    }).catch((error) => {
      console.log(error);
    })
  }

  const handleClaimAll = () => {
    fetchCheckEligibility(address, DEFAULT_CHAIN_ID_FOR_CLAIM_AIRDROP)
    navigate(`./complete-mission/${DEFAULT_CHAIN_ID_FOR_CLAIM_AIRDROP}`)
    // if (!claimAllEligibility) {
    //   message.error("Sorry you are not Eligible! 🙁")
    // }
    // else {
    //   message.success("Wow You are Eligible! 🤩")
    //   navigate(`./complete-mission/${DEFAULT_CHAIN_ID_FOR_CLAIM_AIRDROP}`)
    // }
  }

  useEffect(() => {
    if (totalTimeLeft) {
      setCounterEndTime(unixToGMTTime(totalTimeLeft))
    }
  }, [totalTimeLeft])



  useEffect(() => {
    fetchTimeLeftToClaim()
    fetchTotalStatsOFClaimedData()
    fetchCheckEligibility(address, DEFAULT_CHAIN_ID_FOR_CLAIM_AIRDROP)
    fetchCheckTotalEligibility(address)
  }, [address])


  const time = new Date(counterEndTime);
  time.setSeconds(time.getSeconds());


  const options = {
    chart: {
      type: "solidgauge",
      height: "190",
      backgroundColor: null,
    },
    credits: {
      enabled: false,
    },
    title: {
      text: null,
    },
    tooltip: {
      enabled: false
    },
    pane: {
      center: ["50%", "50%"],
      startAngle: -90,
      endAngle: 90,
      background: {
        backgroundColor:
          Highcharts.defaultOptions.legend.backgroundColor || "#36434E",
        innerRadius: "60%",
        outerRadius: "100%",
        shape: "arc",
        borderWidth: 0
      }
    },

    yAxis: {
      min: 0,
      max: 100,
      lineWidth: 0,
      tickPositions: []
    },

    plotOptions: {
      solidgauge: {
        dataLabels: {
          y: 5,
          borderWidth: 0,
          useHTML: true
        }
      }
    },

    series: [
      {
        data: [
          {
            color: "#DED0E7",
            radius: "100%",
            y: 80
          }
        ],
        dataLabels: {
          format:
            '<div style="text-align:center; margin-top: -15px;">' +
            `<span style="font-size:15px" class="total-supply">${formatNumber(amountConversion(totalAllocation || 0))}</span>` +
            "</div>"
        }
      }
    ]
  };

  return (
    <div className="app-content-wrapper">
      <Row className="text-right">
        <Col>
          <Link to="/more"><Button type="primary" className="btn-filled px-4">Back</Button></Link>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="time-left-head">
            <div className="left-text">
              {/* {counterEndTime ? <MyTimer expiryTimestamp={time} text={"Airdrop Claim to Begin"} />
                :
                <div style={{ display: "flex" }}>
                  <div> Time Left to Claim Airdrop </div> <div> <b> 0 </b> <span> D </span> <b>0</b> <span> H </span> <b>0</b> <span> M </span> <b>0</b> <span> S </span> </div>
                </div>
              } */}
              <div style={{ display: "flex" }}>
                <div> Airdrop Claim to Begin Soon </div>
              </div>
            </div>
          </div>
          <Row className="airdrop-upper pt-2">
            <Col xl="4" lg="12">
              <div className="airdrop-upper-card airdrop-upper-card1">
                <h2>Airdrop Details</h2>
                <div className="total-airdrop">
                  <p>Total Airdrop</p>
                  <HighchartsReact highcharts={Highcharts} options={options} />
                </div>
                <div className="airdrop-statics mt-n4">
                  <p className="total-value">Total Claimed $Harbor Airdrop <TooltipIcon text="Airdrop  which has been claimed across all chains and liquidity pools" /></p>
                  <h2>{amountConversionWithComma(totalClaimedHarbor || 0)} <sub className="text-uppercase">harbor</sub></h2>
                </div>
                <div className="airdrop-statics mb-0">
                  <p className="total-value">Total Claimed veHarbor <TooltipIcon text="$veHarbor claimed across all chains and liquidity pools after completing the missions with a locking period of 1 year" /></p>
                  <h2>{amountConversionWithComma(totalClaimedveHarbor || 0)} <sub>ve</sub><sub className="text-uppercase">harbor</sub></h2>
                </div>
              </div>
            </Col>
            <Col xl="4" lg="6">
              <div className="airdrop-upper-card airdrop-upper-card2">
                <h3>Airdrop for Chains with Magic Txn <TooltipIcon text="Users need to perform the Magic Txn for every individual chain listed below to recieve there airdrop which will get distributed to their Comdex address." /></h3>
                <ul>
                  {maginTxChain?.map((item) => {
                    return (
                      <li key={item?.chainId}>
                        <ChainModal currentChain={item} />
                        <p>{item?.chainName}</p>
                      </li>
                    )
                  })}
                </ul>
                <div className="text-center mt-auto">
                  <Button type="primary" className="different-chain-eligibility">Click on different chains to check eligibility</Button>
                </div>
              </div>
            </Col>
            <Col xl="4" lg="6">
              <div className="airdrop-upper-card airdrop-upper-card3">
                <h3>Airdrop for below Chains <TooltipIcon text="$Harbor and $veHarbor airdrop has been distributed to users for below chains and pools. Users need to complete missions to claim it." /></h3>
                <ul>
                  <li>
                    <div className="icons">
                      <div className="icon-inner">
                        <img src={AKASH_ICON} alt="" />
                      </div>
                    </div>
                    <p>AKASH</p>
                  </li>
                  <li>
                    <div className="icons">
                      <div className="icon-inner">
                        <img src={ATOM_ICON} alt="" />
                      </div>
                    </div>
                    <p>ATOM</p>
                  </li>
                  <li>
                    <div className="icons">
                      <div className="icon-inner">
                        <img src={AXELAR_ICON} alt="" />
                      </div>
                    </div>
                    <p>AXELAR</p>
                  </li>
                  <li>
                    <div className="icons">
                      <div className="icon-inner">
                        <img src={COMDEX_ICON} alt="" />
                      </div>
                    </div>
                    <p>COMDEX</p>
                  </li>
                  <li>
                    <div className="icons">
                      <div className="icon-inner">
                        <img src={CRESENT_ICON} alt="" />
                      </div>
                    </div>
                    <p>CRESENT</p>
                  </li>
                  <li>
                    <div className="icons">
                      <div className="icon-inner">
                        <img src={JUNO_ICON} alt="" />
                      </div>
                    </div>
                    <p>JUNO</p>
                  </li>
                  <li>
                    <div className="icons">
                      <div className="icon-inner">
                        <img src={XKI_ICON} alt="" />
                      </div>
                    </div>
                    <p>XKI</p>
                  </li>
                  <li>
                    <div className="icons">
                      <div className="icon-inner">
                        <img src={OSMO_ICON} alt="" />
                      </div>
                    </div>
                    <p>OSMO</p>
                  </li>
                  <li>
                    <div className="icons">
                      <div className="icon-inner">
                        <img src={REGEN_ICON} alt="" />
                      </div>
                    </div>
                    <p>REGEN</p>
                  </li>
                  <li>
                    <div className="icons">
                      <div className="icon-inner">
                        <img src={SIFCHAIN_ICON} alt="" />
                      </div>
                    </div>
                    <p>SIFCHAIN</p>
                  </li>
                  <li>
                    <div className="icons">
                      <div className="icon-inner">
                        <img src={STARGAZE_ICON} alt="" />
                      </div>
                    </div>
                    <p>STARGAZE</p>
                  </li>
                  <li>
                    <div className="icons">
                      <div className="icon-inner">
                        <img src={UMEE_ICON} alt="" />
                      </div>
                    </div>
                    <p>UMEE</p>
                  </li>
                  <li>
                    <div className="icons">
                      <div className="icon-inner">
                        <img src={KUJIRA_ICON} alt="" />
                      </div>
                    </div>
                    <p>KUJIRA</p>
                  </li>

                  <li>
                    <div className="icons">
                      <div className="icon-inner">
                        <img src={HUAHUA_ICON} alt="" />
                      </div>
                    </div>
                    <p>HUAHUA</p>
                  </li>

                  <li>
                    <div className="icons">
                      <div className="icon-inner">
                        <img src={KAVA_ICON} alt="" />
                      </div>
                    </div>
                    <p>KAVA</p>
                  </li>

                  <li className="group-li pool-group-width">
                    <div className="icon-group">
                      <div className="icons">
                        <div className="icon-inner">
                          <img src={COMDEX_ICON} alt="" />
                        </div>
                      </div>
                      <div className="icons">
                        <div className="icon-inner">
                          <img src={ATOM_ICON} alt="" />
                        </div>
                      </div>
                    </div>
                    <p>LP POOL 600</p>
                  </li>

                  <li className="group-li-40 pool-group-width">
                    <div className="icon-group">
                      <div className="icons">
                        <div className="icon-inner">
                          <img src={COMDEX_ICON} alt="" />
                        </div>
                      </div>
                      <div className="icons">
                        <div className="icon-inner">
                          <img src={OSMO_ICON} alt="" />
                        </div>
                      </div>
                    </div>
                    <p>LP POOL 601</p>
                  </li>
                  <li className="group-li-40 pool-group-width">
                    <div className="icon-group">
                      <div className="icons">
                        <div className="icon-inner">
                          <img src={STATOM_ICON} alt="" />
                        </div>
                      </div>
                      <div className="icons">
                        <div className="icon-inner">
                          <img src={ATOM_ICON} alt="" />
                        </div>
                      </div>
                    </div>
                    <p>LP POOL 803</p>
                  </li>
                </ul>
                <div className="text-center mt-auto allChain-mission-btn-container" >
                  <Button type="primary" disabled={true}  >Check Eligibility</Button>
                  <Button type="primary" className="btn-filled mission-btn" onClick={() => handleClaimAll()}>Complete Mission</Button>
                </div>
              </div>
            </Col>
          </Row>
          <Row className="airdrop-bottom">
            <Col lg="4">
              <div className="airdrop-bottom-card airdrop-bottom-card1">
                <h2>Your Airdrop Details</h2>
                <div className="airdrop-statics">
                  <p className="total-value">$Harbor Airdrop <TooltipIcon text="User’s Total $Harbor airdrop across all chains and pools" /></p>
                  <h2>{amountConversionWithComma(totalEligibleToken / TOTAL_ACTIVITY || 0)} <sub className="text-uppercase">harbor</sub></h2>
                </div>
                <div className="airdrop-statics mb-0">
                  <p className="total-value">$veHarbor Airdrop <TooltipIcon text="User’s Total amount of $veharbor having a locking period of 1 year once he completes the missions" /></p>
                  <h2>{amountConversionWithComma((Number(totalEligibleToken / TOTAL_ACTIVITY) * Number(TOTAL_VEHARBOR_ACTIVITY)) || 0)} <sub>ve</sub><sub className="text-uppercase">harbor</sub></h2>
                </div>
              </div>
            </Col>
            <Col lg="8">
              <div className="airdrop-bottom-card airdrop-bottom-card2">
                <img className="card-bg" src={MissonCardBg} alt="bg" />
                <div className="airdrop-bottom-card2-inner">
                  <div>
                    <h1>Complete missions to get <br /> <span>HARBOR</span> Airdrop</h1>
                  </div>
                  <img src={PlanePic} alt="" />
                </div>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

Airdrop.propTypes = {
  lang: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  refreshBalance: PropTypes.number.isRequired,
  userEligibilityData: PropTypes.object.isRequired,
};

const stateToProps = (state) => {
  return {
    lang: state.language,
    address: state.account.address,
    refreshBalance: state.account.refreshBalance,
    userEligibilityData: state.airdrop.userEligibilityData,
  };
};

const actionsToProps = {
  setuserEligibilityData,
};

export default connect(stateToProps, actionsToProps)(Airdrop);
