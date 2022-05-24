import Long from "long";
import { createQueryClient } from "../helper";
import { QueryServiceClientImpl } from 'comdex-codec/build/comdex/vault/v1beta1/querier'


export const queryExtendedPairVault = (productId, callback) => {
    createQueryClient((error, rpcClient) => {
        if (error) {
            callback(error);
            return;
        }
        new QueryServiceClientImpl(rpcClient)
            .QueryExtendedPairIDByProduct({
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


export const queryVaultByOwner = (
    owner,
    callback
) => {
    createQueryClient((error, rpcClient) => {
        if (error) {
            callback(error);
            return;
        }
        new QueryServiceClientImpl(rpcClient)
            .QueryAllVaultByOwner({
                owner: owner
            })
            .then((result) => {
                callback(null, result);
            })
            .catch((error) => {
                callback(error?.message);
            });
    });
};

export const queryVaults = (id, callback) => {
    createQueryClient((error, rpcClient) => {
        if (error) {
            callback(error)
        }
        new QueryServiceClientImpl(rpcClient)
        .QueryVault({
            id: id
        }).then((result) => {
            callback(null, result);
        })
            .catch((error) => {
                callback(error?.message);
            });
    })
}


