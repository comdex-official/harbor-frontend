import * as PropTypes from "prop-types";
import { Col, Row } from "../../components/common";
import { connect } from "react-redux";
import variables from "../../utils/variables";
import { Progress, Tabs, List } from "antd";
import MyEarn from "./MyEarn";
import Borrow from "./MyVault";
import History from "./History";
import "./index.scss";
import { useState } from "react";

const { TabPane } = Tabs;

// const data = [
//   {
//     title: "Current Balance",
//     counts: (
//       <>
//         <div className="stats-values">
//           <h3>1.040,456</h3>
//           <span>CMST</span>
//         </div>
//       </>
//     ),
//   },
//   {
//     title: "Total interest Earned",
//     counts: (
//       <>
//         <div className="stats-values">
//           <h3>21,456</h3>
//           <span>CMST</span>
//         </div>
//       </>
//     ),
//   },
//   {
//     title: "Current interest Rate",
//     counts: (
//       <>
//         <div className="stats-values">
//           <h3>6%</h3>
//           <span></span>
//         </div>
//       </>
//     ),
//   },
// ];

const MyPositions = (lang) => {
  const [earnTab, setEarnTab] = useState(true);
  const [vaultTab, setVaultTab] = useState(false);
  const [historyTab, setHistoryTab] = useState(false);

  function callback(key) {
    console.log(key);
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
      return;
    }
  }
  const data = [
    {
      title: (
        <>
          {earnTab && "Current Balance"}
          {vaultTab && "Collateral Locked"}
          {historyTab && "CMST Balance"}
        </>
      ),
      counts: (
        <>
          {earnTab && (
            <div className="stats-values">
              <h3>1.040,456</h3>
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
          {earnTab && "Total interest Earned"}
          {vaultTab && "Total Debt"}
          {historyTab && "Collateral Locked"}
        </>
      ),
      counts: (
        <>
          {earnTab && (
            <div className="stats-values">
              <h3>1.040,456</h3>
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
          {earnTab && "Current interest Rate"}
          {vaultTab && "Available To Borrow"}
          {historyTab && "Total Borrowed"}
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
                {/* <div className="mb-3">Your Borrow Limit</div> */}
                <div className="borrow-limit-bar">
                  <div className="borrow-limit-upper">
                    <div>
                      <h4>0.00%</h4>
                    </div>
                    {/* <div className="small-text">Borrow Limit :$0.00</div> */}
                  </div>
                  <div className="borrow-limit-middle">
                    <Progress percent={30} size="small" />
                  </div>
                  <div className="borrow-limit-bottom">
                    <div className="small-text">Collateral :$0.00</div>
                    <div className="small-text">Borrowed :$0.00</div>
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
            <TabPane tab="Earn" key="1">
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
};

const stateToProps = (state) => {
  return {
    lang: state.language,
  };
};

const actionsToProps = {};

export default connect(stateToProps, actionsToProps)(MyPositions);
