import Long from "long";
import { createQueryClient } from "../helper";
import { QueryClientImpl } from 'comdex-codec/build/comdex//locker/v1beta1/query'

export const queryLockerWhiteListedAssetByProduct = (callback) => {
    createQueryClient((error, rpcClient) => {
        if (error) {
            callback(error);
            return;
        }
        new QueryClientImpl(rpcClient)
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
        new QueryClientImpl(rpcClient)
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
        new QueryClientImpl(rpcClient)
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
        new QueryClientImpl(rpcClient)
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
        new QueryClientImpl(rpcClient)
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