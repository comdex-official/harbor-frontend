import React, { useEffect, useState } from 'react'
import * as PropTypes from "prop-types";
import { Col, Row, SvgIcon } from "../../../components/common";
import './index.scss';
import { connect } from "react-redux";
import { Button, Input, List, message, Slider, Switch, Table } from "antd";
import { denomToSymbol, iconNameFromDenom, symbolToDenom } from "../../../utils/string";
import { amountConversion, amountConversionWithComma } from '../../../utils/coin';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE, DOLLAR_DECIMALS, PRODUCT_ID } from '../../../constants/common';
import { totalVTokens, userCurrentProposal, userProposalAllUpData, userProposalAllUpPoolData, userProposalProjectedEmission, votingCurrentProposal, votingCurrentProposalId, votingTotalBribs, votingTotalVotes, votingUserVote } from '../../../services/voteContractsRead';
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
import { formatNumber } from '../../../utils/number';
import { fetchRestPrices } from '../../../services/oracle/query';
import ViewAllToolTip from './viewAllModal';
import { combineColor, poolColor, vaultColor } from './color';
import Rebase from './Rebase';
import Reward from './Rewards';
import EmissionDistributionAllModal from './EmissionDistributionAllModal';
import ExternalIncentivesModal from './ExternalIncentivesModal';

const Vote = ({
  lang,
  address,
  refreshBalance,
  setBalanceRefresh,
  assetMap,
}) => {
  const [loading, setLoading] = useState(false);
  const [inProcess, setInProcess] = useState(false);
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

  const [inputValue, setInputValue] = useState(0);

  // ---------------------------net Variable-----------------------------------

  const [userCurrentProposalData, setUserCurrentProposalData] = useState();
  const [userVoteArray, setUserVoteArray] = useState({})
  const [sumOfVotes, setSumOfVotes] = useState(0);
  const [updatedUserVote, setUpdatedUserVote] = useState({})
  const [lastSelectedSlider, setLastSelectedSlider] = useState()

  const onChange = (extendedPairId, value) => {
    setUserVoteArray((prevState) => ({
      ...prevState, [String(extendedPairId)]: Number(value)
    }))
    setLastSelectedSlider(extendedPairId)
    setInputValue(value);
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
    // *Removing miliSec from unix time 
    let newTime = Math.floor(endDate / 1000000000);
    var timestamp = moment.unix(newTime);
    timestamp = moment.utc(timestamp).format("YYYY-MM-DD HH:mm:ss [UTC]")
    if (timestamp === "Invalid date") {
      return "0000-00-00 00:00:00 UTC"
    }
    return timestamp;
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

  const fetchQueryPairValut = (extendedPairId) => {
    queryPairVault(extendedPairId, (error, data) => {
      if (error) {
        message.error(error);
        return;
      }
      setPairIdData((prevState) => ({
        ...prevState, [extendedPairId]: data?.pairVault?.pairId?.toNumber()
      }))
      setPairValutData((prevState) => ({
        ...prevState, [extendedPairId]: data?.pairVault?.pairName
      }))
    })
  }

  const fetchtotalBorrowed = (productId, extendedPairId) => {
    queryMintedTokenSpecificVaultType(productId, extendedPairId, (error, data) => {
      if (error) {
        message.error(error);
        return;
      }
      setTotalBorrowed((prevState) => ({
        ...prevState, [extendedPairId]: data?.tokenMinted
      }))
    })
  }

  const getOwnerVaultId = (productId, address, extentedPairId) => {
    queryOwnerVaults(productId, address, extentedPairId, (error, data) => {
      if (error) {
        message.error(error);
        return;
      }
      setVaultId((prevState) => ({
        ...prevState, [extentedPairId]: data?.vaultId?.toNumber()
      }))
    })
  }

  const getOwnerVaultInfoByVaultId = (ownerVaultId) => {
    queryOwnerVaultsInfo(ownerVaultId, (error, data) => {
      if (error) {
        message.error(error);
        return;
      }
      setMyBorrowed((prevData) => ({
        ...prevData, [data?.vault?.extendedPairVaultId?.toNumber()]: data?.vault?.amountOut
      }))
    })
  }

  const fetchTotalVTokens = (address, height) => {
    totalVTokens(address, height).then((res) => {
      setTotalVotingPower(res)
    }).catch((error) => {
      console.log(error);
    })
  }

  const getIconFromPairName = (extendexPairVaultPairName) => {
    let pairName = extendexPairVaultPairName;
    pairName = pairName?.replace(/\s+/g, ' ').trim()
    if (!pairName?.includes("-")) {
      return pairName?.toLowerCase();
    } else {
      pairName = pairName?.slice(0, -2);
      pairName = pairName?.toLowerCase()
      return pairName;
    }
  }

  const calculateTotalVotes = (value) => {
    let userTotalVotes = 0;
    let calculatePercentage = 0;

    calculatePercentage = (Number(value) / amountConversion(currentProposalAllData?.total_voted_weight || 0, DOLLAR_DECIMALS)) * 100;
    calculatePercentage = Number(calculatePercentage || 0).toFixed(DOLLAR_DECIMALS)
    return calculatePercentage;
  }

  useEffect(() => {
    fetchVotingCurrentProposalId()
    if (proposalId) {
      fetchVotingCurrentProposal(proposalId)
    } else {
      setProposalExtenderPair("")
    }
  }, [address, proposalId, refreshBalance])

  const getPairFromExtendedPair = () => {
    allProposalData && allProposalData.map((item) => {
      fetchQueryPairValut(item?.extended_pair_id)
      getOwnerVaultId(PRODUCT_ID, address, item?.extended_pair_id)
      fetchtotalBorrowed(PRODUCT_ID, item?.extended_pair_id)
    })
  }

  const fetchProposalAllUpData = (address, proposalId) => {
    setLoading(true)
    userProposalAllUpData(address, proposalId,).then((res) => {
      setAllProposalData(res?.proposal_pair_data)
      setLoading(false)
    }).catch((error) => {
      setLoading(false)
      console.log(error);
    })
  };


  // *For pools 
  const fetchProposalAllUpPoolData = (address, proposalId) => {
    setLoading(true)
    userProposalAllUpPoolData(address, proposalId,).then((res) => {
      setAllProposalPoolData(res?.proposal_pair_data)
      setLoading(false)
    }).catch((error) => {
      setLoading(false)
      console.log(error);
    })
  };

  const fetchPoolLists = () => {
    queryPoolsList((error, data) => {
      if (error) {
        message.error(error);
        return;
      }
      setPoolList(data?.pools)
    })
  }

  const fetchFarmer = (poolId, address, extendexPairId) => {
    queryFarmer(poolId, address, (error, data) => {
      if (error) {
        message.error(error);
        return;
      }
      setUserPoolFarmedData((prevData) => ({
        ...prevData, [extendexPairId]: data
        // ...prevData, [extendexPairId]: data?.activePoolCoin?.amount
      }))
    })
  }

  const fetchFarmedPoolCoin = (poolId, extendexPairId) => {
    queryFarmedPoolCoin(poolId, (error, data) => {
      if (error) {
        message.error(error);
        return;
      }
      setTotalPoolFarmedData((prevData) => ({
        // ...prevData, [extendexPairId]: data
        ...prevData, [extendexPairId]: data?.coin?.amount
      }))
    })
  }

  const fetchTotalActiveAndQueuedPoolCoin = (extendexPairId) => {
    queryTotalActiveAndQueuedPoolCoin((error, data) => {
      if (error) {
        message.error(error);
        return;
      }

      setTotalPoolFarmedData(data?.totalActiveAndQueuedCoins)
    })
  }

  const getPoolId = (value) => {
    let extendedPairId = value;
    let divisor = 10 ** comdex?.coinDecimals
    let result = extendedPairId % divisor;
    return result;
  }

  const getUserFarmData = (address) => {
    allProposalPoolData?.map((item) => {
      fetchFarmer(getPoolId(item?.extended_pair_id), address, item?.extended_pair_id)
      // fetchFarmedPoolCoin(getPoolId(item?.extended_pair_id), item?.extended_pair_id)
      // fetchTotalActiveAndQueuedPoolCoin(item?.extended_pair_id)
    })
  }

  useEffect(() => {
    getUserFarmData(address)
  }, [allProposalPoolData, address])

  useEffect(() => {
    proposalExtenderPair && proposalExtenderPair.map((item) => {
      getOwnerVaultInfoByVaultId(vaultId[item])
    })
  }, [vaultId, refreshBalance])

  useEffect(() => {
    if (proposalId) {
      fetchProposalAllUpData(address, proposalId);
      fetchuserProposalProjectedEmission(proposalId)
      fetchProposalAllUpPoolData(address, proposalId)
    }
  }, [address, proposalId, refreshBalance])


  const handleVote = (item, index) => {
    setInProcess(true)
    setBtnLoading(index)
    if (address) {
      if (proposalId) {
        if (amountConversion(totalVotingPower, DOLLAR_DECIMALS) === Number(0).toFixed(DOLLAR_DECIMALS)) {
          message.error("Insufficient Voting Power")
          setInProcess(false)
        }
        else {
          transactionForVotePairProposal(address, PRODUCT_ID, proposalId, item, (error, result) => {
            if (error) {
              message.error(error?.rawLog || "Transaction Failed")
              setInProcess(false)
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
          })

        }
      } else {
        setInProcess(false)
        message.error("Please enter amount")
      }
    }
    else {
      setInProcess(false)
      message.error("Please Connect Wallet")
    }
  }

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
    fetchPoolLists()
    fetchRestPrices((error, result) => {
      if (error) {
        console.log(error, "Price Error");
      }
      setCswapPrice(result)
    })
    fetchTotalActiveAndQueuedPoolCoin()
  }, [address])

  useEffect(() => {
    getPairFromExtendedPair()
  }, [allProposalData, refreshBalance])

  const columns = [
    {
      title: (
        <>
          Vault Pair
        </>
      ),
      dataIndex: "asset",
      key: "asset",
      width: 230,
    },
    {
      title: (
        <>
          My Borrowed{" "}
        </>
      ),
      dataIndex: "my_borrowed",
      key: "my_borrowed",
      width: 150,
    },
    // {
    //   title: (
    //     <>
    //       Total Borrowed
    //     </>
    //   ),
    //   dataIndex: "total_borrowed",
    //   key: "total_borrowed",
    //   width: 200,
    // },
    {
      title: (
        <>
          Total Votes
        </>
      ),
      dataIndex: "total_votes",
      key: "total_votes",
      width: 200,
    },

    {
      title: (
        <>
          External Incentives
        </>
      ),
      dataIndex: "bribe",
      key: "bribe",
      width: 250,
      render: (item) => (
        <>
          {item?.length > 0 ?
            (item?.length == 1) ?
              <div className="bribe-container mt-1" >
                <span className="assets-withicon">
                  <span className="assets-icon">
                    <SvgIcon
                      name={iconNameFromDenom(item[0]?.denom)}
                    />
                  </span>
                </span>
                <span>{amountConversionWithComma(item[0]?.amount, DOLLAR_DECIMALS)} {denomToSymbol(item[0]?.denom)} </span>

              </div>
              : (
                <div className="bribe-container mt-1" >
                  <span className="assets-withicon">
                    <span className="assets-icon">
                      <SvgIcon
                        name={iconNameFromDenom(item[0]?.denom)}
                      />
                    </span>
                  </span>
                  <span>{amountConversionWithComma(item[0]?.amount, DOLLAR_DECIMALS)} {denomToSymbol(item[0]?.denom)} </span>
                  <span> <ViewAllToolTip btnText={"View All"} bribes={item} /></span>
                </div>
              )
            : <div className="mt-1" >0</div>
          }

        </>
      ),
    },
    {
      title: (
        <>
          My Vote
        </>
      ),
      dataIndex: "my_vote",
      key: "my_vote",
      align: "center",
      width: 200,
    },
    {
      title: (
        <>
          Action
        </>
      ),
      dataIndex: "action",
      key: "action",
      align: "centre",
      width: 130,
    },
  ];

  const data = [
    {
      title: "Voting Starts",
      counts: `${votingStart()}`
    },

    {
      title: "Your Emission",
      counts: `${formatNumber(userEmission || 0)} HARBOR`
    },
    {
      title: "Voting Ends",
      counts: `${votingEnd()}`
    },
    {
      title: `Week ${proposalId} Total Emission`,
      counts: `${formatNumber(protectedEmission || 0)} HARBOR`
    },
  ];

  const tableData =
    allProposalData && allProposalData.map((item, index) => {
      return {
        key: index,
        asset: (
          <>
            <div className="assets-withicon">
              <div className="assets-icon">
                <SvgIcon
                  name={iconNameFromDenom(
                    symbolToDenom(getIconFromPairName(pairVaultData[item?.extended_pair_id]))
                  )}
                />
              </div>
              {pairVaultData[item?.extended_pair_id]}
            </div>
          </>
        ),
        my_borrowed: (
          <>
            <div className="assets-withicon display-center">
              {myBorrowed[item?.extended_pair_id] ? amountConversionWithComma(myBorrowed[item?.extended_pair_id], DOLLAR_DECIMALS) : Number(0).toFixed(2)}
              {" "}{denomToSymbol("ucmst")}
            </div>
          </>
        ),
        total_borrowed:
          <div>
            {totalBorrowed[item?.extended_pair_id] ? amountConversionWithComma(
              totalBorrowed[item?.extended_pair_id], DOLLAR_DECIMALS
            ) : Number(0).toFixed(2)} {denomToSymbol("ucmst")}
          </div>,
        total_votes: <div >{item?.total_vote ? amountConversionWithComma(item?.total_vote, DOLLAR_DECIMALS) : Number(0).toFixed(DOLLAR_DECIMALS)} veHARBOR <div style={{ fontSize: "12px" }}>{item?.total_vote ? calculateTotalVotes(amountConversion(item?.total_vote || 0, 6) || 0) : Number(0).toFixed(DOLLAR_DECIMALS)}%</div></div>,
        bribe: item?.bribe,
        my_vote: <div>{item?.my_vote ? amountConversion(item?.my_vote, DOLLAR_DECIMALS) : Number(0).toFixed(DOLLAR_DECIMALS)} veHARBOR</div>,
        action: <>
          <Button
            type="primary"
            className="btn-filled"
            size="sm"
            loading={index === btnLoading ? inProcess : false}
            onClick={() => handleVote(item?.extended_pair_id, index)}
            disabled={disableVoteBtn}
          >
            Vote
          </Button>
        </>,
      }
    })

  const poolColumns = [
    {
      title: (
        <>
          Vault Pair
        </>
      ),
      dataIndex: "asset",
      key: "asset",
      width: 150,
    },
    {
      title: (
        <>
          My Borrowed{" "}
        </>
      ),
      dataIndex: "my_borrowed",
      key: "my_borrowed",
      width: 150,
    },
    {
      title: (
        <>
          Total Borrowed
        </>
      ),
      dataIndex: "total_borrowed",
      key: "total_borrowed",
      width: 200,
    },
    {
      title: (
        <>
          Total Votes
        </>
      ),
      dataIndex: "total_votes",
      key: "total_votes",
      width: 200,
    },
    {
      title: (
        <>
          External Incentives
        </>
      ),
      dataIndex: "bribe",
      key: "bribe",
      width: 200,
      render: (item) => (
        <>
          {item?.length > 0 ?
            item && item?.map((singleBribe, index) => {
              return <div className="endtime-badge mt-1" key={index}>{amountConversionWithComma(singleBribe?.amount, DOLLAR_DECIMALS)} {denomToSymbol(singleBribe?.denom)}</div>
            })
            : <div className="endtime-badge mt-1" >{""}</div>
          }
        </>
      ),
    },
    {
      title: (
        <>
          My Vote
        </>
      ),
      dataIndex: "my_vote",
      key: "my_vote",
      align: "center",
      width: 100,
    },
    {
      title: (
        <>
          Action
        </>
      ),
      dataIndex: "action",
      key: "action",
      align: "centre",
      width: 130,
    },
  ];

  const tabsItem = [
    {
      label: "Vaults", key: "1", children: (
        <Row>
          <Col>
            <div className="composite-card ">
              <div className="card-content">
                <Table
                  className="custom-table liquidation-table"
                  dataSource={tableData}
                  columns={columns}
                  loading={loading}
                  pagination={false}
                  scroll={{ x: "100%" }}
                  locale={{ emptyText: <NoDataIcon /> }}
                />
              </div>
            </div>

          </Col>
        </Row>
      )
    },
    {
      label: "Pools", key: "2", children: <Pool cswapPrice={cswapPrice} assetMap={assetMap} />
    },
  ]


  const PieChart1 = {
    chart: {
      type: "pie",
      backgroundColor: null,
      height: 170,
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
    series: [
      {
        states: {
          hover: {
            enabled: true,
          },
        },
        name: "",
        data: concatedExtendedPair && concatedExtendedPair?.map((item, index) => {
          return ({
            name: (item?.extended_pair_id / 1000000) >= 1 ? denomToSymbol(concatedPairName[item?.extended_pair_id]?.baseCoin?.denom) + "-" + denomToSymbol(concatedPairName[item?.extended_pair_id]?.quoteCoin?.denom)
              :
              concatedPairName[item?.extended_pair_id],
            y: Number(item?.total_vote),
            color: (item?.extended_pair_id / 1000000) >= 1 ? poolColor[Math.floor(item?.extended_pair_id / 1000000) - 1] : vaultColor[item?.extended_pair_id - 1],
          })
        })
      },
    ],
  };

  // *Pool data Column row for showing pair Pools in up container 
  const upPoolColumns = [
    {
      title: (
        <>

        </>
      ),
      dataIndex: "asset_color",
      key: "asset_color",
    },
    {
      title: (
        <>
          Pools/Vault
        </>
      ),
      dataIndex: "pools",
      key: "pools",
      // width: 150,
    },
    {
      title: (
        <>
          Amount (HARBOR)
        </>
      ),
      dataIndex: "amount",
      key: "amount",
      // width: 150,
    },
  ];


  // *Pool data table row for showing pair Pools in up container 
  const upPoolTableData =
    allProposalPoolData && allProposalPoolData.map((item, index) => {
      if (
        (index) < 2
      ) {
        return {
          key: index,
          asset_color: <>
            <div className="asset_color" style={{ backgroundColor: `${poolColor[index]}` }}></div>
          </>,
          pools: (
            <>
              <div className="assets-withicon">
                <div className="assets-icon">
                  <SvgIcon
                    name={iconNameFromDenom(poolList && poolList[index]?.balances?.baseCoin?.denom)}
                  />
                </div>
                <div className="assets-icon" style={{ marginLeft: "-22px" }}>
                  <SvgIcon
                    name={iconNameFromDenom(poolList && poolList[index]?.balances?.quoteCoin?.denom)}
                  />
                </div>
                {denomToSymbol(poolList && poolList[index]?.balances?.baseCoin?.denom)} - {denomToSymbol(poolList && poolList[index]?.balances?.quoteCoin?.denom)}
              </div>
            </>
          ),
          amount:
            <div >
              <div>{item?.total_vote ? calculateTotalVotes(amountConversion(item?.total_vote || 0, 6) || 0) : Number(0).toFixed(DOLLAR_DECIMALS)}% (<span>{(item?.total_vote ? formatNumber(calculateTotalVotes(amountConversion(item?.total_vote || 0, 6) || 0) * protectedEmission) : Number(0).toFixed(DOLLAR_DECIMALS))} </span>) </div>
            </div>,
        }
      }
    })

  const upPoolTableDataForModal =
    allProposalPoolData && allProposalPoolData.map((item, index) => {
      return {
        key: index,
        asset_color: <>
          <div className="asset_color" style={{ backgroundColor: `${poolColor[index]}` }}></div>
        </>,
        pools: (
          <>
            <div className="assets-withicon">
              <div className="assets-icon">
                <SvgIcon
                  name={iconNameFromDenom(poolList && poolList[index]?.balances?.baseCoin?.denom)}
                />
              </div>
              <div className="assets-icon" style={{ marginLeft: "-22px" }}>
                <SvgIcon
                  name={iconNameFromDenom(poolList && poolList[index]?.balances?.quoteCoin?.denom)}
                />
              </div>
              {denomToSymbol(poolList && poolList[index]?.balances?.baseCoin?.denom)} - {denomToSymbol(poolList && poolList[index]?.balances?.quoteCoin?.denom)}
            </div>
          </>
        ),
        amount:
          <div >
            <div>{item?.total_vote ? calculateTotalVotes(amountConversion(item?.total_vote || 0, 6) || 0) : Number(0).toFixed(DOLLAR_DECIMALS)}% (<span>{(item?.total_vote ? formatNumber(calculateTotalVotes(amountConversion(item?.total_vote || 0, 6) || 0) * protectedEmission) : Number(0).toFixed(DOLLAR_DECIMALS))}</span>) </div>
          </div>,
      }
    })

  // *vault data Column row for showing pair vault in up container 
  const upVaultColumns = [
    {
      title: (
        <>

        </>
      ),
      dataIndex: "asset_color",
      key: "asset_color",
    },
    {
      title: (
        <>
          Vaults
        </>
      ),
      dataIndex: "vaults",
      key: "vaults",
      // width: 150,
    },
    {
      title: (
        <>
          Amount
        </>
      ),
      dataIndex: "amount",
      key: "amount",
      // width: 150,
    },
  ];

  // *vault data table row for showing pair vault in up container 
  const upVaultTableData =
    allProposalData && allProposalData.map((item, index) => {
      if (
        (index) < 2
      ) {
        return {
          key: index,
          asset_color: <>
            <div className="asset_color" style={{ backgroundColor: `${vaultColor[index]}` }}></div>
          </>,
          vaults: (
            <>
              <div className="assets-withicon">
                <div className="assets-icon">
                  <SvgIcon
                    name={iconNameFromDenom(
                      symbolToDenom(getIconFromPairName(pairVaultData[item?.extended_pair_id]))
                    )}
                  />
                </div>
                <div className="assets-icon" style={{ marginLeft: "-22px" }}>
                  <SvgIcon
                    name={iconNameFromDenom("")}
                  />
                </div>
                {pairVaultData[item?.extended_pair_id]}
              </div>
            </>
          ),
          amount: <div>{item?.total_vote ? calculateTotalVotes(amountConversion(item?.total_vote || 0, 6) || 0) : Number(0).toFixed(DOLLAR_DECIMALS)}% (<span>{(item?.total_vote ? formatNumber((calculateTotalVotes(amountConversion(item?.total_vote || 0, 6) || 0) * protectedEmission)) : Number(0).toFixed(DOLLAR_DECIMALS))}</span>)</div>,
        }
      }
    })

  const upVaultTableDataForModal =
    allProposalData && allProposalData.map((item, index) => {
      return {
        key: index,
        asset_color: <>
          <div className="asset_color" style={{ backgroundColor: `${vaultColor[index]}` }}></div>
        </>,
        vaults: (
          <>
            <div className="assets-withicon">
              <div className="assets-icon">
                <SvgIcon
                  name={iconNameFromDenom(
                    symbolToDenom(getIconFromPairName(pairVaultData[item?.extended_pair_id]))
                  )}
                />
              </div>
              <div className="assets-icon" style={{ marginLeft: "-22px" }}>
                <SvgIcon
                  name={iconNameFromDenom("")}
                />
              </div>
              {pairVaultData[item?.extended_pair_id]}
            </div>
          </>
        ),
        amount: <div>{item?.total_vote ? calculateTotalVotes(amountConversion(item?.total_vote || 0, 6) || 0) : Number(0).toFixed(DOLLAR_DECIMALS)}% (<span>{(item?.total_vote ? formatNumber((calculateTotalVotes(amountConversion(item?.total_vote || 0, comdex?.coinDecimals) || 0) * protectedEmission)) : Number(0).toFixed(DOLLAR_DECIMALS))}</span>)</div>,
      }
    })

  const calculateToatalUserFarmedToken = (tokens) => {
    let activePoolCoins = Number(tokens?.activePoolCoin?.amount) || 0;
    let quedPoolCoins = 0;
    let totalUserPoolCoin = 0;
    let quedPoolCoinsArray = tokens?.queuedPoolCoin?.map((item) => {
      let amount = Number(item?.poolCoin?.amount)
      quedPoolCoins += amount;
    })
    totalUserPoolCoin = activePoolCoins + quedPoolCoins
    // return totalUserPoolCoin;
    return activePoolCoins;
  }


  // *calculate user emission 
  const calculateUserEmission = (_myBorrowed, _totalBorrowed, _totalVoteOfPair) => {
    // !formula = ((myBorrowed/TotalBorrowed) * (Total Vote of Particular Pair/total_vote_weight))*projected_emission
    let myBorrowed = _myBorrowed || 0;
    let totalBorrowed = _totalBorrowed || 0;
    let totalVoteOfPair = _totalVoteOfPair || 0;
    let totalWeight = amountConversion(currentProposalAllData?.total_voted_weight || 0, DOLLAR_DECIMALS);
    let projectedEmission = protectedEmission;

    let calculatedEmission = (Number((Number(myBorrowed) / Number(totalBorrowed)) * (Number(totalVoteOfPair) / Number(totalWeight))) * projectedEmission)
    // console.log(myBorrowed, "myBorrowed");
    // console.log(totalBorrowed, "totalBorrowed");
    // console.log(totalVoteOfPair, "totalVoteOfPair");
    // console.log(totalWeight, "toralWeight");
    // console.log(projectedEmission, "projectedEmission");
    if (isNaN(calculatedEmission)) {
      // console.log(0, "calculatedEmission");
      return 0;
    } else {
      // console.log(calculatedEmission, "calculatedEmission");
      return Number(calculatedEmission);
    }

  }

  useEffect(() => {
    let concatedData = allProposalData?.concat(allProposalPoolData)
    setConcatedExtendedPair(concatedData)
  }, [allProposalData, allProposalPoolData])

  useEffect(() => {
    if (poolList && poolsName) {
      let concatedData = { ...pairVaultData, ...poolsName };
      setConcatedPairName(concatedData)
    }
  }, [pairVaultData, poolsName])

  useEffect(() => {
    if (concatedExtendedPair) {
      concatedExtendedPair?.length > 0 && concatedExtendedPair?.map((item) => {
        setAllPairTotalVote((prevData) => ({ ...prevData, [item?.extendedPairId]: calculateTotalVotes(amountConversion(item?.total_vote || 0, 6) || 0) * protectedEmission }))
      })
    }
  }, [concatedExtendedPair, concatedPairName])

  // *Concating pools name with extended pair id 

  useEffect(() => {

    if (poolList) {
      poolList?.map((item) => {
        setPoolsName((prevState) => ({
          ...prevState, [(item?.id?.toNumber()) + 1000000]: item?.balances
        }))
      })

    }

  }, [poolList])

  useEffect(() => {
    if (concatedExtendedPair) {
      let totalCalculatedEmission = 0;
      concatedExtendedPair?.map((singleConcatedExtendedPair, index) => {
        // *if extended pair is less than 1, means it is vault extended pair else it is pool extended pair 
        if (((singleConcatedExtendedPair?.extended_pair_id) / 100000) < 1) {
          // *For vault 
          totalCalculatedEmission = totalCalculatedEmission + calculateUserEmission(
            amountConversionWithComma(myBorrowed[singleConcatedExtendedPair?.extended_pair_id] || 0, DOLLAR_DECIMALS),
            amountConversionWithComma(totalBorrowed[singleConcatedExtendedPair?.extended_pair_id] || 0, DOLLAR_DECIMALS),
            amountConversion(singleConcatedExtendedPair?.total_vote || 0, comdex?.coinDecimals)
          )
        } else {
          // *For Pool 
          totalCalculatedEmission = totalCalculatedEmission + calculateUserEmission(
            amountConversion(calculateToatalUserFarmedToken(userPoolFarmedData[singleConcatedExtendedPair?.extended_pair_id]) || 0, DOLLAR_DECIMALS),
            amountConversion(totalPoolFarmedData?.[getPoolId(singleConcatedExtendedPair?.extended_pair_id) - 1]?.totalActivePoolCoin?.amount || 0, DOLLAR_DECIMALS),
            amountConversion(singleConcatedExtendedPair?.total_vote || 0, comdex?.coinDecimals)
          )
        }
        setUserEmission(totalCalculatedEmission)

      })
    }
  }, [concatedExtendedPair, totalPoolFarmedData, userPoolFarmedData, address, myBorrowed])


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

  useEffect(() => {
    if (address) {
      fetchuserCurrentProposal(address, PRODUCT_ID)
    }
  }, [address])


  const emissionDistributionColumns = [
    {
      title: '',
      dataIndex: "assets_color",
      key: "assets_color",
      render: (text) => <div className='colorbox' style={{ backgroundColor: `${text}` }}></div>,
      width: 30
    },
    {
      title: 'Vaults/Pools',
      dataIndex: "assets",
      key: "assets",
      align: 'left',
      render: (text) => <>
        <div className="assets-withicon">
          <div className="assets-icons">
            <div className="assets-icon">
              <SvgIcon
                name='atom-icon'
              />
            </div>
            <div className="assets-icon">
              <SvgIcon
                name='cmdx-icon'
              />
            </div>
          </div>
          <div className='name'>{text}</div>
        </div>
      </>
    },
    {
      title: 'Vote',
      dataIndex: "vote",
      key: "vote",
    }
  ];

  const emissionDistributionData = [
    {
      key: 1,
      assets_color: '#00AFB9',
      assets: 'ATOM-C',
      vote: '23%'
    },
    {
      key: 2,
      assets_color: '#FDFCDC',
      assets: 'ATOM-C',
      vote: '23%'
    },
    {
      key: 3,
      assets_color: '#00AFB9',
      assets: 'ATOM-C',
      vote: '23%'
    },
    {
      key: 4,
      assets_color: '#F07167',
      assets: 'ATOM-C',
      vote: '23%'
    },
    {
      key: 5,
      assets_color: '#FED9B7',
      assets: 'ATOM-C',
      vote: '23%'
    }
  ];

  const emissionVotingColumns = [
    {
      title: 'Vaults/Pools',
      dataIndex: "assets",
      key: "assets",
      align: 'left',
      render: (text) => <>
        <div className="assets-withicon">
          <div className="assets-icon">
            <SvgIcon
              name='atom-icon'
            />
          </div>
          <div className='name'>{text}</div>
        </div>
      </>
    },
    {
      title: 'My Borrowed/Farmed',
      dataIndex: "my_borrowed",
      key: "my_borrowed",
    },
    {
      title: 'Total Votes',
      dataIndex: "total_votes",
      key: "total_votes",
      align: 'center',
    },
    {
      title: 'External Incentives',
      dataIndex: "external_incentives",
      key: "external_incentives",
      align: 'left',
      // render: (text) => <>
      //   <div className="assets-withicon">
      //     <div className="assets-icon">
      //       <SvgIcon
      //         name='cmdx-icon'
      //       />
      //     </div>
      //     <div className='name'>{text}</div>
      //     <ExternalIncentivesModal />
      //   </div>
      // </>
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
                <span>{amountConversionWithComma(item[0]?.amount, DOLLAR_DECIMALS)} {denomToSymbol(item[0]?.denom)} </span>

              </div>
              : (
                <div className="bribe-container mt-1" >
                  <span className="assets-withicon">
                    <span className="assets-icon">
                      <SvgIcon
                        name={iconNameFromDenom(item[0]?.denom)}
                      />
                    </span>
                  </span>
                  <span>{amountConversionWithComma(item[0]?.amount, DOLLAR_DECIMALS)} {denomToSymbol(item[0]?.denom)} </span>
                  <span> <ViewAllToolTip btnText={"View All"} bribes={item} /></span>
                </div>
              )
            : <div className="mt-1" >0</div>
          }

        </>
      ),
    },
    {
      title: 'My Vote',
      dataIndex: "my_vote",
      key: "my_vote",
      align: 'center',
    },
    {
      title: 'Vote',
      dataIndex: "vote",
      key: "vote",
      align: 'center',
      width: 120,
      // render: (text) => <div className='vote-slider'>
      //   <Slider
      //     min={0}
      //     max={100}
      //     onChange={onChange}
      //     tooltip={false}
      //   />
      //   <div className='percents'>{inputValue}%</div>
      // </div>
    }
  ];

  // const emissionVotingdata = [
  //   {
  //     key: 1,
  //     assets: 'ATOM-A',
  //     my_borrowed: '13.09 CMST',
  //     total_votes: '502.76 veHarbor',
  //     external_incentives: '4.40 CMDX',
  //     my_vote: '0.00 veHARBOR',
  //     vote: ''
  //   },
  //   {
  //     key: 2,
  //     assets: 'ATOM-A',
  //     my_borrowed: '13.09 CMST',
  //     total_votes: '502.76 veHarbor',
  //     external_incentives: '4.40 CMDX',
  //     my_vote: '0.00 veHARBOR',
  //     vote: ''
  //   },
  //   {
  //     key: 3,
  //     assets: 'ATOM-A',
  //     my_borrowed: '13.09 CMST',
  //     total_votes: '502.76 veHarbor',
  //     external_incentives: '4.40 CMDX',
  //     my_vote: '0.00 veHARBOR',
  //     vote: ''
  //   },
  //   {
  //     key: 4,
  //     assets: 'ATOM-A',
  //     my_borrowed: '13.09 CMST',
  //     total_votes: '502.76 veHarbor',
  //     external_incentives: '4.40 CMDX',
  //     my_vote: '0.00 veHARBOR',
  //     vote: ''
  //   },
  //   {
  //     key: 5,
  //     assets: 'ATOM-A',
  //     my_borrowed: '13.09 CMST',
  //     total_votes: '502.76 veHarbor',
  //     external_incentives: '4.40 CMDX',
  //     my_vote: '0.00 veHARBOR',
  //     vote: ''
  //   },
  //   {
  //     key: 6,
  //     assets: 'ATOM-A',
  //     my_borrowed: '13.09 CMST',
  //     total_votes: '502.76 veHarbor',
  //     external_incentives: '4.40 CMDX',
  //     my_vote: '0.00 veHARBOR',
  //     vote: ''
  //   }
  // ];

  const emissionVotingdata = userCurrentProposalData && userCurrentProposalData?.map((item) => {
    return {
      key: item?.pair,
      assets: 'ATOM-A',
      my_borrowed: '13.09 CMST',
      total_votes: `${item?.total_vote} veHarbor`,
      external_incentives: item?.total_incentive,
      my_vote: `${item?.user_vote} veHARBOR`,
      // vote: item?.pairId
      vote: <div className='vote-slider'>
        <Slider
          min={0}
          max={100}
          value={userVoteArray[item?.pair]}
          onChange={(value) => onChange(item?.pair, value)}
          tooltip={false}
        />
        {/* <div className='percents'>{inputValue}%</div> */}
        <div className='percents'>{userVoteArray[item?.pair] || 0}%</div>
      </div>
    }
  })

  useEffect(() => {
    let totalVotesSum = 0;
    Object.values(userVoteArray).forEach(function (key, index) {
      totalVotesSum = totalVotesSum + Number(key);
    });
    console.log(totalVotesSum, " totalVotesSum in sum function");
    setSumOfVotes(totalVotesSum || 0);

  }, [userVoteArray])



  useEffect(() => {
    // let lastValue;
    // for (lastValue in userVoteArray);
    console.log(userVoteArray, "userVoteArray");
    console.log(sumOfVotes, "sumOfVotes");
    if (Number(sumOfVotes) > 100) {
      let lastVoteValue = Number(sumOfVotes) - Number(userVoteArray[lastSelectedSlider])
      console.log(lastVoteValue, "lastVoteValue 01");
      lastVoteValue = 100 - Math.abs(lastVoteValue);
      console.log(lastVoteValue, "lastVoteValue 02");
      setUserVoteArray((prevState) => ({
        ...prevState, [String(lastSelectedSlider)]: Math.abs(Number(lastVoteValue))
      }))
    }
  }, [sumOfVotes])

  // useEffect(() => {

  //   console.log(userVoteArray, "userVoteArray");
  // }, [userVoteArray])




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

        <Row>
          <Col>
            <div className="emission-card w-100" style={{ height: "100%" }}>
              <div className="card-header">
                <div className="left">
                  Emission Voting
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
          </Col>
          <Col>
            <div className="emission-card w-100" style={{ height: "100%" }}>
              <div className="graph-container">
                <div className="top">
                  <div className="card-header mb-2">
                    <div className="left">
                      Emission Distribution
                    </div>
                    <EmissionDistributionAllModal />
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
                            pagination={false}
                            scroll={{ x: "100%" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Col>

        </Row>
        <Row>
          <Col>
            <h2 className='mt-4'>Emission Voting</h2>
          </Col>
          <Col className="assets-search-section">
            <div>
              Hide 0 Balances{" "}
              <Switch
              />
            </div>
            <Input
              placeholder="Search"
              suffix={<SvgIcon name="search" viewbox="0 0 18 18" />}
            />
          </Col>
          <Col sm='12'>
            <Table
              className="custom-table emission-voting-table"
              dataSource={emissionVotingdata}
              columns={emissionVotingColumns}
              pagination={false}
              scroll={{ x: "100%" }}
              loading={loading}
              locale={{ emptyText: <NoDataIcon /> }}
              style={{ marginBottom: "5rem" }}
            />
          </Col>
        </Row>
      </div>
      <div className='votepwoter-card'>
        <div className='votepwoter-card-inner'>
          Voting Power Used: <span className='green-text'>{sumOfVotes || 0}%</span> <Button type='primary' className='btn-filled'>Vote</Button>
        </div>
      </div>
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