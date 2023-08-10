import React, { useEffect, useState } from 'react'
import TooltipIcon from '../../../../../components/TooltipIcon';
import { Col, Row, SvgIcon } from '../../../../../components/common';
import { amountConversion, amountConversionWithComma, denomConversion, getAmount } from '../../../../../utils/coin';
import { Button, Input, Modal, Slider, Table, message } from 'antd';
import NoDataIcon from '../../../../../components/common/NoDataIcon';
import CustomInput from '../../../../../components/CustomInput';
import { queryUserLimitBidsByAssetID, queryMarketAuctionsList } from '@/services/auctionV2/query';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE, DOLLAR_DECIMALS } from '../../../../../constants/common';
import { connect, useDispatch } from 'react-redux';
import * as PropTypes from "prop-types";
import { setFilteredMarketBidData } from '../../../../../actions/auction'
import { useRouter } from 'next/router';
import Long from 'long';
import { defaultFee } from '../../../../../services/transaction';
import Snack from '../../../../../components/common/Snack';
import { signAndBroadcastTransaction } from '../../../../../services/helper';
import variables from '../../../../../utils/variables';


const UserBidTable = ({ lang, address, assetMap, setFilteredMarketBidData, refreshBalance }) => {
    const dispatch = useDispatch();

    const router = useRouter();
    const { id } = router.query;
    // const [id1, id2] = id;
    // console.log(id, "id");

    const [isCancleModalOpen, setCancleIsModalOpen] = useState(false);
    const [isWithdrawModalOpen, setWithdrawIsModalOpen] = useState(false);
    const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
    const [pageNumber, setPageNumber] = useState(DEFAULT_PAGE_NUMBER)
    const [userBidData, setUserBidData] = useState()
    const [loading, setLoading] = useState(false)

    const [marketAuctionPageSize, setMarketAuctionPageSize] = useState(DEFAULT_PAGE_SIZE)
    const [marketAuctionPageNumber, setMarketAuctionPageNumber] = useState(DEFAULT_PAGE_NUMBER)
    const [limitBidOrderList, setLimitBidOrderList] = useState("")
    const [selectedUserBid, setSelectedUserBid] = useState()
    const [userBid, setUserBid] = useState()
    const [sliderValue, setSliderValue] = useState()
    // const [filteredMarketBidData, setFilteredMarketBidData] = useState()



    const fetchUserLimitBidsByAssetID = (address, collateralTokenId, debtTokenId, offset, limit, isTotal, isReverse) => {
        setLoading(true);
        queryUserLimitBidsByAssetID(
            address,
            collateralTokenId,
            debtTokenId,
            offset,
            limit,
            isTotal,
            isReverse,
            (error, result) => {
                if (error) {
                    setLoading(false);
                    message.error(error);
                    return;
                }
                console.log(result, "queryUserLimitBidsByAssetID");
                setUserBidData(result)
                setLoading(false);
            }
        );
    };

    const fetchMarketAuctionsList = (offset, limit, isTotal, isReverse) => {
        queryMarketAuctionsList(
            offset,
            limit,
            isTotal,
            isReverse,
            (error, result) => {
                if (error) {
                    message.error(error);
                    return;
                }
                if (result?.limitBidProtocolData?.length > 0) {
                    console.log(result?.limitBidProtocolData, "result Market Auction");
                    setLimitBidOrderList(result?.limitBidProtocolData)
                }
                else {
                    setLimitBidOrderList("");
                }
            }
        );
    };


    useEffect(() => {
        if (id?.length > 0) {
            // fetchUserLimitBidsByAssetID("comdex18lhjf74ehq285g0k48nuskrq5a2ge9uzhqxqps", Number(id?.[0]), Number(id?.[1]), (pageNumber - 1) * pageSize, pageSize, true, true)
            fetchUserLimitBidsByAssetID(address, Number(id?.[0]), Number(id?.[1]), (pageNumber - 1) * pageSize, pageSize, true, true)
        }
        fetchMarketAuctionsList((marketAuctionPageNumber - 1) * marketAuctionPageSize, marketAuctionPageSize, true, true);

    }, [address, id, refreshBalance])

    useEffect(() => {
        if (limitBidOrderList.length > 0) {
            const filteredData = limitBidOrderList.filter((item) => {
                return item?.collateralAssetId.toNumber() === Number(id?.[0]) && item?.debtAssetId.toNumber() === Number(id?.[1]);
            });

            setFilteredMarketBidData(filteredData?.[0])
        }

    }, [limitBidOrderList, id, refreshBalance])

    const showCancleModal = (item) => {
        setSelectedUserBid(item);
        setCancleIsModalOpen(true);
    };
    const handleCancleOk = () => {
        console.log(selectedUserBid);
        handleCancelUserBid(selectedUserBid?.collateralTokenId, selectedUserBid?.debtTokenId, selectedUserBid?.premiumDiscount)
        // setCancleIsModalOpen(false);
    };
    const handleCancelModalCancle = () => {
        setCancleIsModalOpen(false);
    };
    const showWithdrawModal = (item) => {
        setSelectedUserBid(item);
        setUserBid(amountConversion(item?.debtToken?.amount || 0, DOLLAR_DECIMALS, assetMap[item?.debtToken?.denom]?.decimals))
        setSliderValue(amountConversion(item?.debtToken?.amount || 0, DOLLAR_DECIMALS, assetMap[item?.debtToken?.denom]?.decimals))
        setWithdrawIsModalOpen(true);
    };
    const handleWithdraweOk = () => {

        handleWithdrawUserBid(selectedUserBid?.collateralTokenId, selectedUserBid?.debtTokenId, selectedUserBid?.premiumDiscount)

        // setWithdrawIsModalOpen(false);
    };
    const handleWithdrawModalCancle = () => {
        setWithdrawIsModalOpen(false);
    };

    const handleSliderChange = (value) => {
        console.log(value, "Sliver value");
        // const clampedValue = Math.min(Math.max(value, 0), userBid);
        // setUserBid(clampedValue);
        // setUserBid(value)
        setSliderValue(value)
    }

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
            render: (item) => (
                <>
                    <div className="your_bid_action_button">
                        <Button
                            size="small"
                            className="biddin-btn bid-btn-rejected"
                            onClick={() => showCancleModal(item)}
                        >
                            Cancel
                        </Button>

                        <Button
                            size="small"
                            className="biddin-btn bid_btn_withdraw"
                            onClick={() => showWithdrawModal(item)}
                        >
                            Withdraw
                        </Button>
                    </div>
                </>
            )
        },
    ];

    const BiddingData = userBidData && userBidData?.limitOrderBids?.map((item, index) => {
        return {
            key: index,
            discount: (
                <>
                    {Number(item?.premiumDiscount).toFixed(DOLLAR_DECIMALS)}%
                </>
            ),
            bid_remaining: (
                <>
                    {amountConversionWithComma(item?.debtToken?.amount || 0, DOLLAR_DECIMALS, assetMap[item?.debtToken?.denom]?.decimals)} {" "} {denomConversion(item?.debtToken?.denom)}
                </>
            ),
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
            action: item,
        }
    })

    const handleCancelUserBid = (collateralId, debtId, premiumDiscount) => {
        if (!address) {
            message.error("Address not found, please connect to Keplr");
            return;
        }
        // setInProgress(true);
        message.info("Transaction initiated");


        signAndBroadcastTransaction(
            {
                message: {
                    typeUrl: "/comdex.auctionsV2.v1beta1.MsgCancelLimitBidRequest",
                    value: {
                        bidder: address,
                        // bidder: "comdex18lhjf74ehq285g0k48nuskrq5a2ge9uzhqxqps",
                        collateralTokenId: Long.fromNumber(collateralId?.toNumber()),
                        debtTokenId: Long.fromNumber(debtId?.toNumber()),
                        premiumDiscount: String(premiumDiscount),
                    },
                },
                fee: defaultFee(),
            },
            address,
            (error, result) => {
                // setInProgress(false);
                if (error) {
                    message.error(error);
                    return;
                }

                if (result?.code) {
                    message.info(result?.rawLog);
                    return;
                }
                message.success(
                    <Snack
                        message={variables[lang].tx_success}
                        hash={result?.transactionHash}
                    />
                );
                // resetValues();
                dispatch({
                    type: "BALANCE_REFRESH_SET",
                    value: refreshBalance + 1,
                });
            }
        );
    };

    const handleWithdrawUserBid = (collateralId, debtId, premiumDiscount) => {
        if (!address) {
            message.error("Address not found, please connect to Keplr");
            return;
        }
        // setInProgress(true);
        message.info("Transaction initiated");


        signAndBroadcastTransaction(
            {
                message: {
                    typeUrl: "/comdex.auctionsV2.v1beta1.MsgWithdrawLimitBidRequest",
                    value: {
                        bidder: address,
                        // bidder: "comdex18lhjf74ehq285g0k48nuskrq5a2ge9uzhqxqps",
                        collateralTokenId: Long.fromNumber(collateralId?.toNumber()),
                        debtTokenId: Long.fromNumber(debtId?.toNumber()),
                        premiumDiscount: String(premiumDiscount),
                        amount: {
                            denom: selectedUserBid?.debtToken?.denom,
                            amount: getAmount(sliderValue, assetMap[selectedUserBid?.debtToken?.denom]?.decimals),
                        },
                    },
                },
                fee: defaultFee(),
            },
            address,
            (error, result) => {
                // setInProgress(false);
                if (error) {
                    message.error(error);
                    return;
                }

                if (result?.code) {
                    message.info(result?.rawLog);
                    return;
                }
                message.success(
                    <Snack
                        message={variables[lang].tx_success}
                        hash={result?.transactionHash}
                    />
                );
                // resetValues();
                dispatch({
                    type: "BALANCE_REFRESH_SET",
                    value: refreshBalance + 1,
                });
            }
        );
    };
    console.log(selectedUserBid, "selectedUserBid");
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
                                    loading={loading}
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
                                    min={0}
                                    max={Number(userBid)}
                                    value={Number(sliderValue)}
                                    // max={100}
                                    // value={100}
                                    tooltip={{ open: false }}
                                    className='comdex-slider auction_withdraw_slider'
                                    onChange={handleSliderChange}
                                />
                            </div>
                            <div className="bid_input_container">
                                <div className="input_box">
                                    <Input className='input_with_no_border'
                                        // value={userBid}
                                        value={sliderValue}
                                        type='number'
                                        placeholder='0.00'
                                        onChange={(e) => setSliderValue(e.target.value)}
                                        suffix={`${denomConversion(selectedUserBid?.debtToken?.denom) || " "}`}
                                    />
                                </div>
                                {/* <div className="denom_box">CMST</div> */}
                            </div>
                            <div className="note_container">
                                NOTE: withdrawal of a successful bid will include a 0.5% fee. All fees are paid to CMST stakers.
                            </div>
                            <div className="withdraw_btn_container">
                                <Button type='primary' className='btn-filled' onClick={handleWithdraweOk}>Withdraw</Button>
                            </div>
                        </div>
                    </div>
                </Modal>


            </div>
        </>
    )
}

UserBidTable.propTypes = {
    lang: PropTypes.string.isRequired,
    assetMap: PropTypes.object,
    address: PropTypes.string.isRequired,
    refreshBalance: PropTypes.number.isRequired,
};

const stateToProps = (state) => {
    return {
        lang: state.language,
        address: state.account.address,
        refreshBalance: state.account.refreshBalance,
    };
};

const actionsToProps = {
    setFilteredMarketBidData
};

export default connect(stateToProps, actionsToProps)(UserBidTable);
// export default UserBidTable