import * as PropTypes from "prop-types";
import { Col, Row } from "../../components/common";
import { connect } from "react-redux";
import React, { useEffect, useState } from "react";
import { Button, message, Spin } from "antd";
import { Modal } from "antd";
import { Tabs } from "antd";
import Deposit from "./Deposit";
import Withdraw from "./Withdraw";

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
        <div className="app-content-small">
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
                  <Withdraw/>
                </TabPane>
              </Tabs>
            </Col>
          </Row>
        </div>
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
