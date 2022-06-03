import * as PropTypes from "prop-types";
import React, { useState } from "react";
import { Tabs } from "antd";
import { connect } from "react-redux";
import { Col, Row } from "../../components/common";
import SurplusAuction from "./Surplus";
import DebtAuction from "./Debt";
import DutchAuction from "./Dutch";
import { setPairs } from "../../actions/asset";

const Auctions = () => {
  const [activeKey, setActiveKey] = useState("1");
  const { TabPane } = Tabs;

  const callback = (key) => {
    setActiveKey(key);
  };

  return (
    <>
      <div className="app-content-wrapper">
        <Row>
          <Col>
            <Tabs
              className="comdex-tabs"
              onChange={callback}
              activeKey={activeKey}
            >
              <TabPane tab="Dutch " key="1">
                <DutchAuction />
              </TabPane>
              <TabPane tab="Debt" key="2">
                <DebtAuction />
              </TabPane>
              <TabPane tab="Surplus" key="3">
                <SurplusAuction />
              </TabPane>
            </Tabs>
          </Col>
        </Row>
      </div>
    </>
  );
};

Auctions.propTypes = {
  lang: PropTypes.string.isRequired,
  setPairs: PropTypes.func.isRequired,
};

const stateToProps = (state) => {
  return {
    lang: state.language,
  };
};

const actionsToProps = {
  setPairs,
};

export default connect(stateToProps, actionsToProps)(Auctions);
