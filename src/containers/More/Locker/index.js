import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import { Tabs } from 'antd';
import React from 'react'
import { Col, Row } from '../../../components/common';
import './index.scss'
import Lock from "./lock";
import Create from "./create";
const { TabPane } = Tabs;

const Locker = ({ address }) => {
    const callback = (key) => {

    };
    return (
        <>
            <div className="app-content-wrapper">
                <Row>
                    <Col>
                        <Tabs
                            className="comdex-tabs"
                            defaultActiveKey="1"
                            onChange={callback}
                        >
                            <TabPane tab="Lock" key="1">
                                {/* <MyEarn /> */}
                                <Lock />
                            </TabPane>
                            <TabPane tab="Create" key="2">
                                {/* <Borrow /> */}
                                <Create />
                            </TabPane>
                        </Tabs>
                    </Col>
                </Row>
            </div>
        </>
    )
}
Locker.propTypes = {
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
export default connect(stateToProps, actionsToProps)(Locker);