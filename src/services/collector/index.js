import { QueryClientImpl } from "comdex-codec/build/comdex/collector/v1beta1/query";
import { createQueryClient } from "../helper";
import { PRODUCT_ID } from "../../constants/common";
import Long from "long";

export const queryCollectorInformation = (callback) => {
  createQueryClient((error, rpcClient) => {
    if (error) {
      callback(error);
      return;
    }
    new QueryClientImpl(rpcClient)
      .QueryCollectorLookupByApp({
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
