import React from 'react'
import * as PropTypes from "prop-types";
import TooltipIcon from '../../../../components/TooltipIcon';
import { commaSeparator, decimalConversion, marketPrice } from '../../../../utils/number';
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

const AuctionMarket = ({
    address,
    refreshBalance,
    assetMap,
    auctions,
    markets
}) => {
    const router = useRouter()

    const columns = [
        {
            title: (
                <>
                    Auctioned Asset <TooltipIcon text="Asset to be sold in the auction" />
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
                    Pool Size<TooltipIcon text="Auction closing time" />
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
        {
            title: (
                <>
                    Health <TooltipIcon text="Current price of auction asset" />
                </>
            ),
            dataIndex: "health",
            key: "health",
        },
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
        auctions && auctions?.auctions?.length > 0
            ? auctions?.auctions?.map((item, index) => {
                return {
                    key: index,
                    id: item.id,
                    auctioned_asset: (
                        <>
                            <div className="assets-withicon">
                                <div className="assets-icon">
                                    <SvgIcon
                                        name={iconNameFromDenom(
                                            item?.outflowTokenInitAmount?.denom
                                        )}
                                    />
                                </div>
                                {denomConversion(item?.outflowTokenInitAmount?.denom)}
                            </div>
                        </>
                    ),
                    bridge_asset: (
                        <>
                            <div className="assets-withicon ">
                                <div className="assets-icon">
                                    <SvgIcon
                                        name={iconNameFromDenom(
                                            item?.inflowTokenCurrentAmount?.denom
                                        )}
                                    />
                                </div>
                                {denomConversion(item?.inflowTokenCurrentAmount?.denom)}
                            </div>
                        </>
                    ),
                    pool_size: "40.50k",
                    max_discount: "30%",
                    health: "$140.50",
                    your_bid: "0.00",
                    action: item,
                };
            })
            : [];

    const handelClickAuctionMarketTable = (record, index) => {
        console.log(record, index);
        router.push('/auctions/1')
    }

    return (
        <>
            <div className="app-content-wrapper">
                <Row>
                    <Col>
                        <div className={auctions?.auctions?.length > 0 ? "composite-card py-3" : "composite-card py-3 height-16"}>
                            <div className="card-content">
                                <Table
                                    className="custom-table liquidation-table"
                                    dataSource={tableData}
                                    columns={columns}
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
    auctions: PropTypes.string.isRequired,
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
        auctions: state.auction.auctions,
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