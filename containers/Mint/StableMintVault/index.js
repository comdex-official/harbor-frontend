import React from 'react'
import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import { Row, Col } from '@/components/common';
import { Tabs } from 'antd';
import Deposit from './deposit';
import Withdraw from './withdraw';
import '../../../styles/containers/Locker/locker.module.scss';

const StableMint = () => {
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
                        <Col style={{ width: "100%" }}>
                            <Tabs
                                className="comdex-tabs"
                                defaultActiveKey="1"
                                onChange={handleTabChange}
                                items={tabItems}
                            />
                        </Col>
                    </Row>
                </div>

                <div className="stablemint_vault_details_main_container mt-4">
                    <div className="stablemint_vault_details_container card_container">
                        <Row>
                            <Col>
                                <div className="stablemint_title">Vault Details</div>
                                <div className="stablemint_detail_container">
                                    <div className="data_box">
                                        <div className="stable_data_title">Total USDC Locked</div>
                                        <div className="stable_data_value">30,000 USDC</div>
                                    </div>
                                    <div className="data_box">
                                        <div className="stable_data_title">Total CMST Minted</div>
                                        <div className="stable_data_value">100.00 CMST</div>
                                    </div>
                                    <div className="data_box">
                                        <div className="stable_data_title">CMST Ceiling</div>
                                        <div className="stable_data_value">10.00 CMST</div>
                                    </div>
                                    <div className="data_box">
                                        <div className="stable_data_title">Drawdown Fee</div>
                                        <div className="stable_data_value">0.1%</div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        </>
    )
}

StableMint.propTypes = {
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

export default connect(stateToProps, actionsToProps)(StableMint);
