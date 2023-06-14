import React from 'react'
import TooltipIcon from '../../../../../components/TooltipIcon';
import { Col, Row, SvgIcon } from '../../../../../components/common';
import { amountConversionWithComma, denomConversion } from '../../../../../utils/coin';
import { Button, Table } from 'antd';
import NoDataIcon from '../../../../../components/common/NoDataIcon';

const UserBidTable = () => {

    const columnsBidding = [
        {
            title: (
                <>
                    Discount <TooltipIcon text="" />
                </>
            ),
            dataIndex: "discount",
            key: "discount",
        },
        {
            title: (
                <>
                    Bid Remaining{" "}
                    <TooltipIcon text="" />
                </>
            ),
            dataIndex: "bid_remaining",
            key: "bid_remaining",
        },
        {
            title: <>
                Amount Filled <TooltipIcon text="" />
            </>,
            dataIndex: "amount_remaining",
            key: "amount_remaining",
            // render: (end_time) => <div className="endtime-badge">{end_time}</div>,
        },
        {
            title: (
                <>
                    Bid Status <TooltipIcon text="" />
                </>
            ),
            dataIndex: "bid_status",
            key: "bid_status",
        },
        {
            title: (
                <>
                    Action <TooltipIcon text="" />
                </>
            ),
            dataIndex: "action",
            key: "action",
            align: "right",
            width: 120,
        },
    ];

    const BiddingData = [
        {
            key: 1,
            discount: (
                <>
                    15.0%
                </>
            ),
            bid_remaining: (
                <>
                    0.00 CMST
                </>
            ),
            amount_remaining: "100 ATOM",
            bid_status: (
                <Button
                    size="small"
                    className={
                        "active" === "active"
                            ? "biddin-btn bid-btn-success"
                            : "item?.auctionStatus" === "inactive"
                                ? "biddin-btn bid-btn-rejected"
                                : ""
                    }
                >
                    Active
                </Button>
            ),
            action: (
                <Button
                    size="small"
                    className="biddin-btn bid-btn-rejected"
                >
                    Cancel
                </Button>
            ),
        }
    ]

    return (
        <>
            <div className="app-content-wrapper">
                <Row>
                    <Col>
                        <div className={"auctions?.auctions?.length" > 0 ? "composite-card py-3" : "composite-card py-3 height-16"}>
                            <div className="card-content">
                                <Table
                                    className="custom-table liquidation-table"
                                    dataSource={BiddingData}
                                    columns={columnsBidding}
                                    // onRow={(record, rowIndex) => {
                                    //     return {
                                    //         onClick: () => handelClickAuctionMarketTable(record, rowIndex),
                                    //     };
                                    // }}
                                    // loading={inProgress || updateBtnLoading}
                                    // rowClassName={() => 'custom-table-with-hover'}
                                    scroll={{ x: "100%" }}
                                    locale={{ emptyText: <NoDataIcon /> }}
                                />
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </>
    )
}

export default UserBidTable