import { QueryClientImpl } from "comdex-codec/build/comdex/auctionsV2/v1beta1/query";
import { createQueryClient } from "../helper";
import Long from "long";
import { comdex } from "../../config/network";
import axios from "axios";

let myClient = null;


export const getQueryService = (callback) => {
    if (myClient) {
        const queryService = new QueryClientImpl(myClient);

        return callback(null, queryService);
    } else {
        createQueryClient((error, client) => {
            if (error) {
                return callback(error);
            }
            myClient = client;
            const queryService = new QueryClientImpl(client);

            return callback(null, queryService);
        });
    }
};


export const queryDutchAuctionsList = (
    auctionType,
    offset,
    limit,
    countTotal,
    reverse,
    callback
) => {
    getQueryService((error, queryService) => {
        if (error) {
            callback(error);
            return;
        }
        queryService
            .Auctions({
                auctionType: Long.fromNumber(auctionType),
                pagination: {
                    key: "",
                    offset: Long.fromNumber(offset),
                    limit: Long.fromNumber(limit),
                    countTotal: countTotal,
                    reverse: reverse,
                },
            })
            .then((result) => {

                callback(null, result);
            })
            .catch((error) => {
                callback(error?.message);
            });
    });
};


export const querySingleDutchAuctionsList = (
    auctionId,
    callback
) => {
    getQueryService((error, queryService) => {
        if (error) {
            callback(error);
            return;
        }
        queryService
            .Auction({
                auctionId: auctionId
            })
            .then((result) => {

                callback(null, result);
            })
            .catch((error) => {
                callback(error?.message);
            });
    });
};

export const queryMarketAuctionsList = (
    offset,
    limit,
    countTotal,
    reverse,
    callback
) => {
    getQueryService((error, queryService) => {
        if (error) {
            callback(error);
            return;
        }
        queryService
            .LimitBidProtocolData({
                pagination: {
                    key: "",
                    offset: Long.fromNumber(offset),
                    limit: Long.fromNumber(limit),
                    countTotal: countTotal,
                    reverse: reverse,
                },
            })
            .then((result) => {

                callback(null, result);
            })
            .catch((error) => {
                callback(error?.message);
            });
    });
};

export const queryLimitBidProtocolDataWithUser = (
    address,
    offset,
    limit,
    countTotal,
    reverse,
    callback
) => {
    getQueryService((error, queryService) => {
        if (error) {
            callback(error);
            return;
        }
        queryService
            .LimitBidProtocolDataWithUser({
                bidder: address,
                pagination: {
                    key: "",
                    offset: Long.fromNumber(offset),
                    limit: Long.fromNumber(limit),
                    countTotal: countTotal,
                    reverse: reverse,
                },
            })
            .then((result) => {
                callback(null, result);
            })
            .catch((error) => {
                callback(error?.message);
            });
    });
};

export const queryUserLimitBidsByAssetID = (
    address,
    collateralTokenId,
    debtTokenId,
    offset,
    limit,
    countTotal,
    reverse,
    callback
) => {
    getQueryService((error, queryService) => {
        if (error) {
            callback(error);
            return;
        }
        queryService
            .UserLimitBidsByAssetID({
                bidder: address,
                collateralTokenId: Long.fromNumber(collateralTokenId),
                debtTokenId: Long.fromNumber(debtTokenId),
                pagination: {
                    key: "",
                    offset: Long.fromNumber(offset),
                    limit: Long.fromNumber(limit),
                    countTotal: countTotal,
                    reverse: reverse,
                },
            })
            .then((result) => {

                callback(null, result);
            })
            .catch((error) => {
                callback(error?.message);
            });
    });
};


export const queryDutchBiddingList = (
    biddingType,
    bidder,
    offset,
    limit,
    countTotal,
    reverse,
    history,
    callback) => {
    getQueryService((error, queryService) => {
        if (error) {
            callback(error);
            return;
        }

        queryService
            .BidsFilter({
                // .Bids({
                bidder,
                bidType: Long.fromNumber(biddingType),
                history: history,
                pagination: {
                    key: "",
                    offset: Long.fromNumber(offset),
                    limit: Long.fromNumber(limit),
                    countTotal: countTotal,
                    reverse: reverse,
                },
            })
            .then((result) => {
                callback(null, result);
            })
            .catch((error) => {
                callback(error?.message);
            });
    });
};

export const fetchUserBiddingList = (address,bidType,history,callback) => {
    axios
        .get(`${comdex?.rest}/comdex/auctions/v2/bids_filter/${address}/${bidType}/${history}`)
        .then((result) => {
            callback(null, result?.data);
        })
        .catch((error) => {
            callback(error?.message);
        });
};
