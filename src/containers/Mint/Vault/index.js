import React, { useEffect, useState } from "react";
import { Tabs, Button } from "antd";
import "./index.scss";
import { Col, Row } from "../../../components/common";
import { Link } from "react-router-dom";
import Mint from "./Mint";
import Close from "./Close";
import EditTab from "./EditTab";
import { useSelector } from "react-redux";

const Vault = () => {
  const [activeKey, setActiveKey] = useState("1");
  const { TabPane } = Tabs;
  const ownerVaultId = useSelector((state) => state.locker.ownerVaultId);

  useEffect(() => {
    if (ownerVaultId) {
      setActiveKey("2");
    }
  }, [ownerVaultId]);

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
              onChange={setActiveKey}
              activeKey={activeKey}
              tabBarExtraContent={BackButton}
            >
              <TabPane tab="Mint" key="1" disabled={ownerVaultId}>
                <Mint />
              </TabPane>
              <TabPane tab="Edit" key="2" disabled={!ownerVaultId}>
                <EditTab />
              </TabPane>
              <TabPane tab="Close" key="3" disabled={!ownerVaultId}>
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
