import React, { useEffect, useState } from "react";
import { Tabs, message, Button } from "antd";
import "./index.scss";
import { Col, Row } from "../../../components/common";
import { Link } from "react-router-dom";
import Mint from "./Mint";
import EditTab from "../Vault/EditTab";
import Close from "./Close";
// import EditTab from "../Minting/EditTab/Tab";

const Vault = () => {
  const [activeKey, setActiveKey] = useState("1");
  const { TabPane } = Tabs;

  const BackButton = {
    right: (
      <Link to="/mint">
        <Button className="back-btn" type="primary">
          Back
        </Button>
      </Link>
    ),
  };
  return (
    <>
      <div className="app-content-wrapper">
        <Row>
          <Col>
            <Tabs
              className="comdex-tabs"
              defaultActiveKey="1"
              tabBarExtraContent={BackButton}
            >
              <TabPane tab="Mint" key="1">
                <Mint />
              </TabPane>
              <TabPane tab="Edit" key="2">
                <EditTab />
              </TabPane>
              <TabPane tab="Close" key="3">
                <Close />
              </TabPane>
            </Tabs>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Vault;
