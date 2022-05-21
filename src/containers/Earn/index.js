import * as PropTypes from "prop-types";
import { Col, Row } from "../../components/common";
import { connect } from "react-redux";
import React, { useEffect, useState } from "react";
import { Button, message, Spin } from "antd";
import { Modal } from "antd";
import { Tabs } from "antd";
import Deposit from "./Deposit";
import Withdraw from "./Withdraw";
import CustomInput from "../../components/CustomInput";
// import './index.scss'

const Earn = () => {
  const [inProgress, setInProgress] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [defaultTabSelect, setDefaultTabSelect] = useState("1");
  const { TabPane } = Tabs;

  const callback = (key) => {
    setDefaultTabSelect(key);
  };
  const showModal = (pool) => {
    setDefaultTabSelect("1");
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  return (
    <>
      <div className="app-content-wrapper">
        <Row>
          <Col>
            <Tabs
              className="comdex-tabs"
              type="card"
              activeKey={defaultTabSelect}
              onChange={callback}
              className="comdex-tabs farm-modal-tab"
            >
              <TabPane tab="Deposit" key="1">
                <Deposit />
              </TabPane>
              <TabPane tab="Withdraw" key="2">
                <Withdraw />
              </TabPane>
            </Tabs>
          </Col>

          <Col>
            <div className="earn-deposite-card calculator-main-container">
              <div className="calculator-title">Calculator</div>
              <div className="calculator-container">
                <div className="content-container">
                  <div className="left-container">Total Investment (CMST)</div>
                  <div className="right-container">
                    <div className="input-container">
                      <CustomInput
                        className=""
                        placeholder=" "
                      />
                    </div>
                  </div>
                </div>
                <div className="content-container">
                  <div className="left-container">Time Period</div>
                  <div className="right-container">
                    <div className="input-container">

                      <div className="year-container">
                        <CustomInput
                          className=""
                          placeholder=" "
                        />
                      </div>
                      <div className="month-container">
                        <CustomInput
                          className=""
                          placeholder=" "
                        />
                      </div>
                      <div className="day-container">

                        <CustomInput
                          className=""
                          placeholder=" "
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="content-container">
                  <div className="left-container">Expected Interest</div>
                  <div className="right-container">6%</div>
                </div>
                <div className="content-container">
                  <div className="left-container">Total Value</div>
                  <div className="right-container">2035 CMST</div>
                </div>
              </div>
            </div>
          </Col>

        </Row>
      </div>
    </>
  );
};
Earn.propTypes = {
  lang: PropTypes.string.isRequired,
};

const stateToProps = (state) => {
  return {
    lang: state.language,
  };
};
const actionsToProps = {};
export default connect(stateToProps, actionsToProps)(Earn);



