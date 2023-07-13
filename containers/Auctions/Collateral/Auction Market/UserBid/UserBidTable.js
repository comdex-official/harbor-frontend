import React, { useState } from 'react'
import TooltipIcon from '../../../../../components/TooltipIcon';
import { Col, Row, SvgIcon } from '../../../../../components/common';
import { amountConversionWithComma, denomConversion } from '../../../../../utils/coin';
import { Button, Input, Modal, Slider, Table } from 'antd';
import NoDataIcon from '../../../../../components/common/NoDataIcon';
import CustomInput from '../../../../../components/CustomInput';

const UserBidTable = () => {

    const [isCancleModalOpen, setCancleIsModalOpen] = useState(false);
    const [isWithdrawModalOpen, setWithdrawIsModalOpen] = useState(false);

    const showCancleModal = () => {
        setCancleIsModalOpen(true);
    };
    const handleCancleOk = () => {
        setCancleIsModalOpen(false);
    };
    const handleCancelModalCancle = () => {
        setCancleIsModalOpen(false);
    };
    const showWithdrawModal = () => {
        setWithdrawIsModalOpen(true);
    };
    const handleWithdraweOk = () => {
        setWithdrawIsModalOpen(false);
    };
    const handleWithdrawModalCancle = () => {
        setWithdrawIsModalOpen(false);
    };

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
                <>
                    <div className="your_bid_action_button">
                        <Button
                            size="small"
                            className="biddin-btn bid-btn-rejected"
                            onClick={showCancleModal}
                        >
                            Cancel
                        </Button>

                        <Button
                            size="small"
                            className="biddin-btn bid_btn_withdraw"
                            onClick={showWithdrawModal}
                        >
                            Withdraw
                        </Button>
                    </div>
                </>
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
                                    className="custom-table liquidation-table live_auction_bid_table"
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

                {/* Cancle Modal  */}
                <Modal title={
                    <>
                        <div className='cancel_bid_ttitle'>Are you sure you want to cancle your Bid?</div>
                        <div className="cancle_button_container">
                            <div className="yes_button">
                                <Button type="primary" onClick={handleCancelModalCancle}>No</Button>
                            </div>
                            <div className="no_button">
                                <Button type="primary" className='btn-filled' onClick={handleCancleOk}>Yes</Button>
                            </div>
                        </div>
                    </>
                }
                    open={isCancleModalOpen}
                    centered={true}
                    onCancel={handleCancelModalCancle}
                    className='auction_cancle_modal'
                    width={400}
                    footer={false}
                >

                </Modal>

                {/* Withdraw Amount Modal  */}
                <Modal title={
                    <>
                        <div className='withdraw_bid_ttitle'>Withdraw Amount</div>
                    </>
                }
                    open={isWithdrawModalOpen}
                    centered={true}
                    className='auction_withdraw_modal'
                    width={400}
                    footer={false}
                    onCancel={handleWithdrawModalCancle}
                    closable={true}
                >
                    <div className="auction_bid_widthraw_bid_modal_main_container">
                        <div className="auction_bid_widthraw_bid_modal_container">
                            <div className="amount_title">Select Amount</div>
                            <div className="slider_container">
                                <Slider
                                    defaultValue={30}
                                    tooltip={{ open: false }}
                                    className='comdex-slider auction_withdraw_slider'
                                />
                            </div>
                            <div className="input_container">
                                <div className="input_box">
                                    {/* <Input className='input_with_no_border' value={100} /> */}
                                    <CustomInput
                                        className='auction_withdraw_bid_input'
                                        value={100}
                                    />
                                </div>
                                <div className="denom_box">CMST</div>
                            </div>
                            <div className="note_container">
                                NOTE: withdrawal of a successful bid will include a 0.5% fee. All fees are paid to CMST stakers.
                            </div>
                            <div className="withdraw_btn_container">
                                <Button type='primary' className='btn-filled'>Withdraw</Button>
                            </div>
                        </div>
                    </div>
                </Modal>


            </div>
        </>
    )
}

export default UserBidTable