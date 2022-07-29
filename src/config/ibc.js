import { ibcDenoms } from "./network";

export const ibcAssetsInfo = [
  {
    counterpartyChainId: "theta-testnet-001",
    sourceChannelId: "channel-1",
    destChannelId: "channel-424",
    coinMinimalDenom: "uatom",
    ibcDenomHash: ibcDenoms["uatom"],
  },
  {
    counterpartyChainId: "test-core-1",
    sourceChannelId: "channel-3",
    destChannelId: "channel-83",
    coinMinimalDenom: "uxprt",
    ibcDenomHash: ibcDenoms["uxprt"],
  },
  {
    counterpartyChainId: "osmo-test-4",
    sourceChannelId: "channel-1",
    destChannelId: "channel-382",
    coinMinimalDenom: "uosmo",
    ibcDenomHash: ibcDenoms["uosmo"],
  },

];
