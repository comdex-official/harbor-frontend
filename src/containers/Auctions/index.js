import * as PropTypes from "prop-types";
import React, { useState } from 'react'
import { Tabs, message, Button } from "antd";
import { connect } from 'react-redux';
import { Col, Row } from "../../components/common";
import SurplusAuction from "./Serplus Auction";
import DebtAuction from "./Debt Auction";
import CollateralAuction from "./Collateral Auction";
import { setPairs } from "../../actions/asset";

const Auctions = ({ lang, setPairs }) => {
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
                            <TabPane tab="Collateral " key="1" >
                                <CollateralAuction />

                            </TabPane>
                            <TabPane tab="Surplus" key="2" >
                                <SurplusAuction />

                            </TabPane>
                            <TabPane tab="Debt" key="3" >
                                <DebtAuction />
                            </TabPane>
                        </Tabs>
                    </Col>
                </Row>
            </div>
        </>
    )
}


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
    setPairs
};

export default connect(stateToProps, actionsToProps)(Auctions);
