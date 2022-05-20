import {
  MsgCreatePool,
  MsgDeposit,
  MsgWithdraw,
  MsgLimitOrder,
} from "comdex-codec/build/comdex/liquidity/v1beta1/tx";
import { MsgCreateLockerRequest, MsgDepositAssetRequest, MsgWithdrawAssetRequest } from 'comdex-codec/build/comdex/locker/v1beta1/msg';

import { Registry } from "@cosmjs/proto-signing";
import { defaultRegistryTypes } from "@cosmjs/stargate";

export const myRegistry = new Registry([
  ...defaultRegistryTypes,
  ["/comdex.liquidity.v1beta1.MsgCreatePool", MsgCreatePool],
  ["/comdex.liquidity.v1beta1.MsgDeposit", MsgDeposit],
  ["/comdex.liquidity.v1beta1.MsgWithdraw", MsgWithdraw],
  ["/comdex.liquidity.v1beta1.MsgLimitOrder", MsgLimitOrder],
  ["/comdex.locker.v1beta1.MsgCreateLockerRequest", MsgCreateLockerRequest],
  ["/comdex.locker.v1beta1.MsgDepositAssetRequest", MsgDepositAssetRequest],
  ["/comdex.locker.v1beta1.MsgWithdrawAssetRequest", MsgWithdrawAssetRequest],
]);


