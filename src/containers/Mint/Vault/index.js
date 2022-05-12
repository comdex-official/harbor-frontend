import React, { useEffect, useState } from "react";
import { Tabs, message, Button } from "antd";
import "./index.scss";
import { Col, Row } from "../../../components/common";
import { Link } from "react-router-dom";

const Vault = () => {
  const [activeKey, setActiveKey] = useState("1");
  const { TabPane } = Tabs;

  return (
    <>
      <div className="app-content-wrapper vault-content-wrapper">
        <Row>
          <Col>
            <Tabs
              className="comdex-tabs"
              type="card"
              onChange={setActiveKey}
              activeKey={activeKey}
            >
              <TabPane tab="Mint" key="1">
                <h1>Tab 1</h1>
              </TabPane>
              <TabPane
                tab="Edit"
                key="2"
                // disabled={!vault.id}
              >
                <h1>Tab 2</h1>
              </TabPane>
              <TabPane
                tab="Close"
                key="3"
                // disabled={!vault.id}
              >
                <h1>Tab 3</h1>
              </TabPane>
            </Tabs>
          </Col>
          <Col>
            <div className="vault-back-btn">
              <Link to="/mint">
                <Button
                  type="primary"
                  size="small"
                  className="px-3 valult-mint-btn"
                >
                  Back
                </Button>
              </Link>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Vault;
