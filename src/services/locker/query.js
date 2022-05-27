import Long from "long";
import { createQueryClient } from "../helper";
import { QueryServiceClientImpl } from 'comdex-codec/build/comdex//locker/v1beta1/querier'

export const queryLockerWhiteListedAssetByProduct = (callback) => {
    createQueryClient((error, rpcClient) => {
        if (error) {
            callback(error);
            return;
        }
        new QueryServiceClientImpl(rpcClient)
            .QueryWhiteListedAssetByAllProduct().then((result) => {
                callback(null, result);
            })
            .catch((error) => {
                console.log(error);
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
        new QueryServiceClientImpl(rpcClient)
            .QueryWhiteListedAssetIDsByProductID({
                productId: Long.fromNumber(productId)
            }).then((result) => {
                callback(null, result);
            })
            .catch((error) => {
                console.log(error);
                callback(error?.message);
            });
    });
};
export const queryUserLockerByProductAssetId = (productId, assetId, owner, callback) => {
    createQueryClient((error, rpcClient) => {
        if (error) {
            callback(error);
            return;
        }
        new QueryServiceClientImpl(rpcClient)
            .QueryOwnerLockerByProductToAssetID({
                productId: Long.fromNumber(productId),
                assetId: Long.fromNumber(assetId),
                owner: owner
            }).then((result) => {
                callback(null, result);
            })
            .catch((error) => {
                console.log(error);
                callback(error?.message);
            });
    });
};
export const queryUserLockedValueInLocker = (productId, assetId, owner, callback) => {
    createQueryClient((error, rpcClient) => {
        if (error) {
            callback(error);
            return;
        }
        new QueryServiceClientImpl(rpcClient)
            .QueryOwnerLockerByProductToAssetID({
                productId: Long.fromNumber(productId),
                assetId: Long.fromNumber(assetId),
                owner: owner
            }).then((result) => {
                callback(null, result);
            })
            .catch((error) => {
                console.log(error);
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
        new QueryServiceClientImpl(rpcClient)
            .QueryLockerLookupTableByApp({
                appId: Long.fromNumber(productId),
            }).then((result) => {
                callback(null, result);
            })
            .catch((error) => {
                console.log(error);
                callback(error?.message);
            })
    });
};