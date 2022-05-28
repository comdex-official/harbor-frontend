import Long from "long";
import BigNumber from "bignumber.js";

function omitDefault(input) {
  if (typeof input === "string") {
    return input === "" ? undefined : input;
  }

  if (typeof input === "number") {
    return input === 0 ? undefined : input;
  }

  if (Long.isLong(input)) {
    return input.isZero() ? undefined : input;
  }

  throw new Error(`Got unsupported type '${typeof input}'`);
}

export const customAminoTypes = {
  "/comdex.vault.v1beta1.MsgCreateRequest": {
    aminoType: "vault/MsgCreateRequest",
    toAmino: ({
      from,
      appMappingId,
      extendedPairVaultId,
      amountIn,
      amountOut,
    }) => {
      return {
        from,
        app_mapping_id: String(appMappingId),
        extended_pair_vault_id: String(extendedPairVaultId),
        amount_in: amountIn,
        amount_out: amountOut,
      };
    },
    fromAmino: ({
      from,
      app_mapping_id,
      extended_pair_vault_id,
      amount_in,
      amount_out,
    }) => {
      return {
        from,
        appMappingId: Number(app_mapping_id),
        extendedPairVaultId: Number(extended_pair_vault_id),
        amountIn: amount_in,
        amountOut: amount_out,
      };
    },
  },
  "/comdex.vault.v1beta1.MsgDepositRequest": {
    aminoType: "vault/MsgDepositRequest",
    toAmino: ({
      from,
      appMappingId,
      extendedPairVaultId,
      userVaultId,
      amount,
    }) => {
      return {
        from,
        app_mapping_id: String(appMappingId),
        extended_pair_vault_id: String(extendedPairVaultId),
        user_vault_id: userVaultId,
        amount: amount,
      };
    },
    fromAmino: ({
      from,
      app_mapping_id,
      extended_pair_vault_id,
      user_vault_id,
      amount,
    }) => {
      return {
        from,
        appMappingId: Number(app_mapping_id),
        extendedPairVaultId: Number(extended_pair_vault_id),
        userVaultId: user_vault_id,
        amount: amount,
      };
    },
  },
  "/comdex.vault.v1beta1.MsgWithdrawRequest": {
    aminoType: "vault/MsgWithdrawRequest",
    toAmino: ({
      from,
      appMappingId,
      extendedPairVaultId,
      userVaultId,
      amount,
    }) => {
      return {
        from,
        app_mapping_id: String(appMappingId),
        extended_pair_vault_id: String(extendedPairVaultId),
        user_vault_id: userVaultId,
        amount: amount,
      };
    },
    fromAmino: ({
      from,
      app_mapping_id,
      extended_pair_vault_id,
      user_vault_id,
      amount,
    }) => {
      return {
        from,
        appMappingId: Number(app_mapping_id),
        extendedPairVaultId: Number(extended_pair_vault_id),
        userVaultId: user_vault_id,
        amount: amount,
      };
    },
  },
  "/comdex.vault.v1beta1.MsgDrawRequest": {
    aminoType: "vault/MsgDrawRequest",
    toAmino: ({
      from,
      appMappingId,
      extendedPairVaultId,
      userVaultId,
      amount,
    }) => {
      return {
        from,
        app_mapping_id: String(appMappingId),
        extended_pair_vault_id: String(extendedPairVaultId),
        user_vault_id: userVaultId,
        amount: amount,
      };
    },
    fromAmino: ({
      from,
      app_mapping_id,
      extended_pair_vault_id,
      user_vault_id,
      amount,
    }) => {
      return {
        from,
        appMappingId: Number(app_mapping_id),
        extendedPairVaultId: Number(extended_pair_vault_id),
        userVaultId: user_vault_id,
        amount: amount,
      };
    },
  },
  "/comdex.vault.v1beta1.MsgRepayRequest": {
    aminoType: "vault/MsgRepayRequest",
    toAmino: ({
      from,
      appMappingId,
      extendedPairVaultId,
      userVaultId,
      amount,
    }) => {
      return {
        from,
        app_mapping_id: String(appMappingId),
        extended_pair_vault_id: String(extendedPairVaultId),
        user_vault_id: userVaultId,
        amount: amount,
      };
    },
    fromAmino: ({
      from,
      app_mapping_id,
      extended_pair_vault_id,
      user_vault_id,
      amount,
    }) => {
      return {
        from,
        appMappingId: Number(app_mapping_id),
        extendedPairVaultId: Number(extended_pair_vault_id),
        userVaultId: user_vault_id,
        amount: amount,
      };
    },
  },
  "/comdex.vault.v1beta1.MsgCloseRequest": {
    aminoType: "vault/MsgCloseRequest",
    toAmino: ({
      from,
      appMappingId,
      extendedPairVaultId,
      userVaultId,
    }) => {
      return {
        from,
        app_mapping_id: String(appMappingId),
        extended_pair_vault_id: String(extendedPairVaultId),
        user_vault_id: userVaultId,
      };
    },
    fromAmino: ({
      from,
      app_mapping_id,
      extended_pair_vault_id,
      user_vault_id,
    }) => {
      return {
        from,
        appMappingId: Number(app_mapping_id),
        extendedPairVaultId: Number(extended_pair_vault_id),
        userVaultId: user_vault_id,
      };
    },
  },
  "/comdex.locker.v1beta1.MsgCreateLockerRequest": {
    aminoType: "locker/MsgCreateLockerRequest",
    toAmino: ({
      depositor,
      amount,
      assetId,
      appMappingId,
    }) => {
      return {
        depositor,
        amount: amount,
        asset_id: String(assetId),
        app_mapping_id: String(appMappingId),
      };
    },
    fromAmino: ({
      depositor,
      amount,
      asset_id,
      app_mapping_id,
    
    }) => {
      return {
        depositor,
        amount: amount,
        assetId: Number(asset_id),
        appMappingId: Number(app_mapping_id),
     
      };
    },
  },
  "/comdex.locker.v1beta1.MsgAddWhiteListedAssetRequest": {
    aminoType: "locker/MsgAddWhiteListedAssetRequest",
    toAmino: ({
      from,
      assetId,
      appMappingId,
    }) => {
      return {
        from,
        asset_id: String(assetId),
        app_mapping_id: String(appMappingId),
      };
    },
    fromAmino: ({
      from,
      asset_id,
      app_mapping_id,
    
    }) => {
      return {
        from,
        assetId: Number(asset_id),
        appMappingId: Number(app_mapping_id),
      };
    },
  },
  "/comdex.locker.v1beta1.MsgDepositAssetRequest": {
    aminoType: "locker/MsgDepositAssetRequest",
    toAmino: ({
      depositor,
      lockerId,
      amount,
      assetId,
      appMappingId,
    }) => {
      return {
        depositor,
        locker_id: lockerId,
        amount: amount,
        asset_id: String(assetId),
        app_mapping_id: String(appMappingId),
      };
    },
    fromAmino: ({
      depositor,
      amount,
      locker_id,
      asset_id,
      app_mapping_id,
    
    }) => {
      return {
        depositor,
        lockerId: locker_id,
        amount: amount,
        assetId: Number(asset_id),
        appMappingId: Number(app_mapping_id),
      };
    },
  },
  "/comdex.locker.v1beta1.MsgWithdrawAssetRequest": {
    aminoType: "locker/MsgWithdrawAssetRequest",
    toAmino: ({
      depositor,
      lockerId,
      amount,
      assetId,
      appMappingId,
    }) => {
      return {
        depositor,
        locker_id: lockerId,
        amount: amount,
        asset_id: String(assetId),
        app_mapping_id: String(appMappingId),
      };
    },
    fromAmino: ({
      depositor,
      amount,
      locker_id,
      asset_id,
      app_mapping_id,
    
    }) => {
      return {
        depositor,
        lockerId: locker_id,
        amount: amount,
        assetId: Number(asset_id),
        appMappingId: Number(app_mapping_id),
      };
    },
  },
};
