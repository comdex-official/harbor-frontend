import React, { useEffect, useState } from 'react'
import * as PropTypes from "prop-types";
import { Col, Row, SvgIcon } from "../../../components/common";
import './index.scss';
import './EmissionDistributionAllModal/index.scss';
import { connect } from "react-redux";
import { Alert, Button, Input, List, message, Modal, notification, Slider, Switch, Table } from "antd";
import { denomToSymbol, iconNameFromDenom, symbolToDenom, unixToGMTTime } from "../../../utils/string";
import { amountConversion, amountConversionWithComma } from '../../../utils/coin';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE, DOLLAR_DECIMALS, PRODUCT_ID, ZERO_DOLLAR_DECIMALS } from '../../../constants/common';
import { emissiondata, totalVTokens, userCurrentProposal, userProposalAllUpData, userProposalAllUpPoolData, userProposalProjectedEmission, votingCurrentProposal, votingCurrentProposalId, votingTotalBribs, votingTotalVotes, votingUserVote } from '../../../services/voteContractsRead';
import { queryAssets, queryPair, queryPairVault } from '../../../services/asset/query';
import { queryMintedTokenSpecificVaultType, queryOwnerVaults, queryOwnerVaultsInfo, queryUserVaults } from '../../../services/vault/query';
import { transactionForVotePairProposal } from '../../../services/voteContractsWrites';
import { setBalanceRefresh } from "../../../actions/account";
import { Link } from 'react-router-dom';
import moment from 'moment';
import Snack from '../../../components/common/Snack';
import variables from '../../../utils/variables';
import { comdex } from '../../../config/network';
import NoDataIcon from '../../../components/common/NoDataIcon';
import Pool from './pool';
import { queryFarmedPoolCoin, queryFarmer, queryPoolsList, queryTotalActiveAndQueuedPoolCoin } from '../../../services/pools/query';
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { commaSeparator, formatNumber } from '../../../utils/number';
import { fetchRestPrices } from '../../../services/oracle/query';
import ViewAllToolTip from './viewAllModal';
import { combineColor, poolColor, vaultColor } from './color';
import Rebase from './Rebase';
import Reward from './Rewards';
import EmissionDistributionAllModal from './EmissionDistributionAllModal';
import ExternalIncentivesModal from './ExternalIncentivesModal';
import processingAnimation from "../../../assets/lottefiles/processing.json";
import successAnimation from "../../../assets/lottefiles/success.json";
import failedAnimation from "../../../assets/lottefiles/failed.json";
import Lottie from 'react-lottie';
import { emissionInfo, vestingIssuedTokens } from '../../../services/vestingContractsRead';
import { MyTimer } from '../../../components/TimerForAirdrop';
import TooltipIcon from '../../../components/TooltipIcon';

const Vote = ({
  lang,
  address,
  refreshBalance,
  setBalanceRefresh,
  assetMap,
}) => {


  const [proposalId, setProposalId] = useState();
  const [proposalExtenderPair, setProposalExtenderPair] = useState();
  const [currentProposalAllData, setCurrentProposalAllData] = useState();
  const [disableVoteBtn, setVoteDisableBtn] = useState(true)
  const [allProposalData, setAllProposalData] = useState();
  const [allProposalPoolData, setAllProposalPoolData] = useState();
  const [btnLoading, setBtnLoading] = useState(0);
  const [pairVaultData, setPairValutData] = useState({})
  const [assetList, setAssetList] = useState();
  const [pairIdData, setPairIdData] = useState({});
  const [totalBorrowed, setTotalBorrowed] = useState({});
  const [vaultId, setVaultId] = useState({});
  const [myBorrowed, setMyBorrowed] = useState({});

  const [totalVotingPower, setTotalVotingPower] = useState(0);
  const [protectedEmission, setProtectedEmission] = useState(0);
  const [poolList, setPoolList] = useState();
  const [concatedExtendedPair, setConcatedExtendedPair] = useState([]);
  const [concatedPairName, setConcatedPairName] = useState([]);
  const [cswapPrice, setCswapPrice] = useState([])
  const [userPoolFarmedData, setUserPoolFarmedData] = useState({})
  const [totalPoolFarmedData, setTotalPoolFarmedData] = useState({})
  const [userEmission, setUserEmission] = useState(0)
  const [poolsName, setPoolsName] = useState({})
  const [allPairTotalVote, setAllPairTotalVote] = useState({})


  // ---------------------------net Variable-----------------------------------
  const [inputValue, setInputValue] = useState(0);

  const [userCurrentProposalData, setUserCurrentProposalData] = useState();
  const [userCurrentProposalFilterData, setUserCurrentProposalFilterData] = useState();
  const [userVoteArray, setUserVoteArray] = useState({})
  const [sumOfVotes, setSumOfVotes] = useState(0);
  const [updatedUserVote, setUpdatedUserVote] = useState({})
  const [lastSelectedSlider, setLastSelectedSlider] = useState()
  const [inProcess, setInProcess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inputSearch, setInputSearch] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [animationProcessing, setAnimationProcesing] = useState(false);
  const [animationSuccess, setAnimationSuccess] = useState(false);
  const [animationFailed, setAnimationFailed] = useState(false)
  const [vestingNFTId, setVestingNFTId] = useState();
  const [issuedveHARBOR, setIssuedveHARBOR] = useState(0);
  const [topProposalData, setTopProposalData] = useState()
  const [proposalInActive, setProposalInActive] = useState(true);
  const [emissionDataLoading, setEmissionDataLoading] = useState(false)
  const [hideZeroBalance, setHideZeroBalance] = useState(false)
  const [totalEmission, setTotalEmission] = useState(0)

  const processing = {
    loop: true,
    autoplay: true,
    animationData: processingAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const success = {
    loop: true,
    autoplay: true,
    animationData: successAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const failed = {
    loop: true,
    autoplay: true,
    animationData: failedAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };


  // Query 
  const fetchVotingCurrentProposalId = () => {
    setLoading(true)
    votingCurrentProposalId(PRODUCT_ID).then((res) => {
      setProposalId(res)
      setLoading(false)
    }).catch((error) => {
      setLoading(false)
      console.log(error);
    })
  }

  const fetchVotingCurrentProposal = (proposalId) => {
    votingCurrentProposal(proposalId).then((res) => {
      setProposalExtenderPair(res?.extended_pair)
      setCurrentProposalAllData(res)
    }).catch((error) => {
      console.log(error);
    })
  }

  const fetchuserProposalProjectedEmission = (proposalId) => {
    userProposalProjectedEmission(proposalId).then((res) => {
      setProtectedEmission(amountConversion(res))
    }).catch((error) => {
      console.log(error);
    })
  }

  const unixToUTCTime = (time) => {
    // *Removing miliSec from unix time 
    let newTime = Math.floor(time / 1000000000);
    var timestamp = moment.unix(newTime);
    timestamp = moment.utc(timestamp).format("dddd DD-MMMM-YYYY [at] HH:mm:ss [UTC]")
    return timestamp;
  }

  const getProposalTimeExpiredOrNot = () => {
    let endTime = currentProposalAllData?.voting_end_time;
    // *Removing miliSec from unix time 
    let newEndTime = Math.floor(endTime / 1000000000);
    let currentTime = moment().unix();
    if (currentTime > newEndTime) {
      return setVoteDisableBtn(true)
    }
    else {
      return setVoteDisableBtn(false)
    }
  }

  const calculteVotingTime = () => {
    let endDate = currentProposalAllData?.voting_end_time;
    endDate = unixToUTCTime(endDate);
    if (endDate === "Invalid date") {
      return "Loading... "
    }
    return endDate;
  }

  const votingStart = () => {
    let startDate = currentProposalAllData?.voting_start_time;
    // *Removing miliSec from unix time 
    let newTime = Math.floor(startDate / 1000000000);
    var timestamp = moment.unix(newTime);
    timestamp = moment.utc(timestamp).format("YYYY-MM-DD HH:mm:ss [UTC]")
    if (timestamp === "Invalid date") {
      return "0000-00-00 00:00:00 UTC"
    }
    return timestamp;
  }

  const votingEnd = () => {
    let endDate = currentProposalAllData?.voting_end_time;
    let newTime = Math.floor(endDate / 1000000000);
    var counterEndTime = moment.unix(newTime);
    counterEndTime = counterEndTime.format("DD/MMMM/YYYY HH:mm:ss");
    const time = new Date(counterEndTime);
    time.setSeconds(time.getSeconds());
    return time;
  }

  const calculteVotingStartTime = () => {
    let startDate = currentProposalAllData?.voting_start_time;
    startDate = unixToUTCTime(startDate);
    if (startDate === "Invalid date") {
      return ""
    }
    return startDate;
  }

  const fetchAssets = (offset, limit, countTotal, reverse) => {
    queryAssets(offset, limit, countTotal, reverse, (error, data) => {
      if (error) {
        message.error(error);
        return;
      }
      setAssetList(data.assets)
    });
  };

  const fetchTotalVTokens = (address, height) => {
    totalVTokens(address, height).then((res) => {
      setIssuedveHARBOR(Number(res))
      setTotalVotingPower(res)
    }).catch((error) => {
      console.log(error);
    })
  }

  const calculateTotalVotes = (value) => {
    let calculatePercentage = 0;

    calculatePercentage = (Number(value) / Number(amountConversion(currentProposalAllData?.total_voted_weight || 0, DOLLAR_DECIMALS))) * 100;
    calculatePercentage = Number(calculatePercentage || 0).toFixed(DOLLAR_DECIMALS)
    if (calculatePercentage === "Infinity" || calculatePercentage === Infinity) {
      return 0
    } else {
      return calculatePercentage;
    }
  }

  useEffect(() => {
    fetchVotingCurrentProposalId()
    if (proposalId) {
      fetchVotingCurrentProposal(proposalId)
    } else {
      setProposalExtenderPair("")
    }
  }, [address, proposalId, refreshBalance])


  useEffect(() => {
    if (proposalId) {
      fetchuserProposalProjectedEmission(proposalId)
    }
  }, [address, proposalId, refreshBalance])


  useEffect(() => {
    if (currentProposalAllData) {
      fetchTotalVTokens(address, currentProposalAllData?.height)
      getProposalTimeExpiredOrNot()
    }
  }, [address, refreshBalance, currentProposalAllData])

  useEffect(() => {
    fetchAssets(
      (DEFAULT_PAGE_NUMBER - 1) * (DEFAULT_PAGE_SIZE * 2),
      (DEFAULT_PAGE_SIZE * 2),
      true,
      false
    );
    fetchRestPrices((error, result) => {
      if (error) {
        console.log(error, "Price Error");
      }
      setCswapPrice(result)
    })
  }, [address])



  const data = [
    {
      title: "Voting Ends In",
      counts: currentProposalAllData ? <MyTimer expiryTimestamp={votingEnd()} /> : <div> 0 <small>D</small> 0 <small>H</small> 0 <small>M</small> 0 <small>S</small>  </div>
    },

    {
      title: <>
        Week No.
      </>,
      counts: proposalId || 0
    },
    // {
    //   title: <>
    //     Your Emission <TooltipIcon text='This is the estimated emission for a user based on the overall voting. Users will receive this in their wallet once the emission is completed.' />
    //   </>,
    //   counts: `${formatNumber(userEmission || 0)} HARBOR`
    // },

    {
      title: "My Voting Power",
      counts: `${formatNumber(amountConversion(Number(issuedveHARBOR), DOLLAR_DECIMALS || 0) || 0)} veHARBOR`
    },

    {
      title: `Total Emission`,
      counts: `${formatNumber(Number(totalEmission || 0).toFixed(DOLLAR_DECIMALS))} HARBOR`
    },

    // {
    //   title: `Week ${proposalId || "-"} Total Emission`,
    //   counts: `${formatNumber(protectedEmission || 0)} HARBOR`
    // },
  ];

  const checkProposalOverForAlert = () => {
    let endDate = currentProposalAllData?.voting_end_time;
    // Removing miliSec 
    endDate = Math.floor(endDate / 1000000000);
    var counterTime = moment().unix();
    let isProposalOver = counterTime > endDate;
    return isProposalOver;
  }

  checkProposalOverForAlert()






  const refreshAuctionButton = {
    right: (
      <>
        <Row >
          <div className="mr-4">
            <Rebase />
          </div>
          <div className="ml-2">
            <Reward />
          </div>
        </Row>
      </>
    ),
  };


  // ------------------------------New Code from here------------------------------ 

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setAnimationSuccess(false);
    setAnimationFailed(false)
    setAnimationProcesing(false)
    setIsModalOpen(false);
  };


  const onChange = (extendedPairId, value) => {
    setUserVoteArray((prevState) => ({
      ...prevState, [extendedPairId]: Number(value)
    }))
    setLastSelectedSlider(extendedPairId)
  };

  const fetchuserCurrentProposal = (address, proposalId) => {
    setLoading(true)
    userCurrentProposal(address, proposalId,).then((res) => {
      console.log(res, "User proposal current data");
      setUserCurrentProposalData(res)
    }).catch((error) => {
      setLoading(false)
      console.log(error);
    })
  };

  const fetchEmissiondata = (address) => {
    setEmissionDataLoading(true)
    emissiondata(address, (error, result) => {

      if (error) {
        setEmissionDataLoading(false)
        message.error(error);
        return;
      }

      result?.data.map((item) => {
        setUserVoteArray((prevState) => ({
          ...prevState, [item?.pair_id]: Number(item?.user_vote_ratio) * 100
        }))
      })

      if (hideZeroBalance) {
        let searchedName = result?.data?.filter((item) => Number(item?.user_position) > 0)
        setUserCurrentProposalFilterData(searchedName)
      } else {
        setUserCurrentProposalFilterData(result?.data)
      }

      setUserCurrentProposalData(result?.data)
      // setUserCurrentProposalFilterData(result?.data)
      setEmissionDataLoading(false)
    });
  }

  const fetchVestingLockNFTData = (address) => {
    setInProcess(true)
    vestingIssuedTokens(address).then((res) => {
      setVestingNFTId(res)
      setInProcess(false)
    }).catch((error) => {
      setVestingNFTId('')
      setInProcess(false)
      console.log(error);
    })
  }
  const fetchEmissionInfo = (appId) => {
    setInProcess(true)
    emissionInfo(appId).then((res) => {
      let totalEmission = Number(res?.emission_rate) * amountConversion(Number(res?.rewards_pending));
      setTotalEmission(totalEmission)
      setInProcess(false)
    }).catch((error) => {
      setInProcess(false)
      console.log(error);
    })
  }

  const handleVote = (item, index) => {
    setIsModalOpen(true)
    setInProcess(true)
    setBtnLoading(index)
    setAnimationProcesing(true)
    if (address) {
      if (proposalId) {
        const extendedPairId = Object.keys(userVoteArray).map(Number);
        const ratio = Object.values(userVoteArray).map(val => (val / 100).toString());

        transactionForVotePairProposal(address, PRODUCT_ID, proposalId, extendedPairId, ratio, (error, result) => {
          if (error) {
            message.error(error?.rawLog || "Transaction Failed")
            setInProcess(false)
            setAnimationProcesing(false);
            setAnimationFailed(true)
            setInputSearch("")
            return;
          }
          message.success(
            < Snack
              message={variables[lang].tx_success}
              explorerUrlToTx={comdex?.explorerUrlToTx}
              hash={result?.transactionHash}
            />
          )
          setBalanceRefresh(refreshBalance + 1);
          setInProcess(false)
          setAnimationProcesing(false);
          setAnimationSuccess(true)
          setInputSearch("")
        })

        // }
      } else {
        setInProcess(false)
        setAnimationProcesing(false);
        setAnimationFailed(true)
        setInputSearch("")
        message.error("")
      }
    }
    else {
      setInProcess(false)
      setAnimationProcesing(false);
      setAnimationFailed(true)
      message.error("Please Connect Wallet")
    }
  }

  const handleInputSearch = (value) => {
    let searchedName = userCurrentProposalData?.filter((item) => denomToSymbol(item?.base_coin).toLowerCase().includes(value.target.value.toLowerCase()) || (item?.pair_name).toLowerCase().includes(value.target.value.toLowerCase()))
    setUserCurrentProposalFilterData(searchedName)
    setInputSearch(value.target.value)
  }

  const handleSwitchChange = (value) => {
    console.log(value);
    setHideZeroBalance(value)
    if (value) {
      let searchedName = userCurrentProposalData?.filter((item) => Number(item?.user_position) > 0)
      setUserCurrentProposalFilterData(searchedName)
    }
    else {
      setUserCurrentProposalFilterData(userCurrentProposalData)
    }
  }

  // *calculate user emission 
  const calculateUserEmission = (_myBorrowed, _totalBorrowed, _totalVoteOfPair) => {
    // *formula = ((myBorrowed/TotalBorrowed) * (Total Vote of Particular Pair/total_vote_weight))*projected_emission
    // *formula = ((myBorrowed/TotalBorrowed) * (userVote))*projected_emission

    let myBorrowed = _myBorrowed || 0;
    let totalBorrowed = _totalBorrowed || 0;
    let totalVoteOfPair = _totalVoteOfPair || 0;
    let totalWeight = currentProposalAllData?.total_voted_weight || 0;
    let projectedEmission = protectedEmission;

    let calculatedEmission = (Number((Number(myBorrowed) / Number(totalBorrowed)) * (Number(totalVoteOfPair) / Number(totalWeight))) * projectedEmission)

    if (isNaN(calculatedEmission)) {
      return 0;
    } else {
      return Number(calculatedEmission);
    }

  }

  const calculateTotalveHARBOR = () => {
    let totalveHARBORLocked = 0;
    let tokens = vestingNFTId && vestingNFTId?.reverse().map((item) => {
      return Number(amountConversion(item?.vtoken?.amount));
    })
    totalveHARBORLocked = tokens?.reduce((partialSum, a) => partialSum + a, 0)
    { totalveHARBORLocked && setIssuedveHARBOR(totalveHARBORLocked) }
  }


  function getColor(index) {
    const length = combineColor.length;
    const wrappedIndex = index % length;
    return combineColor[wrappedIndex];
  }

  const calculateVaultEmission = (id) => {
    // *formula = ((Total Vote of Particular Pair/total_vote_weight))*projected_emission

    let totalVoteOfPair = userCurrentProposalData?.filter((item) => item?.pair_id === id);
    totalVoteOfPair = totalVoteOfPair?.[0]?.total_vote || 0
    let totalWeight = currentProposalAllData?.total_voted_weight || 0;
    let projectedEmission = protectedEmission;

    let calculatedEmission = ((Number(totalVoteOfPair) / Number(totalWeight)) * projectedEmission)

    if (isNaN(calculatedEmission) || calculatedEmission === Infinity) {
      return 0;
    } else {
      return Number(calculatedEmission);
    }

  }

  useEffect(() => {
    let totalUserEmission = 0
    userCurrentProposalData && userCurrentProposalData?.map((item, index) => {
      totalUserEmission = totalUserEmission + calculateUserEmission(item?.user_position, item?.total_position, item?.total_vote)
    })

    if (isNaN(totalUserEmission) || totalUserEmission === Infinity) {
      setUserEmission(0)
    } else {
      setUserEmission(totalUserEmission || 0)
    }
  }, [userCurrentProposalData, currentProposalAllData, protectedEmission])


  useEffect(() => {
    if (address) {
      // fetchuserCurrentProposal(address, PRODUCT_ID)

      // Emissiom Data from api 
      fetchEmissiondata(address)
    }
  }, [address, refreshBalance])

  useEffect(() => {
    if (address) {
      fetchVestingLockNFTData(address)
    }
  }, [address])

  useEffect(() => {
    fetchEmissionInfo(PRODUCT_ID)
  }, [])


  useEffect(() => {
    if (userCurrentProposalData) {
      let filteredData = [...userCurrentProposalData];
      filteredData.sort((a, b) => calculateTotalVotes(amountConversion(b?.total_vote || 0, 6) || 0) - calculateTotalVotes(amountConversion(a?.total_vote || 0, 6) || 0));
      setTopProposalData(filteredData)
    }

  }, [userCurrentProposalData, currentProposalAllData])



  const PieChart1 = {
    chart: {
      type: "pie",
      backgroundColor: null,
      height: 150,
      margin: 0,
      style: {
        fontFamily: 'Montserrat'
      }
    },
    credits: {
      enabled: false,
    },
    title: {
      text: null,
    },
    plotOptions: {
      pie: {
        showInLegend: false,
        size: "110%",
        borderWidth: 0,
        innerSize: "78%",
        className: "pie-chart totalvalue-chart",
        dataLabels: {
          enabled: false,
          distance: -14,
          style: {
            fontsize: 50,
          },
        },
      },
    },
    tooltip: {
      formatter: function () {
        return (
          '<div style="text-align:center; font-weight:800; ">' +
          Number(calculateTotalVotes(amountConversion(Number(this.y) || 0, 6) || 0)) + " %" +
          "<br />" +
          '<small style="font-size: 10px; font-weight:400;">' +
          this.point.name +
          "</small>" +
          "</div>"
        );
      },
      useHTML: true,
      backgroundColor: "#232231",
      borderColor: "#fff",
      borderRadius: 10,
      zIndex: 99,
      style: {
        color: "#fff",
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
        data: topProposalData && topProposalData?.map((item, index) => {
          if (index <= 3) {
            return ({
              name: item?.pair_name === "" ? `${denomToSymbol(item?.base_coin)}/${denomToSymbol(item?.quote_coin)} ` : item?.pair_name,
              y: Number(item?.total_vote),
              color: getColor(index),
            })
          }
        })
      },
    ],
  };

  const emissionDistributionColumns = [
    {
      title: '',
      dataIndex: "assets_color",
      key: "assets_color",
      width: 30
    },
    {
      title: 'Vaults/Pools',
      dataIndex: "assets",
      key: "assets",
      align: 'left',
    },
    {
      title: 'Vote',
      dataIndex: "vote",
      key: "vote",
    }
  ];

  // const emissionDistributionData = topProposalData && topProposalData?.map((item, index) => {
  //   if (index <= 3) {
  //     return {
  //       key: item?.pair_id,
  //       assets_color: <div className='colorbox' style={{ backgroundColor: `${getColor(index)}` }}></div>,
  //       assets: <div className="assets-withicon">
  //         <div className="assets-icons">
  //           <div className="assets-icon">
  //             <SvgIcon
  //               name={iconNameFromDenom(item?.base_coin)}
  //             />
  //           </div>

  //           {item?.pair_name === "" && <div className="assets-icon">
  //             <SvgIcon
  //               name={iconNameFromDenom(item?.quote_coin)}
  //             />
  //           </div>}
  //         </div>
  //         <div className='name'>{item?.pair_name === "" ? `${denomToSymbol(item?.base_coin)}/${denomToSymbol(item?.quote_coin)} ` : item?.pair_name}</div>
  //       </div>,
  //       vote: `${item?.total_vote ? calculateTotalVotes(amountConversion(item?.total_vote || 0, 6) || 0) : Number(0).toFixed(DOLLAR_DECIMALS)} %`,
  //     }
  //   }
  // })

  const emissionDistributionData = topProposalData
    ? topProposalData
      .filter((item, index) => index <= 3 && item) // Filter out null or undefined values
      .map((item, index) => ({
        key: item?.pair_id,
        assets_color: (
          <div className="colorbox" style={{ backgroundColor: `${getColor(index)}` }}></div>
        ),
        assets: (
          <div className="assets-withicon">
            <div className="assets-icons">
              <div className="assets-icon">
                <SvgIcon name={iconNameFromDenom(item?.base_coin)} />
              </div>
              {item?.pair_name === "" && (
                <div className="assets-icon">
                  <SvgIcon name={iconNameFromDenom(item?.quote_coin)} />
                </div>
              )}
            </div>
            <div className="name">
              {item?.pair_name === ""
                ? `${denomToSymbol(item?.base_coin)}/${denomToSymbol(item?.quote_coin)} `
                : item?.pair_name}
            </div>
          </div>
        ),
        vote: `${item?.total_vote
          ? calculateTotalVotes(amountConversion(item?.total_vote || 0, 6) || 0)
          : Number(0).toFixed(DOLLAR_DECIMALS)} %`,
      }))
    : null;


  const emissionVotingColumns = [
    {
      title: <>
        Vaults/Pools <TooltipIcon text="All vaults on Harbor (except for Stablemint) and CMST pools on Cswap, are eligible for emissions." />
      </>,
      dataIndex: "assets",
      key: "assets",
      align: 'left',
      // width: 150,
      render: (item) => <>
        <div className="assets-withicon">
          <div className="assets-icon">
            <SvgIcon
              name={iconNameFromDenom(item?.base_coin)}
            />
          </div>
          <div className="assets-icon margin-left-3">
            <SvgIcon
              name={item?.pair_name === "" && iconNameFromDenom(item?.quote_coin)}
            />
          </div>
          <div className='name'>{item?.pair_name === "" ? `${denomToSymbol(item?.base_coin)}/${denomToSymbol(item?.quote_coin)} ` : item?.pair_name}</div>
        </div>
      </>
    },
    {
      title: 'Emission on each Vault/Pool (HARBOR)',
      dataIndex: "emission_onEach_vault",
      key: "emission_onEach_vault",
      width: 180,
    },
    {
      title: <>
        Total Votes(veHARBOR) <TooltipIcon text=" Total voting power for each vault. Please note that these numbers are subject to change based on voting." />
      </>,
      dataIndex: "total_votes",
      key: "total_votes",
      align: 'center',
      // width: 150,
    },
    {
      title: <>
        External Incentives <TooltipIcon text='External incentives provided by protocols to incentivize minting/providing liquidity for their asset. Users will receive these rewards by voting on the corresponding vaults/pools.' />
      </>,
      dataIndex: "external_incentives",
      key: "external_incentives",
      align: 'center',
      // width: 150,
      render: (item) => (
        <>
          {item?.length > 0 ?
            (item?.length == 1) ?
              <div className="bribe-container mt-1 justify-content-start" >
                <span className="assets-withicon">
                  <span className="assets-icon">
                    <SvgIcon
                      name={iconNameFromDenom(item[0]?.denom)}
                    />
                  </span>
                </span>
                <span>{amountConversionWithComma(item[0]?.amount, DOLLAR_DECIMALS, assetMap[item[0]?.denom]?.decimals)} {denomToSymbol(item[0]?.denom)} </span>

              </div>
              : (
                <div className="bribe-container mt-1 justify-content-start" >
                  <span className="assets-withicon">
                    <span className="assets-icon">
                      <SvgIcon
                        name={iconNameFromDenom(item[0]?.denom)}
                      />
                    </span>
                  </span>
                  <span>{amountConversionWithComma(item[0]?.amount, DOLLAR_DECIMALS, assetMap[item[0]?.denom]?.decimals)} {denomToSymbol(item[0]?.denom)} </span>
                  <span> <ViewAllToolTip btnText={"View All"} bribes={item} assetMap={assetMap} /></span>
                </div>
              )
            : <div className="mt-1" >-</div>
          }

        </>
      ),
    },
    // {
    //   title: 'My Vote (veHARBOR)',
    //   dataIndex: "my_vote",
    //   key: "my_vote",
    //   align: 'center',
    //   // width: 150,
    // },
    // {
    //   title: 'My Borrowed/Farmed',
    //   dataIndex: "my_borrowed",
    //   key: "my_borrowed",
    //   // width: 150,
    // },
    {
      title: 'My Vote (veHARBOR)',
      dataIndex: "vote",
      key: "vote",
      align: 'center',
      width: 150,
    }
  ];


  const emissionVotingdata = userCurrentProposalFilterData && userCurrentProposalFilterData?.map((item) => {
    return {
      key: item?.pair_id,
      assets: item,
      emission_onEach_vault: formatNumber(Number(calculateVaultEmission(item?.pair_id) || 0).toFixed(DOLLAR_DECIMALS)),
      total_votes:
        <div div >
          {formatNumber(Number(amountConversion(item?.total_vote || 0, DOLLAR_DECIMALS) || 0).toFixed(DOLLAR_DECIMALS))
          } {" "}
          (<span style={{ textAlign: "end" }}>{item?.total_vote ? calculateTotalVotes(amountConversion(item?.total_vote || 0, 6) || 0) : Number(0).toFixed(DOLLAR_DECIMALS)} %</span>)
        </div >,
      external_incentives: item?.total_incentive,
      // my_borrowed: `$${Number(item?.user_position_value || 0).toFixed(DOLLAR_DECIMALS)}`,
      // my_vote: `${formatNumber(amountConversion(item?.user_vote || 0, DOLLAR_DECIMALS) || 0)}`,
      vote: <div className='vote-slider' style={{ width: '130px' }}>
        <Slider
          min={0}
          max={100}
          className='emission-volt-slider'
          value={userVoteArray[item?.pair_id]}
          onChange={(value) => onChange(item?.pair_id, value)}
          tooltip={false}
          tooltipVisible={false}
        />
        <div className='percents'> {" "}{Number(userVoteArray[item?.pair_id] || 0).toFixed(ZERO_DOLLAR_DECIMALS)}% {"(" + formatNumber(amountConversion(item?.user_vote || 0, DOLLAR_DECIMALS) || 0) + ")"}</div>
      </div>
    }
  })


  useEffect(() => {
    let totalVotesSum = 0;
    Object.values(userVoteArray).forEach(function (key, index) {
      totalVotesSum = totalVotesSum + Number(key);
    });
    setSumOfVotes(totalVotesSum || 0);

  }, [userVoteArray])

  useEffect(() => {
    if (Number(sumOfVotes) > 100) {
      let lastVoteValue = Number(sumOfVotes) - Number(userVoteArray[lastSelectedSlider])
      lastVoteValue = 100 - Math.abs(Number(lastVoteValue))
      setUserVoteArray((prevState) => ({
        ...prevState, [lastSelectedSlider]: Math.abs(Number(lastVoteValue))
      }))
    }
  }, [sumOfVotes])

  useEffect(() => {
    if (currentProposalAllData) {
      let endDate = currentProposalAllData?.voting_end_time;
      let counterEndTime = Math.floor(endDate / 1000000000);
      let currentUnixTime = moment().unix();
      if (Number(currentUnixTime) > Number(counterEndTime)) {
        setProposalInActive(true)
      }
      else {
        setProposalInActive(false)
      }

    }
  }, [currentProposalAllData])


  return (
    <>
      <div className="app-content-wrapper">
        <Row>
          <Col>
            <div className="totol-voting-main-container mb-3">
              <div className='d-flex total-voting-power-tooltip-box'></div>
              <div>
                <Link to="/more"><Button className="back-btn" type="primary">Back</Button></Link>
              </div>
            </div>
          </Col>
        </Row>

        <Row className="emission-top-main-container">
          <div className='emission-top-left' >
            <div className="emission-card w-100 emission-top-card-col" style={{ height: "100%", justifyContent: "space-between" }}>
              <div className="card-header">
                <div className="left">
                  Emission Details
                </div>
              </div>
              <List
                grid={{
                  gutter: 16,
                  xs: 1,
                  sm: 1,
                  md: 2,
                  lg: 2,
                  xl: 2,
                  xxl: 2,
                }}
                dataSource={data}
                renderItem={item => (
                  <List.Item >
                    <div>
                      <p className='emission-card-p'>{item.title}</p>
                      <h3 className="claim-drop-amount emission-card-h3">{item.counts}</h3>
                    </div>
                  </List.Item>
                )}
              />
            </div>
          </div>
          <div className='emission-top-right'>
            <div className="emission-card w-100" style={{ height: "100%" }}>
              <div className="graph-container">
                <div className="top">
                  <div className="card-header mb-2">
                    <div className="left">
                      Emission Distribution
                    </div>
                    <EmissionDistributionAllModal userCurrentProposalData={userCurrentProposalData} currentProposalAllData={currentProposalAllData} />
                  </div>
                </div>
                <div className="bottom">
                  <div className="bottom-left">
                    <div className="graph-container">
                      <HighchartsReact highcharts={Highcharts} options={PieChart1} />
                    </div>
                  </div>
                  <div className="bottom-right">
                    <div className="asset-container">
                      <div className="composite-card ">
                        <div className="card-content">
                          <Table
                            className="custom-table emission-distribution-table"
                            dataSource={emissionDistributionData}
                            columns={emissionDistributionColumns}
                            loading={emissionDataLoading}
                            pagination={false}
                            locale={{ emptyText: <NoDataIcon /> }}
                            scroll={{ x: "100%" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </Row>
        <Row>
          <Col>
            <h2 className='mt-4'>Emission Voting</h2>
          </Col>
          <Col className="assets-search-section">
            {/* <div>
              Hide 0 Balances{" "}
              <Switch
                onChange={handleSwitchChange}
              />
            </div> */}
            <Input
              placeholder="Search"
              value={inputSearch}
              suffix={<SvgIcon name="search" viewbox="0 0 18 18" />}
              onChange={handleInputSearch}
            />
          </Col>
          <Col sm='12'>
            <Table
              className="custom-table emission-voting-table"
              dataSource={emissionVotingdata}
              columns={emissionVotingColumns}
              pagination={false}
              scroll={{ x: "100%" }}
              loading={emissionDataLoading}
              locale={{ emptyText: <NoDataIcon /> }}
              style={{ marginBottom: "5rem" }}
            />
          </Col>
        </Row>
      </div>
      <div className='votepwoter-card'>
        <div className='votepwoter-card-inner'>
          Voting Power Used: <span className='green-text'>{sumOfVotes || 0}%</span> <Button type='primary' className='btn-filled' onClick={handleVote} loading={inProcess} disabled={!sumOfVotes || loading || inProcess || proposalInActive}>Vote</Button>
        </div>
      </div>

      {/* Vote Modal  */}
      <Modal
        centered={true}
        className="emission-modal"
        footer={null}
        header={null}
        title={false}
        open={isModalOpen}
        width={400}
        closable={true}
        onOk={handleOk}
        onCancel={handleCancel}
        closeIcon={<SvgIcon name='close' viewbox='0 0 19 19' />}
      >
        {animationProcessing &&
          <Lottie
            options={processing}
            height={180}
            width={180}
          />
        }
        {animationSuccess &&
          <Lottie
            options={success}
            height={180}
            width={180}
          />
        }
        {animationFailed &&
          <Lottie
            options={failed}
            height={180}
            width={180}
          />
        }
        {animationProcessing && <h3 className='vote-heading'>Processing Transaction</h3>}
        {animationSuccess && <h3 className='vote-heading'>Transaction Successful</h3>}
        {animationFailed && <h3 className='vote-heading'>Transaction Failed</h3>}
        {animationSuccess && <p className='vote-paira'>Transaction has been confirmed by the blockchain.</p>}
      </Modal>


      {checkProposalOverForAlert() && <div className="notification_alert_main_container">
        <div className="notification_alert_container">
          <div className="icon_container">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle-fill" viewBox="0 0 16 16">
              <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
            </svg>
          </div>
          {currentProposalAllData && !currentProposalAllData?.emission_completed &&
            <div className="text_container">
              {` Week ${proposalId ? proposalId : "-"} Emission have ended. Rewards will be distributed in sometime.`}
            </div>
          }

          {currentProposalAllData && currentProposalAllData?.emission_completed &&
            <div className="text_container">
              {`Week ${proposalId ? proposalId : "-"} Harbor emissions have been sent to users wallet. For Rebase & External Incentives, check Reward Page.`}
            </div>
          }
        </div>
      </div>
      }
    </>
  )
}

Vote.propTypes = {
  lang: PropTypes.string.isRequired,
  address: PropTypes.string,
  refreshBalance: PropTypes.number.isRequired,
  assetMap: PropTypes.object,
};
const stateToProps = (state) => {
  return {
    lang: state.language,
    address: state.account.address,
    refreshBalance: state.account.refreshBalance,
    assetMap: state.asset.map,
  };

};
const actionsToProps = {
  setBalanceRefresh,
};
export default connect(stateToProps, actionsToProps)(Vote);