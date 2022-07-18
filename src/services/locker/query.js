import Long from "long";
import { createQueryClient } from "../helper";
import { QueryClientImpl } from "comdex-codec/build/comdex//locker/v1beta1/query";
import { PRODUCT_ID } from "../../constants/common";

export const queryLockerWhiteListedAssetByProduct = (callback) => {
  createQueryClient((error, rpcClient) => {
    if (error) {
      callback(error);
      return;
    }
    new QueryClientImpl(rpcClient)
      .QueryWhiteListedAssetByAllProduct()
      .then((result) => {
        callback(null, result);
      })
      .catch((error) => {
        callback(error?.message);
      });
  });
};
export const queryLockerWhiteListedAssetByProductId = (productId, callback) => {
  createQueryClient((error, rpcClient) => {
    if (error) {
      callback(error);
      return;
    }
    new QueryClientImpl(rpcClient)
      .QueryWhiteListedAssetIDsByAppID({
        appId: Long.fromNumber(productId),
      })
      .then((result) => {
        callback(null, result);
      })
      .catch((error) => {
        callback(error?.message);
      });
  });
};
export const queryUserLockerByProductAssetId = (
  productId,
  assetId,
  owner,
  callback
) => {
  createQueryClient((error, rpcClient) => {
    if (error) {
      callback(error);
      return;
    }
    new QueryClientImpl(rpcClient)
      .QueryOwnerLockerByAppToAssetIDbyOwner({
        appId: Long.fromNumber(productId),
        assetId: Long.fromNumber(assetId),
        owner: owner,
      })
      .then((result) => {
        callback(null, result);
      })
      .catch((error) => {
        callback(error?.message);
      });
  });
};
export const queryUserLockedValueInLocker = (
  productId,
  assetId,
  owner,
  callback
) => {
  createQueryClient((error, rpcClient) => {
    if (error) {
      callback(error);
      return;
    }
    new QueryClientImpl(rpcClient)
      .QueryOwnerLockerByAppToAssetIDbyOwner({
        appId: Long.fromNumber(productId),
        assetId: Long.fromNumber(assetId),
        owner: owner,
      })
      .then((result) => {
        callback(null, result);
      })
      .catch((error) => {
        callback(error?.message);
      });
  });
};

export const queryLockerLookupTableByApp = (productId, callback) => {
  createQueryClient((error, rpcClient) => {
    if (error) {
      callback(error);
      return;
    }
    new QueryClientImpl(rpcClient)
      .QueryLockerLookupTableByApp({
        appId: Long.fromNumber(productId),
      })
      .then((result) => {
        callback(null, result);
      })
      .catch((error) => {
        callback(error?.message);
      });
  });
};

export const queryUserLockerHistory = (
  assetId,
  productId,
  owner,
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
      .QueryOwnerTxDetailsLockerOfAppByOwnerByAsset({
        appId: Long.fromNumber(productId),
        assetId: Long.fromNumber(assetId),
        owner: owner,
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

export const queryUserLockerStats = (
  owner,
  callback
) => {
  createQueryClient((error, rpcClient) => {
    if (error) {
      callback(error);
      return;
    }
    new QueryClientImpl(rpcClient)
      .QueryLockerByAppByOwner({
        appId: Long.fromNumber(PRODUCT_ID),
        owner: owner,
      })
      .then((result) => {
        callback(null, result);
      })
      .catch((error) => {
        callback(error?.message);
      });
  });
};
