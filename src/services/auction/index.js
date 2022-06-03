import { QueryClientImpl } from "comdex-codec/build/comdex/auction/v1beta1/query";
import Long from "long";
import { createQueryClient } from "../helper";
import {PRODUCT_ID} from "../../constants/common";

export const queryDutchAuctionList = (
  offset,
  limit,
  countTotal,
  reverse,
  callback
) => {
  createQueryClient((error, rpcClient) => {
    if (error) {
      callback(error);
      return;
    }

    new QueryClientImpl(rpcClient)
      .QueryDutchAuctions({
        appId: Long.fromNumber(PRODUCT_ID),
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

export const queryDutchBiddingList = (bidder, callback) => {
  createQueryClient((error, rpcClient) => {
    if (error) {
      callback(error);
      return;
    }

    new QueryClientImpl(rpcClient)
      .QueryDutchBiddings({
        bidder,
        appId: Long.fromNumber(PRODUCT_ID),
        history: false,
      })
      .then((result) => {
        callback(null, result);
      })
      .catch((error) => {
        callback(error?.message);
      });
  });
};

export const queryAuctionParams = (callback) => {
  createQueryClient((error, rpcClient) => {
    if (error) {
      callback(error);
      return;
    }

    new QueryClientImpl(rpcClient)
      .QueryParams()
      .then((result) => {
        callback(null, result);
      })
      .catch((error) => callback(error?.message));
  });
};

export const queryDebtAuctionList = (
  offset,
  limit,
  countTotal,
  reverse,
  callback
) => {
  createQueryClient((error, rpcClient) => {
    if (error) {
      callback(error);
      return;
    }

    new QueryClientImpl(rpcClient)
      .QueryDebtAuctions({
        appId: Long.fromNumber(PRODUCT_ID),
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

export const queryDebtBiddingList = (bidder, callback) => {
  createQueryClient((error, rpcClient) => {
    if (error) {
      callback(error);
      return;
    }

    new QueryClientImpl(rpcClient)
      .QueryDebtBiddings({
        bidder,
        appId: Long.fromNumber(PRODUCT_ID),
        history: false,
      })
      .then((result) => {
        callback(null, result);
      })
      .catch((error) => {
        callback(error?.message);
      });
  });
};

export const querySurplusAuctionList = (
  offset,
  limit,
  countTotal,
  reverse,
  callback
) => {
  createQueryClient((error, rpcClient) => {
    if (error) {
      callback(error);
      return;
    }

    new QueryClientImpl(rpcClient)
      .QuerySurplusAuctions({
        appId: Long.fromNumber(PRODUCT_ID),
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

export const querySurplusBiddingList = (bidder, callback) => {
  createQueryClient((error, rpcClient) => {
    if (error) {
      callback(error);
      return;
    }

    new QueryClientImpl(rpcClient)
      .QuerySurplusBiddings({
        bidder,
        appId: Long.fromNumber(PRODUCT_ID),
        history: false,
      })
      .then((result) => {
        callback(null, result);
      })
      .catch((error) => {
        callback(error?.message);
      });
  });
};
