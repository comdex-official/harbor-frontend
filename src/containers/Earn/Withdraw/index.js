import { Button, message, Slider } from "antd";
import * as PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Col } from "../../../components/common";
import CustomInput from "../../../components/CustomInput";
import {
  amountConversion,
  amountConversionWithComma,
  denomConversion,
  getAmount,
} from "../../../utils/coin";
import { toDecimals } from "../../../utils/string";
import variables from "../../../utils/variables";
import "./index.scss";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { ValidateInputNumber } from "../../../config/_validation";
import { setAmountIn, setAssets, setPair } from "../../../actions/asset";
import { queryUserLockerByProductAssetId } from "../../../services/locker/query";
import {
  setIsLockerExist,
  setUserLockedValue,
  setSliderTooltipVisible,
  setOwnerVaultInfo,
} from "../../../actions/locker";
import { defaultFee } from "../../../services/transaction";
import Long from "long";
import { signAndBroadcastTransaction } from "../../../services/helper";
import Snack from "../../../components/common/Snack";
import { DOLLAR_DECIMALS, PRODUCT_ID } from "../../../constants/common";

const Withdraw = ({
  lang,
  address,
  assets,
  refreshBalance,
  userLockedAmountInLocker,
  setUserLockedValue,
  sliderTooltipVisible,
  setSliderTooltipVisible,
  whiteListedAsset,
  ownerLockerInfo,
  setOwnerVaultInfo,
}) => {
  const dispatch = useDispatch();
  const inAmount = useSelector((state) => state.asset.inAmount);
  const isLockerExist = useSelector((state) => state.locker.isLockerExist);

  const [inProgress, setInProgress] = useState(false);
  const [inputValidationError, setInputValidationError] = useState();
  const [userDeposite, setuserDeposite] = useState();
  const [reward, setReward] = useState();
  const [sliderPercentage, setsliderPercentage] = useState(0);
  const [sliderValue, setSliderValue] = useState();

  const whiteListedAssetData = [];
  const resetValues = () => {
    dispatch(setAmountIn(0));
  };

  const getAssetDenom = () => {
    // When we get multiple whiteListed Asset
    // ************************************************
    // let filterAssets = assets?.filter((item, index) => {
    //   return (
    //     item.id.low === whiteListedAsset[index]?.low
    //   )
    // })
    // whiteListedAssetData.push(filterAssets);
    // ************************************************

    // when we fetching data from whiteListedAssetByAppId query , then chnage "CMDX" to query.id and match with whiteListedAsset Id.

    assets?.map((item) => {
      if (item.id.low === whiteListedAsset[0]?.low) {
        whiteListedAssetData.push(item);
      }
    });
  };

  const handleInputChange = (value) => {
    value = toDecimals(value).toString().trim();
    setInputValidationError(
      ValidateInputNumber(
        Number(getAmount(value)),
        userLockedAmountInLocker,
        "macro"
      )
    );
    let calculatedSliderValue = (value / userDeposite) * 100
    setSliderValue(calculatedSliderValue)
    dispatch(setAmountIn(value));
    calculatedSliderValue = Math.floor(calculatedSliderValue)
    setsliderPercentage(calculatedSliderValue)
  };

  const handleSliderChange = (value) => {
    setsliderPercentage(value)
    setSliderValue(value)
    if (value === userDeposite) {
      dispatch(setAmountIn(userDeposite));
      return
    }
    else {
      let calcutatedValue = (value / 100) * userDeposite;
      dispatch(setAmountIn(calcutatedValue));
    }
  };

  const formatter = () => {

    if (sliderPercentage > 100) {
      return `${100}%`
    }
    else {
      return `${sliderPercentage}%`
    }
  };

  const showInDollarValue = () => {
    const total = inAmount;
    return `≈ $${Number(total && isFinite(total) ? total : 0).toFixed(
      DOLLAR_DECIMALS
    )}`;
  };

  useEffect(() => {
    resetValues();
    fetchOwnerLockerExistByAssetId(PRODUCT_ID, whiteListedAssetId, address);
  }, [address, userDeposite]);

  const whiteListedAssetId = whiteListedAsset[0]?.low;
  const lockerId = ownerLockerInfo[0]?.lockerId;
  const returnsAccumulated = amountConversion(ownerLockerInfo[0]?.returnsAccumulated || 0);
  const userBalanceInLocker = amountConversionWithComma(ownerLockerInfo[0]?.netBalance || 0);

  const fetchOwnerLockerExistByAssetId = (
    productId = PRODUCT_ID,
    lockerId,
    address
  ) => {
    queryUserLockerByProductAssetId(
      productId,
      lockerId,
      address,
      (error, data) => {
        if (error) {
          message.error(error);
          return;
        }

        let balance;
        balance = (data?.lockerInfo[0]?.netBalance || "0") / 1000000;
        setOwnerVaultInfo(data?.lockerInfo);
        setReward(data?.lockerInfo[0]?.returnsAccumulated);
        setuserDeposite(balance);
        setUserLockedValue(data?.lockerInfo[0]?.netBalance || "0");
        let lockerExist = data?.lockerInfo?.length;
        if (lockerExist > 0) {
          dispatch(setIsLockerExist(true));
        } else {
          dispatch(setIsLockerExist(false));
        }
        setInProgress(false);
      }
    );
  };
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
            depositor: address,
            lockerId: lockerId,
            amount: getAmount(inAmount),
            assetId: Long.fromNumber(whiteListedAssetId),
            appId: Long.fromNumber(PRODUCT_ID),
          },
        },
        fee: defaultFee(),
      },
      address,
      (error, result) => {
        setInProgress(false);
        if (error) {
          message.error(error);
          return;
        }

        if (result?.code) {
          message.info(result?.rawLog);
          return;
        }
        message.success(
          <Snack
            message={variables[lang].tx_success}
            hash={result?.transactionHash}
          />
        );
        resetValues();
        fetchOwnerLockerExistByAssetId(PRODUCT_ID, whiteListedAssetId, address);
        dispatch({
          type: "BALANCE_REFRESH_SET",
          value: refreshBalance + 1,
        });
      }
    );
  };
  const marks = {
    0: "0%",
    100: "100%",
  };
  getAssetDenom();

  return (
    <>
      <Col>
        <div className="farm-content-card earn-deposite-card earn-main-deposite locker-withdraw">
          <div className="withdraw-title">Locker</div>
          <div className="withdraw-main-container">
            <div className="withdraw-content-container">
              <div className="withdraw-stats-container">
                <div className="withdraw-stats">
                  <div className="stats-title">Balance</div>
                  <div className="stats-value">
                    {userBalanceInLocker}
                    {denomConversion("ucmst")}
                  </div>
                </div>
                <div className="withdraw-stats">
                  <div className="stats-title">Interest</div>
                  <div className="stats-value">
                    {returnsAccumulated || 0}{" "}
                    {denomConversion(whiteListedAssetData[0]?.denom)}{" "}
                  </div>
                </div>
              </div>
              <div className="available-container">
                <div className="available-title">Amount to Withdraw</div>
                <div className="available-input">
                  <div className="input-select ">
                    <CustomInput
                      className="ant-input"
                      value={inAmount}
                      placeholder="0.00"
                      onChange={(event) =>
                        handleInputChange(event.target.value)
                      }
                      validationError={inputValidationError}
                    />
                    <span className="denom-name">CMST</span>
                  </div>
                </div>
              </div>
              <div className="withdraw-slider">
                <div className="slider-numbers mt-3">
                  <Slider
                    className={"comdex-slider "}
                    marks={marks}
                    value={sliderValue}
                    onChange={handleSliderChange}
                    min={0}
                    tipFormatter={formatter}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="assets PoolSelect-btn">
            <div className="assets-form-btn text-center  mb-2">
              <Button
                loading={inProgress}
                disabled={
                  !isLockerExist ||
                  !inAmount ||
                  inAmount <= 0 ||
                  inProgress ||
                  inputValidationError?.message
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
  assets: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.shape({
        low: PropTypes.number,
        high: PropTypes.number,
        inSigned: PropTypes.number,
      }),
      name: PropTypes.string.isRequired,
      denom: PropTypes.string.isRequired,
      decimals: PropTypes.shape({
        low: PropTypes.number,
        high: PropTypes.number,
        inSigned: PropTypes.number,
      }),
    })
  ),
  whiteListedAsset: PropTypes.arrayOf(
    PropTypes.shape({
      list: PropTypes.shape({
        id: PropTypes.shape({
          low: PropTypes.number,
          high: PropTypes.number,
          inSigned: PropTypes.number,
        }),
      }),
    })
  ),
  balances: PropTypes.arrayOf(
    PropTypes.shape({
      denom: PropTypes.string.isRequired,
      amount: PropTypes.string,
    })
  ),
  refreshBalance: PropTypes.number.isRequired,
  userLockedAmountInLocker: PropTypes.string.isRequired,
  sliderTooltipVisible: PropTypes.bool.isRequired,
  ownerLockerInfo: PropTypes.array,
};
const stateToProps = (state) => {
  return {
    lang: state.language,
    address: state.account.address,
    assets: state.asset._.list,
    balances: state.account.balances.list,
    pair: state.asset.pair,
    refreshBalance: state.account.refreshBalance,
    userLockedAmountInLocker: state.locker.userLockedAmountInLocker,
    sliderTooltipVisible: state.locker.sliderTooltipVisible,
    whiteListedAsset: state.locker.whiteListedAssetById.list,
    ownerLockerInfo: state.locker.ownerVaultInfo,
  };
};
const actionsToProps = {
  setPair,
  setUserLockedValue,
  setAssets,
  setSliderTooltipVisible,
  setOwnerVaultInfo,
};

export default connect(stateToProps, actionsToProps)(Withdraw);
