import React, { useEffect, useRef, useState } from 'react'
import * as PropTypes from "prop-types";
import TooltipIcon from '../../../../components/TooltipIcon';
import { commaSeparator, decimalConversion, formatNumber, marketPrice } from '../../../../utils/number';
import { amountConversion, amountConversionWithComma, denomConversion } from '../../../../utils/coin';
import { DOLLAR_DECIMALS } from '../../../../constants/common';
import { Col, Row, SvgIcon } from '../../../../components/common';
import { iconNameFromDenom } from '../../../../utils/string';
import Timer from '../../../../components/Timer';
import { connect } from 'react-redux';
import { comdex } from '../../../../config/network';
import NoDataIcon from '../../../../components/common/NoDataIcon';
import { Table } from 'antd';
import { useRouter } from 'next/router';
import { queryUserLimitBidsByAssetID } from '@/services/auctionV2/query';
import { NextImage } from '@/components/image/NextImage';

const AuctionMarket = ({
    marketInProgress,
    address,
    refreshBalance,
    assetMap,
    limitBidOrderList,
    markets,
    marketAuctionPageSize,
    marketAuctionPageNumber,
    iconList
}) => {
    const router = useRouter()


    const columns = [
        {
            title: (
                <>
                    Auction Asset <TooltipIcon text="Asset to be sold in the auction" />
                </>
            ),
            dataIndex: "auctioned_asset",
            key: "auctioned_asset",
            width: 220,
        },
        {
            title: (
                <>
                    Bid Asset{" "}
                    <TooltipIcon text="Asset used to buy the auctioned asset" />
                </>
            ),
            dataIndex: "bridge_asset",
            key: "bridge_asset",
            // width: 180,
        },
        {
            title: (
                <>
                    Bid Value<TooltipIcon text="Auction closing time" />
                </>
            ),
            dataIndex: "pool_size",
            key: "pool_size",
        },
        {
            title: (
                <>
                    Max Discount
                </>
            ),
            dataIndex: "max_discount",
            key: "max_discount",
            width: 180,
        },
        // {
        //     title: (
        //         <>
        //             Health <TooltipIcon text="Current price of auction asset" />
        //         </>
        //     ),
        //     dataIndex: "health",
        //     key: "health",
        // },
        {
            title: (
                <>
                    Your Bid <TooltipIcon text="" />
                </>
            ),
            dataIndex: "your_bid",
            key: "your_bid",
            align: "center",
            // width: 120,
        },
    ];


    const tableData =
        limitBidOrderList && limitBidOrderList?.length > 0
            ? limitBidOrderList?.map((item, index) => {
                return {
                    key: index,
                    id: item.id,
                    auctioned_asset: (
                        <>
                            <div className="assets-withicon">
                                <div className="assets-icon">
                                    <NextImage src={iconList?.[item?.collateralAssetDenom]?.coinImageUrl} height={30} width={30} alt="@icon" />
                                </div>
                                {denomConversion(item?.collateralAssetDenom)}
                            </div>
                        </>
                    ),
                    bridge_asset: (
                        <>
                            <div className="assets-withicon ">
                                <div className="assets-icon">
                                    <NextImage src={iconList?.[item?.debtAssetDenom]?.coinImageUrl} height={30} width={30} alt="@icon" />
                                </div>
                                {denomConversion(item?.debtAssetDenom)}
                            </div>
                        </>
                    ),
                    pool_size: commaSeparator(formatNumber(amountConversion(item?.bidValue || 0, DOLLAR_DECIMALS, assetMap[item?.debtAssetDenom]?.decimals))),
                    max_discount: `${decimalConversion(item?.maxDiscount)}%`,
                    // health: "$140.50", 
                    // your_bid: getTotalUserBid(item?.collateralAssetId.toNumber(), item?.debtAssetId.toNumber(), item?.collateralAssetDenom) || "0.00",
                    your_bid: commaSeparator(formatNumber(amountConversion(item?.userBidValue || 0, DOLLAR_DECIMALS, assetMap[item?.debtAssetDenom]?.decimals))),
                    action: item,
                };
            })
            : [];

    const handelClickAuctionMarketTable = (record, index) => {
        console.log(record, index);
        router.push(`/limitBid?id=${record?.action?.collateralAssetId?.toNumber()}&id=${record?.action?.debtAssetId?.toNumber()}`)
    }

    return (
        <>
            <div className="app-content-wrapper">
                <Row>
                    <Col>
                        <div className={limitBidOrderList?.limitBidOrderList?.length > 0 ? "composite-card py-3" : "composite-card py-3 height-16"}>
                            <div className="card-content">
                                <Table
                                    className="custom-table liquidation-table"
                                    dataSource={tableData}
                                    columns={columns}
                                    loading={marketInProgress}
                                    onRow={(record, rowIndex) => {
                                        return {
                                            onClick: () => handelClickAuctionMarketTable(record, rowIndex),
                                        };
                                    }}
                                    // loading={inProgress || updateBtnLoading}
                                    rowClassName={() => 'custom-table-with-hover'}
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

AuctionMarket.propTypes = {
    lang: PropTypes.string.isRequired,
    setPairs: PropTypes.func.isRequired,
    address: PropTypes.string,
    limitBidOrderList: PropTypes.string.isRequired,
    assetMap: PropTypes.object,
    refreshBalance: PropTypes.number.isRequired,
    auctionsPageSize: PropTypes.number.isRequired,
    auctionsPageNumber: PropTypes.number.isRequired,
    markets: PropTypes.object,
};

const stateToProps = (state) => {
    return {
        lang: state.language,
        address: state.account.address,
        auctionsPageSize: state.auction.auctionsPageSize,
        auctionsPageNumber: state.auction.auctionsPageNumber,
        assetMap: state.asset.map,
        refreshBalance: state.account.refreshBalance,
        markets: state.oracle.market,
    };
};

const actionsToProps = {

};

export default connect(stateToProps, actionsToProps)(AuctionMarket);

// export default AuctionMarket