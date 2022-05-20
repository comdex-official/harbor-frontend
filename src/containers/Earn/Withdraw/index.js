import { Button, message } from "antd";
import *  as PropTypes from 'prop-types';
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Col, Row, SvgIcon } from "../../../components/common";
import CustomInput from "../../../components/CustomInput";
import TooltipIcon from "../../../components/TooltipIcon";
import {
  amountConversionWithComma,
  denomConversion,
  getAmount,
  getDenomBalance,
} from "../../../utils/coin";
import { iconNameFromDenom, toDecimals } from "../../../utils/string";
import variables from "../../../utils/variables";
import Info from "../Info";
import "./index.scss";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { ValidateInputNumber } from "../../../config/_validation";
import { setAmountIn, setAssets, setPair } from "../../../actions/asset";
import { queryUserLockerByProductAssetId } from "../../../services/locker/query";
import { setIsLockerExist } from "../../../actions/locker";
import { defaultFee } from "../../../services/transaction";
import Long from "long";
import { signAndBroadcastTransaction } from "../../../services/helper";
import Snack from "../../../components/common/Snack";

const Withdraw = ({
  lang,
  address,
  reverse,
  pair,
  spotPrice,
  balances
}) => {
  const dispatch = useDispatch();
  const inAmount = useSelector((state) => state.asset.inAmount);
  const isLockerExist = useSelector((state) => state.locker.isLockerExist);


  const [firstInput, setFirstInput] = useState();
  const [secondInput, setSecondInput] = useState();
  const [inProgress, setInProgress] = useState(false);
  const [inputValidationError, setInputValidationError] = useState();
  const [outputValidationError, setOutputValidationError] = useState();

  const AssetAvailableBalance = getDenomBalance(balances, pair?.baseCoinDenom) || 0;

  const handleInputChange = (value) => {
    value = toDecimals(value).toString().trim();
    setInputValidationError(
      ValidateInputNumber(
        Number(getAmount(value)),
        AssetAvailableBalance,
        "macro"
      )
    );
    dispatch(setAmountIn(value));
  };
  useEffect(() => {
    fetchOwnerLockerExistByAssetId(1, 3, address);
  }, [address]);

  const fetchOwnerLockerExistByAssetId = (productId, assetId, address) => {
    queryUserLockerByProductAssetId(productId, assetId, address, (error, data) => {
      if (error) {
        message.error(error);
        return;
      }
      console.log(data);
      let lockerExist = data?.lockerInfo?.length;
      if (lockerExist > 0) {
        dispatch(setIsLockerExist(true));
      } else {
        dispatch(setIsLockerExist(false));
      }
      console.log(lockerExist);
    })
  }
  const handleSubmitAssetWithdrawLocker = () => {
    if (!address) {
      message.error("Address not found, please connect to Keplr");
      return;
    }
    setInProgress(true);
    message.info("Transaction initiated");
    signAndBroadcastTransaction(
      {
        message: {
          typeUrl: "/comdex.locker.v1beta1.MsgWithdrawAssetRequest",
          value: {
            // depositor: address,
            // lockerId: "cmst1",
            // amount: inAmount,
            // assetId: Long.fromNumber(3),
            // appMappingId: Long.fromNumber(1),
            depositor: address,
            lockerId: "cmst1",
            amount: inAmount,
            assetId: Long.fromNumber(3),
            appMappingId: Long.fromNumber(1),
          }
        },
        fee: defaultFee(),
      },
      address,
      (error, result) => {
        setInProgress(false);
        if (error) {
          // dispatch(setAmountIn());
          console.log(error);
          message.error(error);
          return;
        }

        if (result?.code) {
          message.info(result?.rawLog);
          return;
        }
        message.success(
          // dispatch(setAmountIn()),
          <Snack
            message={variables[lang].tx_success}
            hash={result?.transactionHash}
          />,
        );
      }
    );

  }
  const getOutputPrice = () => {
    return reverse ? spotPrice : 1 / spotPrice; // calculating price from pool
  };
  const AvailableAssetBalance =
    getDenomBalance(balances, "ucmdx") || 0;

  return (
    <>
      <Col>
        <div className="farm-content-card earn-deposite-card">
          <div className="assets-select-card">
            <div className="assets-left">
              <label className="leftlabel">
                Withdraw <TooltipIcon />
              </label>
              <div className="assets-select-wrapper">
                {/* Icon Container Start  */}
                <div className="farm-asset-icon-container">
                  <div className="select-inner">
                    <div className="svg-icon">
                      <div className="svg-icon-inner">
                        <SvgIcon name={iconNameFromDenom("ucmdx")} />{" "}
                        <span>CMDX</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Icon Container End  */}
              </div>
            </div>
            <div className="assets-right">
              <div className="label-right">
                Balance
                <span className="ml-1">
                  {amountConversionWithComma(AvailableAssetBalance)}
                  {denomConversion('ucmdx')}
                </span>
                <div className="maxhalf">
                  <Button
                    className="active"
                    onClick={() =>
                      //   handleFirstInputMax(
                      //     Number(firstAssetAvailableBalance) > DEFAULT_FEE
                      //       ? amountConversion(
                      //           firstAssetAvailableBalance - DEFAULT_FEE
                      //         )
                      //       : null
                      //   )
                      console.log("max button click")
                    }
                  >
                    max
                  </Button>
                </div>
              </div>
              <div className="input-select">
                <CustomInput
                  value={inAmount}
                  onChange={(event) =>
                    // handleFirstInputChange(event.target.value)
                    handleInputChange(event.target.value)

                  }
                  validationError={inputValidationError}
                />
                <small>$ 0.00</small>
              </div>
            </div>
          </div>

          {/* <Info /> */}
          <div className="assets PoolSelect-btn">
            <div className="assets-form-btn text-center  mb-2">
              <Button
                loading={inProgress}
                disabled={
                  !isLockerExist ||
                  !inAmount
                  //   inProgress ||
                  //   !pool?.id ||
                  //   !Number(firstInput) ||
                  //   !Number(secondInput) ||
                  //   inputValidationError?.message ||
                  //   outputValidationError?.message
                }
                type="primary"
                className="btn-filled"
                onClick={() => handleSubmitAssetWithdrawLocker()}
              >
                Withdraw
              </Button>
            </div>
          </div>
        </div>
      </Col>
    </>
  );
};

Withdraw.propTypes = {
  address: PropTypes.string.isRequired,
  balances: PropTypes.arrayOf(
    PropTypes.shape({
      denom: PropTypes.string.isRequired,
      amount: PropTypes.string,
    })
  ),

}
const stateToProps = (state) => {
  return {
    lang: state.language,
    address: state.account.address,
    balances: state.account.balances.list,
    pair: state.asset.pair,


  };
};
const actionsToProps = {
  setPair,
};

export default connect(stateToProps, actionsToProps)(Withdraw);
