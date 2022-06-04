import * as PropTypes from "prop-types";
import { Col, Row } from "../../components/common";
import { connect } from "react-redux";
import { Progress, Tabs, List, message} from "antd";
import MyEarn from "./MyLocker";
import Borrow from "./MyVault";
import History from "./History";
import "./index.scss";
import { useState, useEffect} from "react";
import TooltipIcon from "../../components/TooltipIcon";
import {queryUserLockerStats} from "../../services/locker/query";
import {PRODUCT_ID} from "../../constants/common";
import {amountConversion} from "../../utils/coin";

const { TabPane } = Tabs;

const MyPositions = ({address}) => {
  const [earnTab, setEarnTab] = useState(true);
  const [vaultTab, setVaultTab] = useState(false);
  const [historyTab, setHistoryTab] = useState(false);
  const [lockerInfo, setLockerInfo] = useState();

  useEffect(()=>{
    if(address) {
      fetchLockerStats()
    }
  },[address])

  const fetchLockerStats = () => {
    queryUserLockerStats(PRODUCT_ID, address, (error, result)=>{
      if(error){
        message.error(error);
        return;
      }

      setLockerInfo(result?.lockerInfo[0])
    })
  };

  const callback = (key) => {
    if (key === "1") {
      setHistoryTab(false);
      setVaultTab(false);
      setEarnTab(true);
      return;
    }
    if (key === "2") {
      setHistoryTab(false);
      setEarnTab(false);
      setVaultTab(true);
      return;
    }
    if (key === "3") {
      setEarnTab(false);
      setVaultTab(false);
      setHistoryTab(true);

    }
  }

  const data = [
    {
      title: (
        <>
          {earnTab &&
            <>
              Current Balance <TooltipIcon text="Current balance of Composite deposited in Locker" />
            </>}
          {vaultTab && <>
            Collateral Locked <TooltipIcon text="Total amount of collateral locked across all vaults" />
          </>}
          {historyTab &&
            <>
              Current CMST Balance <TooltipIcon text="Current balance of Composite deposited in Locker" />
            </>
          }
        </>
      ),
      counts: (
        <>
          {earnTab && (
            <div className="stats-values">
              <h3>{amountConversion(lockerInfo?.netBalance || 0)}</h3>
              <span>CMST</span>
            </div>
          )}
          {vaultTab && (
            <div className="stats-values">
              <h3>145,326</h3>
              <span></span>
            </div>
          )}
          {historyTab && (
            <div className="stats-values">
              <h3>123,456</h3>
              <span>CMST</span>
            </div>
          )}
        </>
      ),
    },
    {
      title: (
        <>
          {earnTab &&
            <>
              Total interest Earned <TooltipIcon text="Total interest accumulated till date from Locker" />
            </>
          }
          {vaultTab && <>
            Total Borrowed <TooltipIcon text="Composite Debt owed for this vault which is a sum of Composite borrowed and interest accrued" />
          </>
          }
          {historyTab && <>
            Collateral Locked <TooltipIcon text="Total amount of collateral locked across all vaults" />
          </>
          }
        </>
      ),
      counts: (
        <>
          {earnTab && (
            <div className="stats-values">
              <h3>{amountConversion(lockerInfo?.returnsAccumulated || 0)}</h3>
              <span>CMST</span>
            </div>
          )}
          {vaultTab && (
            <div className="stats-values">
              <h3>145,326</h3>
              <span>CMST</span>
            </div>
          )}
          {historyTab && (
            <div className="stats-values">
              <h3>123,456</h3>
              <span>CMST</span>
            </div>
          )}
        </>
      ),
    },
    {
      title: (
        <>
          {earnTab &&
            <>
              Current interest Rate <TooltipIcon text="Current annual interest rate of Locker" />
            </>
          }
          {vaultTab &&
            <>
              Available To Borrow <TooltipIcon text="Total amount of Composite available to borrow adhering to vault safety limits" />
            </>
          }
          {historyTab && <>
            Total Borrowed <TooltipIcon text="Total amount of Composite available to borrow adhering to vault safety limits" />
          </>
          }
        </>
      ),
      counts: (
        <>
          {earnTab && (
            <div className="stats-values">
              <h3>6%</h3>
              <span></span>
            </div>
          )}
          {vaultTab && (
            <div className="stats-values">
              <h3>3562</h3>
              <span>CMST</span>
            </div>
          )}
          {historyTab && (
            <div className="stats-values">
              <h3>123,456</h3>
              <span>CMST</span>
            </div>
          )}
        </>
      ),
    },
  ];
  return (
    <div className="app-content-wrapper">
      <Row>
        <Col>
          <div className="composite-card myhome-upper earn-deposite-card">
            <div className="myhome-upper-left">
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
            </div>

            {vaultTab && (
              <div className="myhome-upper-right">
                <div className="borrow-limit-bar">
                  <div className="borrow-limit-upper">
                    <div>
                      <h4>Average Collateral Ratio: 0.00%</h4>
                    </div>
                  </div>
                  <div className="borrow-limit-middle">
                    <Progress percent={30} size="small" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <Tabs
            className="comdex-tabs"
            defaultActiveKey="1"
            onChange={callback}
          >
            <TabPane tab="Locker" key="1">
              <MyEarn />
            </TabPane>
            <TabPane tab="Vaults" key="2">
              <Borrow />
            </TabPane>
            <TabPane tab="History" key="3">
              <History />
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    </div>
  );
};

MyPositions.propTypes = {
  lang: PropTypes.string.isRequired,
  address: PropTypes.string,
};

const stateToProps = (state) => {
  return {
    lang: state.language,
    address: state.account.address,
  };
};

const actionsToProps = {};

export default connect(stateToProps, actionsToProps)(MyPositions);
