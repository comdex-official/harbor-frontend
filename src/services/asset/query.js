import { QueryServiceClientImpl } from "comdex-codec/build/comdex/asset/v1beta1/querier";
import Long from "long";
import { createQueryClient } from "../helper";

export const queryPairs = (offset, limit, countTotal, reverse, callback) => {
  createQueryClient((error, rpcClient) => {
    if (error) {
      callback(error);
      return;
    }

    new QueryServiceClientImpl(rpcClient)
      .QueryPairs({
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

export const queryAssets = (offset, limit, countTotal, reverse, callback) => {
  createQueryClient((error, rpcClient) => {
    if (error) {
      callback(error);
      return;
    }
    new QueryServiceClientImpl(rpcClient)
      .QueryAssets({
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
        console.log(error);
        callback(error?.message);
      });
  });
};

export const queryPair = (pairId, callback) => {
  createQueryClient((error, rpcClient) => {
    if (error) {
      callback(error);
      return;
    }

    new QueryServiceClientImpl(rpcClient)
      .QueryPair({
        id: Long.fromNumber(pairId),
      })
      .then((result) => {
        callback(null, result);
      })
      .catch((error) => {
        callback(error?.message);
      });
  });
};

export const queryPairVault = (pairId, callback) => {
  createQueryClient((error, rpcClient) => {
    if (error) {
      callback(error);
      return;
    }

    new QueryServiceClientImpl(rpcClient)
      .QueryPairVault({
        id: Long.fromNumber(pairId),
      })
      .then((result) => {
        callback(null, result);
      })
      .catch((error) => {
        callback(error?.message);
      });
  });
};

export const queryPairVaults = (callback) => {
  createQueryClient((error, rpcClient) => {
    if (error) {
      callback(error);
      return;
    }

    new QueryServiceClientImpl(rpcClient)
      .QueryProductToExtendedPair({
        productId: Long.fromNumber(1),
      })
      .then((result) => {
        console.log('the data', result);
        callback(null, result);
      })
      .catch((error) => {
        callback(error?.message);
      });
  });
};
