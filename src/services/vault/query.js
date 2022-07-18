import Long from "long";
import { createQueryClient } from "../helper";
import { QueryClientImpl } from 'comdex-codec/build/comdex/vault/v1beta1/query'
import { PRODUCT_ID } from "../../constants/common";


export const queryTotalTokenMinted = (productId, callback) => {
    createQueryClient((error, rpcClient) => {
        if (error) {
            callback(error);
            return;
        }
        new QueryClientImpl(rpcClient)
            .QueryTokenMintedAssetWiseByApp({
                appId: Long.fromNumber(productId)
            }).then((result) => {
                callback(null, result);
            })
            .catch((error) => {
                callback(error?.message);
            });
    });
};
export const queryExtendedPairVault = (productId, callback) => {
    createQueryClient((error, rpcClient) => {
        if (error) {
            callback(error);
            return;
        }
        new QueryClientImpl(rpcClient)
            .QueryExtendedPairIDsByApp({
                appId: Long.fromNumber(productId)
            }).then((result) => {
                callback(null, result);
            })
            .catch((error) => {
                callback(error?.message);
            });
    });
};


export const queryVaultByProductId = (
    product,
    callback
) => {
    createQueryClient((error, rpcClient) => {
        if (error) {
            callback(error);
            return;
        }
        new QueryClientImpl(rpcClient)
            .QueryAllVaultsByApp({
                appId: Long.fromNumber(product)
            })
            .then((result) => {
                callback(null, result);
            })
            .catch((error) => {
                callback(error?.message);
            });
    });
};

export const queryUserVaults = (
    owner,
    callback
) => {
    createQueryClient((error, rpcClient) => {
        if (error) {
            callback(error);
            return;
        }
        new QueryClientImpl(rpcClient)
            .QueryVaultInfoOfOwnerByApp({
                appId: Long.fromNumber(PRODUCT_ID),
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
        new QueryClientImpl(rpcClient)
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
export const queryOwnerVaults = (productId, address, extentedPairId, callback) => {
    createQueryClient((error, rpcClient) => {
        if (error) {
            callback(error)
        }
        new QueryClientImpl(rpcClient)
            .QueryVaultIDOfOwnerByExtendedPairAndApp({
                appId: Long.fromNumber(productId),
                owner: address,
                extendedPairId: Long.fromNumber(extentedPairId),
            }).then((result) => {
                callback(null, result);
            })
            .catch((error) => {
                callback(error?.message);
                // callback("Vault does't exist");
            });
    })
}
export const queryOwnerVaultsInfo = (ownerVaultId, callback) => {
    createQueryClient((error, rpcClient) => {
        if (error) {
            callback(error)
        }
        new QueryClientImpl(rpcClient)
            .QueryVault({
                id: ownerVaultId,
            }).then((result) => {
                callback(null, result);
            })
            .catch((error) => {
                callback(error?.message);

            });
    })
}
export const queryAllVaultByProduct = (productId, callback) => {
    createQueryClient((error, rpcClient) => {
        if (error) {
            callback(error)
        }
        new QueryClientImpl(rpcClient)
            .QueryVaultIdsByAppInAllExtendedPairs({
                appId: Long.fromNumber(productId),
            }).then((result) => {
                callback(null, result);
            })
            .catch((error) => {
                callback(error?.message);

            });
    })
}
export const queryMintedTokenSpecificVaultType = (productId, extendedPairId, callback) => {
    createQueryClient((error, rpcClient) => {
        if (error) {
            callback(error)
        }
        new QueryClientImpl(rpcClient)
            .QueryTokenMintedByAppAndExtendedPair({
                appId: Long.fromNumber(productId),
                extendedPairId: Long.fromNumber(extendedPairId),
            }).then((result) => {
                callback(null, result);
            })
            .catch((error) => {
                callback(error?.message);

            });
    })
}

export const queryAppTVL = (appId, callback) => {
    createQueryClient((error, rpcClient) => {
        if (error) {
            callback(error);
            return;
        }

        new QueryClientImpl(rpcClient)
            .QueryTVLByAppOfAllExtendedPairs({
                appId: Long.fromNumber(appId),
            }).then((result) => {
                callback(null, result);
            })
            .catch((error) => {
                callback(error?.message);
            });
    });
};

export const queryUserVaultsStats = (
    owner,
    callback
) => {
    createQueryClient((error, rpcClient) => {
        if (error) {
            callback(error);
            return;
        }
        new QueryClientImpl(rpcClient)
            .QueryUserMyPositionByApp({
                owner: owner,
                appId: Long.fromNumber(PRODUCT_ID)
            })
            .then((result) => {
                callback(null, result);
            })
            .catch((error) => {
                callback(error?.message);
            });
    });
};
export const queryUserVaultsInfo = (
    id,
    callback
) => {
    createQueryClient((error, rpcClient) => {
        if (error) {
            callback(error);
            return;
        }
        new QueryClientImpl(rpcClient)
            .QueryVaultInfoByVaultID({
                id: id,
            })
            .then((result) => {
                callback(null, result);
            })
            .catch((error) => {
                callback(error?.message);
            });
    });
};
export const queryVaultMintedStatistic = (
    productId,
    callback
) => {
    createQueryClient((error, rpcClient) => {
        if (error) {
            callback(error);
            return;
        }
        new QueryClientImpl(rpcClient)
            .QueryPairsLockedAndMintedStatisticByApp({
                appId: Long.fromNumber(PRODUCT_ID),
            })
            .then((result) => {
                callback(null, result);
            })
            .catch((error) => {
                callback(error?.message);
            });
    });
};
