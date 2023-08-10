import { Table, Button, message } from "antd";
import { Col, Row, SvgIcon } from "../../../components/common";
import { iconNameFromDenom } from "../../../utils/string";
import { denomConversion, amountConversionWithComma } from "../../../utils/coin";
import TooltipIcon from "../../../components/TooltipIcon";
import moment from "moment";
import { comdex } from "../../../config/network";
// import { queryDutchBiddingList } from "../../../services/auction";
import { useEffect, useState } from "react";
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE, ENGLISH_AUCTION_BIDDING_TYPE, HALF_DEFAULT_PAGE_SIZE } from "../../../constants/common";
import NoDataIcon from "../../../components/common/NoDataIcon";
import { fetchUserBiddingList, queryDutchBiddingList } from "../../../services/auctionV2/query";
import { NextImage } from "../../../components/image/NextImage";

export const InActiveBidding = ({ address, refreshBalance, assetMap, iconList }) => {

    const [pageNumber, setPageNumber] = useState(DEFAULT_PAGE_NUMBER);
    const [pageSize, setPageSize] = useState(HALF_DEFAULT_PAGE_SIZE);
    const [inProgress, setInProgress] = useState(false);
    const [biddingList, setBiddingList] = useState("");
    const [biddingsTotalCount, setBiddingsTotalCounts] = useState(0);



    const userBidList = (address, bidType, history) => {
        setInProgress(true);
        fetchUserBiddingList(address, bidType, history, (error, result) => {
            if (error) {
                setInProgress(false);
                console.log(error, "Auction Bids Api Error");
                message.error(error);
            }
            setInProgress(false);
            console.log(result, "Bids User");
            if (result?.bids?.length > 0) {
                let reverseData = result && result.bids;
                setBiddingList(reverseData);
                setBiddingsTotalCounts(result?.pagination?.total);
            } else {
                setBiddingList("");
            }

        })
    }




    useEffect(() => {
        if (address) {
            // fetchBiddings(DUTCH_AUCTION_BIDDING_TYPE, address, (pageNumber - 1) * pageSize, pageSize, true, true, true);
            userBidList(address, ENGLISH_AUCTION_BIDDING_TYPE, true)
        }
    }, [address, refreshBalance])

    const handleChange = (value) => {
        setPageNumber(value.current);
        setPageSize(value.pageSize);
        fetchBiddings(address,
            (value.current - 1) * value.pageSize,
            value.pageSize,
            true,
            true,
            true
        );
    };

    const auctionStatusConverter = (status) => {
        if (status === "success") {
            return "Completed"
        } else {
            return status;
        }
    }


    const columnsBidding = [
        {
            title: (
                <>
                    Collateral <TooltipIcon text="Asset to be sold in the auction" />
                </>
            ),
            dataIndex: "inflowToken",
            key: "inflowToken",
        },
        {
            title: (
                <>
                    Bid Denom{" "}
                    <TooltipIcon text="Asset used to buy the auctioned asset" />
                </>
            ),
            dataIndex: "outflowToken",
            key: "outflowToken",
        },
        {
            title: <>
                Timestamp <TooltipIcon text="Placed bid time" />
            </>,
            dataIndex: "timestamp",
            key: "timestamp",
            render: (end_time) => <div className="endtime-badge">{end_time}</div>,
        },
        {
            title: (
                <>
                    Your Bid <TooltipIcon text="Status of auction" />
                </>
            ),
            dataIndex: "auctionStatus",
            key: "auctionStatus",
        },
        {
            title: (
                <>
                    Bidding Status <TooltipIcon text="Bidding status of auction" />
                </>
            ),
            dataIndex: "action",
            key: "action",
            align: "right",
        },
    ];

    const tableBiddingData =
        biddingList &&
        biddingList.length > 0 &&
        biddingList.map((item, index) => {
            return {
                key: index,
                outflowToken: (
                    <>
                        <div className="assets-withicon">
                            <div className="assets-icon">
                                {/* <SvgIcon
                                    name={iconNameFromDenom(item?.outflowTokenAmount?.denom)}
                                /> */}
                                <NextImage src={iconList?.[item?.debt_token_amount?.denom]?.coinImageUrl} height={30} width={30} alt="@icon" />
                            </div>
                            {/* {amountConversionWithComma(item?.debt_token_amount?.amount || 0, comdex?.coinDecimals, assetMap[item?.debt_token_amount?.denom]?.decimals)}{" "} */}
                            {denomConversion(item?.debt_token_amount?.denom)}
                        </div>
                    </>
                ),
                inflowToken: (
                    <>
                        <div className="assets-withicon">
                            <div className="assets-icon">
                                <NextImage src={iconList?.[item?.collateral_token_amount?.denom]?.coinImageUrl} height={30} width={30} alt="@icon" />
                            </div>
                            {amountConversionWithComma(item?.collateral_token_amount?.amount || 0, comdex?.coinDecimals, assetMap[item?.collateral_token_amount?.denom]?.decimals)}{" "}
                            {denomConversion(item?.collateral_token_amount?.denom)}
                        </div>
                    </>
                ),
                timestamp: moment(item?.biddingTimestamp).format("MMM DD, YYYY HH:mm"),
                auctionStatus: (
                    <div>
                        {/* {amountConversionWithComma(item?.inflowTokenAmount?.amount || 0, comdex?.coinDecimals, assetMap[item?.inflowTokenAmount?.denom]?.decimals)}{" "}
                        {denomConversion(item?.inflowTokenAmount?.denom)} */}
                        {amountConversionWithComma(item?.debt_token_amount?.amount || 0, comdex?.coinDecimals, assetMap[item?.debt_token_amount?.denom]?.decimals)}{" "}

                    </div>
                ),
                action: (
                    <div className="bidding_status_container">
                        <SvgIcon name="success-icon" />
                        <span>
                            {auctionStatusConverter("success")}
                        </span>
                    </div>
                ),
            };
        });

    return (
        // <Table
        //     className="custom-table liquidation-table"
        //     dataSource={tableBiddingData}
        //     columns={columnsBidding}
        //     onChange={(event) => handleChange(event)}
        //     pagination={{
        //         total:
        //             biddingsTotalCount &&
        //             biddingsTotalCount,
        //         pageSize,
        //     }}
        //     loading={inProgress}
        //     scroll={{ x: "100%" }}
        //     locale={{ emptyText: <NoDataIcon /> }}
        // />
        <div className="app-content-wrapper">
            <Row>
                <Col>
                    <div className={biddingList?.biddingList?.length > 0 ? "composite-card py-3" : "composite-card py-3 height-16"}>
                        <div className="card-content">
                            <Table
                                className="custom-table liquidation-table"
                                dataSource={tableBiddingData}
                                columns={columnsBidding}
                                onChange={(event) => handleChange(event)}
                                pagination={{
                                    total:
                                        biddingsTotalCount &&
                                        biddingsTotalCount,
                                    pageSize,
                                }}
                                loading={inProgress}
                                scroll={{ x: "100%" }}
                                locale={{ emptyText: <NoDataIcon /> }}
                            />
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default InActiveBidding;
