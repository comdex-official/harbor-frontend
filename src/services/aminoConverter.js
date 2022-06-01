export const customAminoTypes = {
  "/comdex.vault.v1beta1.MsgCreateRequest": {
    aminoType: "comdex/vault/MsgCreateRequest",
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
    aminoType: "comdex/vault/MsgDepositRequest",
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
    aminoType: "comdex/vault/MsgWithdrawRequest",
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
    aminoType: "comdex/vault/MsgDrawRequest",
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
    aminoType: "comdex/vault/MsgRepayRequest",
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
    aminoType: "comdex/vault/MsgCloseRequest",
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
    aminoType: "comdex/locker/MsgCreateLockerRequest",
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
    aminoType: "comdex/locker/MsgAddWhiteListedAssetRequest",
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
    aminoType: "comdex/locker/MsgDepositAssetRequest",
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
    aminoType: "comdex/locker/MsgWithdrawAssetRequest",
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
  "/comdex.auction.v1beta1.MsgPlaceSurplusBidRequest": {
    aminoType: "auction/MsgPlaceSurplusBidRequest",
    toAmino: ({
      bidder,
      amount,
      auctionId,
      appId,
      auctionMappingId,
    }) => {
      return {
        bidder,
        amount: amount,
        auction_id: String(auctionId),
        app_id: String(appId),
        auction_mapping_id: String(auctionMappingId),
      };
    },
    fromAmino: ({
      bidder,
      amount,
      auction_id,
      app_id,
      auction_mapping_id,
    }) => {
      return {
        bidder,
        amount: amount,
        auctionId: Number(auction_id),
        appId: Number(app_id),
        auctionMappingId: Number(auction_mapping_id),
      };
    },
  },
  "/comdex.auction.v1beta1.MsgPlaceDebtBidRequest": {
    aminoType: "auction/MsgPlaceDebtBidRequest",
    toAmino: ({
      bidder,
      bid,
      expectedUserToken,
      auctionId,
      appId,
      auctionMappingId,
    }) => {
      return {
        bidder,
        bid: bid,
        expected_user_token: expectedUserToken,
        auction_id: String(auctionId),
        app_id: String(appId),
        auction_mapping_id: String(auctionMappingId),
      };
    },
    fromAmino: ({
      bidder,
      bid,
      expected_user_token,
      auction_id,
      app_id,
      auction_mapping_id,
    }) => {
      return {
        bidder,
        bid: bid,
        expectedUserToken: expected_user_token,
        auctionId: Number(auction_id),
        appId: Number(app_id),
        auctionMappingId: Number(auction_mapping_id),
      };
    },
  },
  "/comdex.auction.v1beta1.MsgPlaceDutchBidRequest": {
    aminoType: "auction/MsgPlaceDutchBidRequest",
    toAmino: ({
      bidder,
      max,
      amount,
      auctionId,
      appId,
      auctionMappingId,
    }) => {
      return {
        bidder,
        max,
        amount: amount,
        auction_id: String(auctionId),
        app_id: String(appId),
        auction_mapping_id: String(auctionMappingId),
      };
    },
    fromAmino: ({
      bidder,
      max,
      amount,
      auction_id,
      app_id,
      auction_mapping_id,
    }) => {
      return {
        bidder,
        max,
        amount: amount,
        auctionId: Number(auction_id),
        appId: Number(app_id),
        auctionMappingId: Number(auction_mapping_id),
      };
    },
  },
};
