import { QueryClientImpl } from "comdex-codec/build/comdex/asset/v1beta1/query";
import Long from "long";
import { createQueryClient } from "../helper";

export const queryPairs = (offset, limit, countTotal, reverse, callback) => {
  createQueryClient((error, rpcClient) => {
    if (error) {
      callback(error);
      return;
    }

    new QueryClientImpl(rpcClient)
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
    new QueryClientImpl(rpcClient)
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

    new QueryClientImpl(rpcClient)
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

export const queryExtendedPairVaultById = (productId, callback) => {
  createQueryClient((error, rpcClient) => {
    if (error) {
      callback(error);
      return;
    }
    new QueryClientImpl(rpcClient)
      .QueryProductToExtendedPair({
        productId: Long.fromNumber(productId),
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

    new QueryClientImpl(rpcClient)
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

    new QueryClientImpl(rpcClient)
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

export const queryAsset = (id, callback) => {
  createQueryClient((error, rpcClient) => {
    if (error) {
      callback(error);
      return;
    }

    new QueryClientImpl(rpcClient)
        .QueryAsset({
          id: Long.fromNumber(id),
        })
        .then((result) => {
          callback(null, result);
        })
        .catch((error) => {
          callback(error?.message);
        });
  });
};