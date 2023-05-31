import React from 'react'
import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import { Row } from '@/components/common';
import { Col, Tabs } from 'antd';
import Deposit from './deposit';
import Withdraw from './withdraw';

const Locker = () => {
    const tabItems =
        [
            { label: "Deposit", key: "1", children: <Deposit /> },
            { label: "Withdraw", key: "2", children: <Withdraw /> },
        ]

    const handleTabChange = (key) => {
        console.log(key);
    }
    return (
        <>
            <div className="locker_main_container">
                <div className="locker_container">
                    <Row>
                        <Col>
                            <Tabs
                                className="comdex-tabs"
                                defaultActiveKey="1"
                                onChange={handleTabChange}
                                items={tabItems}
                            />
                        </Col>
                    </Row>
                </div>
            </div>
        </>
    )
}

Locker.propTypes = {
    lang: PropTypes.string.isRequired,
    address: PropTypes.string,
    balances: PropTypes.arrayOf(
        PropTypes.shape({
            denom: PropTypes.string.isRequired,
            amount: PropTypes.string,
        })
    ),
};

const stateToProps = (state) => {
    return {
        lang: state.language,
        address: state.account.address,
        balances: state.account.balances.list,
    };
};

const actionsToProps = {};

export default connect(stateToProps, actionsToProps)(Locker);
