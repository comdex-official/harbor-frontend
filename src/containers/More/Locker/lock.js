import React from 'react'
import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import TooltipIcon from '../../../components/TooltipIcon';
import { Col, Row, SvgIcon } from '../../../components/common';
import { Table } from 'antd';
import { iconNameFromDenom } from '../../../utils/string';

const Lock = ({ address }) => {







    const columns = [
        {
            title: "Pair",
            dataIndex: "pair",
            key: "pair",
            width: 300,
        },
        {
            title: (
                <>
                    Amount{" "}
                    <TooltipIcon text="Type of transaction ( Withdraw or Deposit)" />
                </>
            ),
            dataIndex: "amount",
            key: "balance",
            width: 300,
        },
        {
            title: "Value",
            dataIndex: "value",
            key: "value",
            width: 300,
        },
        {
            title: (
                <>
                    Expires <TooltipIcon text="Balance after transaction" />
                </>
            ),
            dataIndex: "expires",
            key: "expires",
            width: 300,
        },
    ];


    const tableData = [
        {
            key: 1,
            pair: <>
                <div className="assets-withicon">
                    <div className="assets-icon">
                        <SvgIcon
                            name={iconNameFromDenom('uharbor')}
                        />
                    </div>
                    <div className="nft-container">
                        <div className="nft-id">1234</div>
                        <div className="name">NFT ID</div>
                    </div>
                </div>
            </>,
            amount: <>
                <div className="amount-container">
                    <div className="amount">0.45</div>
                    <div className="denom">HRBOR</div>
                </div>
            </>,
            value: <>
                <div className="amount-container">
                    <div className="amount">0.45</div>
                    <div className="denom">veHRBOR</div>
                </div>
            </>,
            expires: <>
                <div className="amount-container">
                    <div className="amount">08-08-2022</div>
                    <div className="denom">Expires 20 days ago</div>
                </div>
            </>,

        },
        {
            key: 2,
            pair: <>
                <div className="assets-withicon">
                    <div className="assets-icon">
                        <SvgIcon
                            name={iconNameFromDenom('uharbor')}
                        />
                    </div>
                    <div className="nft-container">
                        <div className="nft-id">1234</div>
                        <div className="name">NFT ID</div>
                    </div>
                </div>
            </>,
            amount: <>
                <div className="amount-container">
                    <div className="amount">0.45</div>
                    <div className="denom">HRBOR</div>
                </div>
            </>,
            value: <>
                <div className="amount-container">
                    <div className="amount">0.45</div>
                    <div className="denom">veHRBOR</div>
                </div>
            </>,
            expires: <>
                <div className="amount-container">
                    <div className="amount">08-08-2022</div>
                    <div className="denom">Expires 20 days ago</div>
                </div>
            </>,

        }

    ]

    return (
        <>
            <div className="app-content-wrappers earn-table-container more-locker-lock-table">

                <Row>
                    <Col>
                        <Table
                            className="custom-table"
                            dataSource={tableData}
                            columns={columns}
                            pagination={false}
                            scroll={{ x: "100%" }}
                        />
                    </Col>
                </Row>
            </div>
        </>
    )
}

Lock.propTypes = {
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


export default connect(stateToProps, actionsToProps)(Lock);