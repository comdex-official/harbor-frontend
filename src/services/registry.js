import {
  MsgDeposit,
  MsgWithdraw,
} from "comdex-codec/build/comdex/liquidity/v1beta1/tx";
import { MsgCreateLockerRequest, MsgDepositAssetRequest, MsgWithdrawAssetRequest } from 'comdex-codec/build/comdex/locker/v1beta1/msg';
import { MsgCreateRequest, MsgDepositRequest, MsgWithdrawRequest, MsgDrawRequest, MsgRepayRequest, MsgCloseRequest } from 'comdex-codec/build/comdex/vault/v1beta1/msg'

import { Registry } from "@cosmjs/proto-signing";
import { defaultRegistryTypes } from "@cosmjs/stargate";

export const myRegistry = new Registry([
  ...defaultRegistryTypes,
  ["/comdex.liquidity.v1beta1.MsgDeposit", MsgDeposit],
  ["/comdex.liquidity.v1beta1.MsgWithdraw", MsgWithdraw],
  ["/comdex.locker.v1beta1.MsgCreateLockerRequest", MsgCreateLockerRequest],
  ["/comdex.locker.v1beta1.MsgDepositAssetRequest", MsgDepositAssetRequest],
  ["/comdex.locker.v1beta1.MsgWithdrawAssetRequest", MsgWithdrawAssetRequest],
  ["/comdex.vault.v1beta1.MsgCreateRequest", MsgCreateRequest],
  ["/comdex.vault.v1beta1.MsgDepositRequest", MsgDepositRequest],
  ["/comdex.vault.v1beta1.MsgWithdrawRequest", MsgWithdrawRequest],
  ["/comdex.vault.v1beta1.MsgDrawRequest", MsgDrawRequest],
  ["/comdex.vault.v1beta1.MsgRepayRequest", MsgRepayRequest],
  ["/comdex.vault.v1beta1.MsgCloseRequest", MsgCloseRequest],
]);


