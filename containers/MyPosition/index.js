import * as PropTypes from "prop-types";
import { Col, Row } from "../../components/common";
import { connect } from "react-redux";
import { Progress, Tabs, List, message } from "antd";
import MyEarn from "./MyLocker";
import Borrow from "./MyVault";
import History from "./History";
import { useState, useEffect } from "react";
import TooltipIcon from "../../components/TooltipIcon";
import { queryUserLockerStats } from "../../services/locker/query";
import { DOLLAR_DECIMALS } from "../../constants/common";
import {
  amountConversionWithComma,
  denomConversion,
} from "../../utils/coin";
import { queryCollectorInformation } from "../../services/collector";
import { queryUserVaultsStats } from "../../services/vault/query";
import { decimalConversion } from "../../utils/number";
import { cmst } from "../../config/network";
import "../../styles/containers/MyPositions/MyPositions.module.scss";


const MyPositions = ({ address, balances }) => {
  const [earnTab, setEarnTab] = useState(false);
  const [vaultTab, setVaultTab] = useState(true);
  const [historyTab, setHistoryTab] = useState(false);
  const [lockerInfo, setLockerInfo] = useState();
  const [vaultsInfo, setVaultsInfo] = useState();
  const [collectorInfo, setCollectorInfo] = useState();
  const [activeKey, setActiveKey] = useState(1);

  const tabsItem = [
    { label: "Vaults", key: "1", children: <Borrow activeKey={activeKey} /> },
    { label: "Locker", key: "2", children: <MyEarn /> },
    { label: "History", key: "3", children: <History /> },
  ]

  useEffect(() => {
    if (address) {
      fetchCollectorStats();
      fetchVaultStats();
    }
  }, [address]);

  useEffect(() => {
    if (address) {
      fetchLockerStats();
    }
  }, [address]);

  const fetchCollectorStats = () => {
    queryCollectorInformation((error, result) => {
      if (error) {
        message.error(error);
        return;
      }

      setCollectorInfo(result?.collectorLookup[0]);
    });
  };
  const fetchLockerStats = () => {
    queryUserLockerStats(address, (error, result) => {
      if (error) {
        message.error(error);
        return;
      }

      setLockerInfo(result?.lockerInfo[0]);
    });
  };

  const fetchVaultStats = () => {
    queryUserVaultsStats(address, (error, result) => {
      if (error) {
        message.error(error);
        return;
      }

      setVaultsInfo(result);
    });
  };

  const callback = (key) => {
    setActiveKey(key)
    if (key === "1") {
      setHistoryTab(false);
      setVaultTab(true);
      setEarnTab(false);
      return;
    }
    if (key === "2") {
      setHistoryTab(false);
      setVaultTab(false);
      setEarnTab(true);
      return;
    }
    if (key === "3") {
      setEarnTab(false);
      setVaultTab(false);
      setHistoryTab(true);
    }
  };

  const data = [
    {
      title: (
        <>
          {earnTab && (
            <>
              Locker Balance{" "}
              <TooltipIcon text="Current balance of Composite deposited in Locker" />
            </>
          )}
          {vaultTab && (
            <>
              Collateral Locked{" "}
              <TooltipIcon text="Total amount of collateral locked across all vaults" />
            </>
          )}
          {historyTab && (
            <>
              Locker Balance{" "}
              <TooltipIcon text="Current balance of Composite deposited in Locker" />
            </>
          )}
        </>
      ),
      counts: (
        <>
          {earnTab && (
            <div className="stats-values">
              {/* Locker Balance */}
              <h3>{amountConversionWithComma(lockerInfo?.netBalance || 0, DOLLAR_DECIMALS)}</h3>
              <span>CMST</span>
            </div>
          )}
          {vaultTab && (
            <div className="stats-values">
              {/* Collateral Locked */}
              <h3>
                $
                {amountConversionWithComma(
                  Number(vaultsInfo?.collateralLocked || 0), DOLLAR_DECIMALS
                )}
              </h3>
            </div>
          )}
          {historyTab && (
            <div className="stats-values">
              {/* Locker Balance */}
              <h3>{amountConversionWithComma(lockerInfo?.netBalance || 0, DOLLAR_DECIMALS)}</h3>

              <span>{denomConversion(cmst?.coinMinimalDenom)}</span>
            </div>
          )}
        </>
      ),
    },
    {
      title: (
        <>
          {earnTab && (
            <>
              Total interest Earned{" "}
              <TooltipIcon text="Total interest accumulated till date from Locker" />
            </>
          )}
          {vaultTab && (
            <>
              Total Borrowed{" "}
              <TooltipIcon text="Composite Debt owed across all vaults which is a sum of Composite borrowed and interest accrued" />
            </>
          )}
          {historyTab && (
            <>
              Collateral Locked{" "}
              <TooltipIcon text="Total amount of collateral locked across all vaults" />
            </>
          )}
        </>
      ),
      counts: (
        <>
          {earnTab && (
            <div className="stats-values">
              {/* Total interest Earned */}
              <h3>
                {amountConversionWithComma(lockerInfo?.returnsAccumulated || 0)}
              </h3>
              <span>CMST</span>
            </div>
          )}
          {vaultTab && (
            <div className="stats-values">
              {/* Total Borrowed */}
              <h3>
                {amountConversionWithComma(Number(vaultsInfo?.totalDue || 0), DOLLAR_DECIMALS)}
              </h3>
              <span>{denomConversion(cmst?.coinMinimalDenom)}</span>
            </div>
          )}
          {historyTab && (
            <div className="stats-values">
              {/* Collateral Locked */}
              <h3>
                $
                {amountConversionWithComma(
                  Number(vaultsInfo?.collateralLocked || 0), DOLLAR_DECIMALS
                )}
              </h3>
            </div>
          )}
        </>
      ),
    },
    {
      title: (
        <>
          {earnTab && (
            <>
              Locker Savings Rate{" "}
              <TooltipIcon text="Current annual interest rate of Locker" />
            </>
          )}
          {vaultTab && (
            <>
              Available To Borrow{" "}
              <TooltipIcon text="Total amount of Composite available to borrow adhering to vault safety limits" />
            </>
          )}
          {historyTab && (
            <>
              Total Borrowed{" "}
              <TooltipIcon text="Total amount of Composite available to borrow adhering to vault safety limits" />
            </>
          )}
        </>
      ),
      counts: (
        <>
          {earnTab && (
            <div className="stats-values">
              {/* Locker Savings Rate */}
              <h3>
                {collectorInfo?.lockerSavingRate
                  ? Number(
                    decimalConversion(collectorInfo?.lockerSavingRate || 0) * 100
                  ).toFixed(DOLLAR_DECIMALS)
                  : Number().toFixed(DOLLAR_DECIMALS)}
                %
              </h3>
            </div>
          )}
          {vaultTab && (
            <div className="stats-values">
              {/* Available to borrow */}
              <h3>
                {amountConversionWithComma(Number(vaultsInfo?.availableToBorrow || 0), DOLLAR_DECIMALS)}
              </h3>
              <span>{denomConversion(cmst?.coinMinimalDenom)}</span>
            </div>
          )}
          {historyTab && (
            <div className="stats-values">
              {/* Total Borrowed */}
              <h3>
                {amountConversionWithComma(Number(vaultsInfo?.totalDue || 0), DOLLAR_DECIMALS)}
              </h3>
              <span>{denomConversion(cmst?.coinMinimalDenom)}</span>
            </div>
          )}
        </>
      ),
    },
  ];
  const calculateProgressPercentage = (number) => {
    let ratio = 500 / number;
    let percentage = 100 / ratio;
    return percentage.toFixed(DOLLAR_DECIMALS);
  }
  return (
    <div className="app-content-wrapper">
      <Row>
        <Col>
          <div className=" myhome-upper  card_container">
            {/* <div className="myhome-upper-left">
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
                renderItem={(item) => (
                  <List.Item>
                    <div>
                      <p>{item.title}</p>
                      <h3>{item.counts}</h3>
                    </div>
                  </List.Item>
                )}
              />
            </div> */}

            <div className="myhome_upper_main_container">
              <div className="myhome_upper_container">

                <div className="myhome_upper_stats">
                  <div className="stats_heading primary_heading">
                    {earnTab && (
                      <>
                        Locker Balance{" "}
                        <TooltipIcon text="Current balance of Composite deposited in Locker" />
                      </>
                    )}
                    {vaultTab && (
                      <>
                        Collateral Locked{" "}
                        <TooltipIcon text="Total amount of collateral locked across all vaults" />
                      </>
                    )}
                    {historyTab && (
                      <>
                        No. of Deposit Transactions{" "}
                        <TooltipIcon text="" />
                      </>
                    )}
                  </div>
                  <div className="stats_values primary_values">
                    {/* $1,081,131.90 */}
                    {earnTab && (
                      <>
                        {/* Locker Balance */}
                        {amountConversionWithComma(lockerInfo?.netBalance || 0, DOLLAR_DECIMALS)}{" "}  <span>CMST</span>
                      </>
                    )}
                    {vaultTab && (
                      <>
                        {/* Collateral Locked */}
                        $
                        {amountConversionWithComma(
                          Number(vaultsInfo?.collateralLocked || 0), DOLLAR_DECIMALS
                        )}
                      </>
                    )}
                    {historyTab && (
                      <>
                        {/* Locker Balance */}
                        {/* {amountConversionWithComma(lockerInfo?.netBalance || 0, DOLLAR_DECIMALS)}{" "} <span>CMST</span> */}
                        287
                      </>
                    )}
                  </div>
                </div>

                <div className="myhome_upper_stats">
                  <div className="stats_heading primary_heading">
                    {earnTab && (
                      <>
                        Total Rewards Earned{" "}
                        <TooltipIcon text="Total interest accumulated till date from Locker" />
                      </>
                    )}
                    {vaultTab && (
                      <>
                        Total Borrowed{" "}
                        <TooltipIcon text="Composite Debt owed across all vaults which is a sum of Composite borrowed and interest accrued" />
                      </>
                    )}
                    {historyTab && (
                      <>
                        No. of Withdraw transactions{" "}
                        <TooltipIcon text="" />
                      </>
                    )}
                  </div>
                  <div className="stats_values primary_values">
                    {/* 1,081,131.90 CMST */}
                    {earnTab && (
                      <>
                        {/* Total Rewards Earned */}
                        {amountConversionWithComma(lockerInfo?.returnsAccumulated || 0)} {" "}
                        <span>CMST</span>
                      </>
                    )}
                    {vaultTab && (
                      <>
                        {/* Total Borrowed */}
                        {amountConversionWithComma(Number(vaultsInfo?.totalDue || 0), DOLLAR_DECIMALS)} {" "}
                        <span>{denomConversion(cmst?.coinMinimalDenom)}</span>
                      </>
                    )}
                    {historyTab && (
                      <>
                        {/* Collateral Locked */}
                        287
                      </>
                    )}
                  </div>
                </div>

                <div className="myhome_upper_stats">
                  <div className="stats_heading primary_heading">
                    {earnTab && (
                      <>
                        Reward rate {" "}
                        <TooltipIcon text="Current annual interest rate of Locker" />
                      </>
                    )}
                    {vaultTab && (
                      <>
                        Available To Borrow{" "}
                        <TooltipIcon text="Total amount of Composite available to borrow adhering to vault safety limits" />
                      </>
                    )}
                    {/* {historyTab && (
                      <>
                        Total Borrowed{" "}
                        <TooltipIcon text="Total amount of Composite available to borrow adhering to vault safety limits" />
                      </>
                    )} */}
                  </div>
                  <div className="stats_values primary_values">
                    {/* 1,081,131.90 CMST */}
                    {earnTab && (
                      <>
                        {/* Reward rate */}
                        {collectorInfo?.lockerSavingRate
                          ? Number(
                            decimalConversion(collectorInfo?.lockerSavingRate || 0) * 100
                          ).toFixed(DOLLAR_DECIMALS)
                          : Number().toFixed(DOLLAR_DECIMALS)}
                        %
                      </>
                    )}
                    {vaultTab && (
                      <>
                        {/* Available to borrow */}
                        {amountConversionWithComma(Number(vaultsInfo?.availableToBorrow || 0), DOLLAR_DECIMALS)} {" "}
                        <span>{denomConversion(cmst?.coinMinimalDenom)}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <Tabs
            className="comdex-tabs"
            defaultActiveKey="1"
            onChange={callback}
            items={tabsItem}
          />
        </Col>
      </Row>
    </div>
  );
};

MyPositions.propTypes = {
  lang: PropTypes.string.isRequired,
  address: PropTypes.string,
  balances: PropTypes.arrayOf(
    PropTypes.shape({
      denom: PropTypes.string.isRequired,
      amount: PropTypes.string,
    })
  ),
};

const stateToProps = (state) => {
  return {
    lang: state.language,
    address: state.account.address,
    balances: state.account.balances.list,
  };
};

const actionsToProps = {};

export default connect(stateToProps, actionsToProps)(MyPositions);
