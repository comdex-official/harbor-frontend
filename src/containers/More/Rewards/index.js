import React, { useEffect, useState } from 'react'
import { Col, Row, SvgIcon } from "../../../components/common";
import './index.scss';
import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import { Button, Input, message, Slider, Switch, Table } from "antd";
import { Link } from 'react-router-dom';
import NoDataIcon from '../../../components/common/NoDataIcon';
import ExternalIncentivesModal from './ExternalIncentivesModal';
import { setBalanceRefresh } from "../../../actions/account";


import cardImage from '../../../assets/images/reward-bg.jpg';
import { DOLLAR_DECIMALS, PRODUCT_ID } from '../../../constants/common';
import { claimableRewards } from '../../../services/rewardContractsWrite';
import { amountConversionWithComma } from '../../../utils/coin';
import { denomToSymbol, iconNameFromDenom } from '../../../utils/string';
import ViewAllToolTip from '../Vote/viewAllModal';
import { totalClaimableRebase } from '../../../services/rebasingContractRead';
import { comdex } from '../../../config/network';
import variables from '../../../utils/variables';
import Snack from '../../../components/common/Snack';
import { transactionForClaimRebase } from '../../../services/rebaseingContractWrite';
import { transactionClaimAllRewards, transactionClaimRewards } from '../../../services/rewardContractsRead';

const Rewards = ({
  lang,
  address,
  refreshBalance,
  setBalanceRefresh,
}) => {
  const [claimableRewardsData, setClaimableRewardsData] = useState()
  const [loading, setLoading] = useState(false);
  const [allRewardLoading, setAllRewardLoading] = useState(false);
  const [claimableRebaseData, setClaimableRebaseData] = useState()
  const [current, setCurrent] = useState(0);




  // Query 
  const fetchClaimeableRewards = (productId, address) => {
    setLoading(true)
    claimableRewards(productId, address).then((res) => {
      let result = [];
      res?.map((item) => {
        if ((item?.total_incentive)?.length > 0) {
          return result.push(item);
        }
      })
      setClaimableRewardsData(result)
      setLoading(false)
    }).catch((error) => {
      console.log(error);
      setLoading(false)
    })
  }

  const fetchClaimeableRebase = (productId, address) => {
    setLoading(true)
    totalClaimableRebase(productId, address).then((res) => {
      console.log(res);
      setClaimableRebaseData(res)
      setLoading(false)
    }).catch((error) => {
      console.log(error);
      setLoading(false)
    })
  }

  // UseEffect calls 
  useEffect(() => {
    if (address) {
      fetchClaimeableRewards(PRODUCT_ID, address)
      fetchClaimeableRebase(PRODUCT_ID, address)
    }
  }, [address, refreshBalance])

  const claimRebase = (proposalId) => {
    setCurrent(proposalId)
    setLoading(true)
    if (address) {
      transactionForClaimRebase(address, PRODUCT_ID, proposalId, (error, result) => {
        if (error) {
          message.error(error?.rawLog || "Transaction Failed")
          setLoading(false)
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
        setLoading(false)
      })
    }
    else {
      setLoading(false)
      message.error("Please Connect Wallet")
    }
  }

  const claimReward = (proposalId) => {
    // setCurrent(proposalId)
    setLoading(true)
    if (address) {
      transactionClaimRewards(address, PRODUCT_ID, proposalId, (error, result) => {
        if (error) {
          message.error(error?.rawLog || "Transaction Failed")
          setLoading(false)
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
        setLoading(false)
      })
    }
    else {
      setLoading(false)
      message.error("Please Connect Wallet")
    }
  }

  const claimAllReward = () => {
    setAllRewardLoading(true)
    if (address) {
      transactionClaimAllRewards(address, PRODUCT_ID, (error, result) => {
        if (error) {
          message.error(error?.rawLog || "Transaction Failed")
          setAllRewardLoading(false)
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
        setAllRewardLoading(false)
      })
    }
    else {
      setAllRewardLoading(false)
      message.error("Please Connect Wallet")
    }
  }

  const externalIncentivesColumns = [
    {
      title: 'Week',
      dataIndex: "week",
      key: "week",
      align: 'left'
    },
    {
      title: 'Assets',
      dataIndex: "assets",
      key: "assets",
      align: 'left',
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
                <span>{amountConversionWithComma(item[0]?.amount, comdex?.coinDecimals)} {denomToSymbol(item[0]?.denom)} </span>

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
      title: 'Action',
      dataIndex: "action",
      key: "action",
      align: 'center',
      className: 'justify-content-center',
      render: (proposal_id) => <>
        <Button type='primary'
          className='btn-filled px-4'
          onClick={() => claimReward(proposal_id)}
        >
          Claim
        </Button>
        {/* <div className='claimed-tag'><SvgIcon name='check-circle' viewbox='0 0 15 15' /> Claimed</div>  */}
      </>,
      width: 140
    }
  ];

  // const externalIncentivesdata = [
  //   {
  //     key: 1,
  //     week: '06',
  //     assets: '4.40 CMDX',
  //     action: ''
  //   },
  //   {
  //     key: 2,
  //     week: '05',
  //     assets: '4.40 CMDX',
  //     action: ''
  //   },
  //   {
  //     key: 3,
  //     week: '04',
  //     assets: '4.40 CMDX',
  //     action: ''
  //   },
  //   {
  //     key: 4,
  //     week: '03',
  //     assets: '4.40 CMDX',
  //     action: ''
  //   },
  //   {
  //     key: 5,
  //     week: '02',
  //     assets: '4.40 CMDX',
  //     action: ''
  //   },
  //   {
  //     key: 6,
  //     week: '01',
  //     assets: '4.40 CMDX',
  //     action: ''
  //   },
  // ];

  const externalIncentivesdata = claimableRewardsData && claimableRewardsData?.map((item) => {
    return {
      key: item?.proposal_id,
      week: item?.proposal_id,
      assets: item?.total_incentive,
      action: item?.proposal_id
    }

  })

  const emissionRewardsColumns = [
    {
      title: 'Week',
      dataIndex: "week",
      key: "week",
      align: 'left'
    },
    {
      title: 'Assets',
      dataIndex: "assets",
      key: "assets",
      align: 'left',
      render: (item) => (
        <>
          <div className="bribe-container mt-1" >
            <span className="assets-withicon">
              <span className="assets-icon">
                <SvgIcon
                  name={iconNameFromDenom("uharbor")}
                />
              </span>
            </span>
            <span>{amountConversionWithComma(item, comdex?.coinDecimals)} {denomToSymbol("uharbor")} </span>

          </div>
        </>
      ),
    },
    {
      title: 'Action',
      dataIndex: "action",
      key: "action",
      align: 'center',
      className: 'justify-content-center',
      render: (proposal_id) => <>
        <Button type='primary'
          className='btn-filled px-4'
          onClick={() => claimRebase(proposal_id)}
          loading={proposal_id === current ? loading : false}
          disabled={loading}
        >
          Claim
        </Button>
        {/* <div className='claimed-tag'><SvgIcon name='check-circle' viewbox='0 0 15 15' /> Claimed</div>  */}
      </>,
      width: 140
    }
  ];

  // const emissionRewardsdata = [
  //   {
  //     key: 1,
  //     week: '06',
  //     assets: '4.40 CMDX',
  //     action: ''
  //   },
  //   {
  //     key: 2,
  //     week: '05',
  //     assets: '4.40 CMDX',
  //     action: ''
  //   },
  //   {
  //     key: 3,
  //     week: '04',
  //     assets: '4.40 CMDX',
  //     action: ''
  //   },
  //   {
  //     key: 4,
  //     week: '03',
  //     assets: '4.40 CMDX',
  //     action: ''
  //   },
  //   {
  //     key: 5,
  //     week: '02',
  //     assets: '4.40 CMDX',
  //     action: ''
  //   },
  //   {
  //     key: 6,
  //     week: '01',
  //     assets: '4.40 CMDX',
  //     action: ''
  //   },
  // ];

  const emissionRewardsdata = claimableRebaseData && claimableRebaseData?.map((item) => {
    return {
      key: item?.proposal_id,
      week: item?.proposal_id,
      assets: item?.rebase,
      action: item?.proposal_id
    }
  })

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
            <div className='reward-card' style={{ backgroundImage: `url(${cardImage})` }}>
              <h2>Rebase Rewards </h2>
              <p>$veHarbor is distributed to $veHARBOR holders in order to reduce the voting power dilution. Users can see their $veHarbor here.</p>
              <Button type='primary' className='btn-filled'>Take me there!</Button>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md='6'>
            <Row className='mb-2'>
              <Col>
                <h2>External Incentives </h2>
              </Col>
              <Col className="text-right">
                <Button type='primary' className='btn-filled' loading={allRewardLoading} disabled={allRewardLoading} onClick={() => claimAllReward()}>Claim All</Button>
              </Col>
            </Row>
            <Table
              className="custom-table reward-table"
              dataSource={externalIncentivesdata}
              columns={externalIncentivesColumns}
              pagination={false}
              scroll={{ x: "100%" }}
              locale={{ emptyText: <NoDataIcon /> }}
            />
          </Col>
          <Col md='6'>
            <Row className='mb-2'>
              <Col>
                <h2>Emission Rewards</h2>
              </Col>
            </Row>
            <Table
              className="custom-table reward-table"
              dataSource={emissionRewardsdata}
              columns={emissionRewardsColumns}
              pagination={false}
              scroll={{ x: "100%" }}
              locale={{ emptyText: <NoDataIcon /> }}
            />
          </Col>
        </Row>
      </div>
    </>
  )
}

// export default Rewards;
Rewards.propTypes = {
  lang: PropTypes.string.isRequired,
  address: PropTypes.string,
  refreshBalance: PropTypes.number.isRequired,
};

const stateToProps = (state) => {
  return {
    lang: state.language,
    address: state.account.address,
    refreshBalance: state.account.refreshBalance,
  };
};
const actionsToProps = {
  setBalanceRefresh,
};
export default connect(stateToProps, actionsToProps)(Rewards);