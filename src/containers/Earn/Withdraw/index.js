import { Button, message, Slider } from "antd";
import *  as PropTypes from 'prop-types';
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Col, Row, SvgIcon } from "../../../components/common";
import CustomInput from "../../../components/CustomInput";
import TooltipIcon from "../../../components/TooltipIcon";
import {
  amountConversion,
  amountConversionWithComma,
  denomConversion,
  getAmount,
  getDenomBalance,
} from "../../../utils/coin";
import { iconNameFromDenom, toDecimals } from "../../../utils/string";
import variables from "../../../utils/variables";
import "./index.scss";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { ValidateInputNumber } from "../../../config/_validation";
import { setAmountIn, setAssets, setPair } from "../../../actions/asset";
import { queryUserLockedValueInLocker, queryUserLockerByProductAssetId } from "../../../services/locker/query";
import { setIsLockerExist, setUserLockedValue, setSliderTooltipVisible } from "../../../actions/locker";
import { defaultFee } from "../../../services/transaction";
import Long from "long";
import { signAndBroadcastTransaction } from "../../../services/helper";
import Snack from "../../../components/common/Snack";
import { DEFAULT_FEE, DOLLAR_DECIMALS, PRODUCT_ID } from "../../../constants/common";

const Withdraw = ({
  lang,
  address,
  reverse,
  pair,
  spotPrice,
  setAssets,
  assets,
  balances,
  refreshBalance,
  userLockedAmountInLocker,
  setUserLockedValue,
  sliderTooltipVisible,
  setSliderTooltipVisible
}) => {
  const dispatch = useDispatch();
  const inAmount = useSelector((state) => state.asset.inAmount);
  const isLockerExist = useSelector((state) => state.locker.isLockerExist);

  const [firstInput, setFirstInput] = useState();
  const [secondInput, setSecondInput] = useState();
  const [inProgress, setInProgress] = useState(false);
  const [inputValidationError, setInputValidationError] = useState();
  const [outputValidationError, setOutputValidationError] = useState();

  const marks = {
    0: "0%",
    500: "100%",
  };
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
      if (item.name === "CMDX") {
        whiteListedAssetData.push(item);
      }
    })
  }

  const handleInputChange = (value) => {
    value = toDecimals(value).toString().trim();
    setInputValidationError(
      ValidateInputNumber(
        Number(getAmount(value)),
        userLockedAmountInLocker,
        "macro"
      )
    );
    dispatch(setAmountIn(value));
  };

  const handleSliderChange = (value) => {
    setSliderTooltipVisible(true)
    dispatch(setAmountIn(value));
    setTimeout(() => {
      setSliderTooltipVisible(false)
    }, 2000);
  };
  const formatter = () => `${inAmount}`;

  const showInDollarValue = () => {
    const total = inAmount;

    return `≈ $${Number(total && isFinite(total) ? total : 0).toFixed(
      DOLLAR_DECIMALS
    )}`;
  };
  useEffect(() => {
    resetValues();
    fetchOwnerLockerExistByAssetId(1, 3, address);
  }, [address]);

  useEffect(() => {
    fetchOwnerLockerBalance(PRODUCT_ID, 3, address);
  }, [address, refreshBalance]);

  const fetchOwnerLockerBalance = (productId, assetId, owner) => {
    setInProgress(true);
    queryUserLockedValueInLocker(productId, assetId, owner, (error, data) => {
      if (error) {
        message.error(error);
        return;
      }
      setUserLockedValue((data?.lockerInfo[0]?.netBalance))
      setInProgress(false);
    })
  }
  const fetchOwnerLockerExistByAssetId = (productId, assetId, address) => {
    queryUserLockerByProductAssetId(productId, assetId, address, (error, data) => {
      if (error) {
        message.error(error);
        return;
      }
      let lockerExist = data?.lockerInfo?.length;
      if (lockerExist > 0) {
        dispatch(setIsLockerExist(true));
      } else {
        dispatch(setIsLockerExist(false));
      }
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
            depositor: address,
            lockerId: "cmst1",
            amount: getAmount(inAmount),
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
          console.log(error);
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
          />,
        );
        resetValues()
        dispatch({
          type: "BALANCE_REFRESH_SET",
          value: refreshBalance + 1,
        });
      }
    );

  }
  const handleInputMax = () => {
    if (Number(userLockedAmountInLocker) > DEFAULT_FEE) {
      return (
        dispatch(setAmountIn(amountConversion(userLockedAmountInLocker - DEFAULT_FEE)))

      )
    } else {
      return null
    }
  }
  getAssetDenom();

  return (
    <>
      <Col>
        <div className="farm-content-card earn-deposite-card earn-main-deposite locker-withdraw">
          <div className="withdraw-title">Withdraw</div>
          {/* <div className="assets-select-card">
            <div className="assets-left">
              <label className="leftlabel">
                Withdraw <TooltipIcon />
              </label>
              <div className="assets-select-wrapper">
                {whiteListedAssetData && whiteListedAssetData.map((item, index) => {
                  return (
                    <React.Fragment key={index} >
                      {inProgress ? <h1>Loading...</h1> :
                        <div className="farm-asset-icon-container" >
                          <div className="select-inner">
                            <div className="svg-icon">
                              <div className="svg-icon-inner">
                                <SvgIcon name={iconNameFromDenom(item.denom)} />
                                <span> {item.name}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      }
                    </React.Fragment>
                  )
                })}
              </div>
            </div>
            <div className="assets-right">
              <div className="label-right">
                Balance
                <span className="ml-1">
                  {amountConversionWithComma(userLockedAmountInLocker)}
                  {denomConversion('ucmdx')}
                </span>
                <div className="maxhalf">
                  <Button
                    className="active"
                    onClick={() => handleInputMax()}
                  >
                    max
                  </Button>
                </div>
              </div>
              <div className="input-select">
                <CustomInput
                  value={inAmount}
                  onChange={(event) =>
                    handleInputChange(event.target.value)
                  }
                  validationError={inputValidationError}
                />
                <small>{showInDollarValue()}</small>
              </div>
            </div>
          </div> */}

          <div className="withdraw-main-container">
            <div className="withdraw-content-container">
              <div className="withdraw-stats-container">
                <div className="withdraw-stats">
                  <div className="stats-title">Intrest</div>
                  <div className="stats-value">1234 CMST</div>
                </div>
                <div className="withdraw-stats">
                  <div className="stats-title">Balance</div>
                  <div className="stats-value">1234 CMST</div>
                </div>
                <div className="withdraw-stats">
                  <div className="stats-title">Lorem</div>
                  <div className="stats-value">1234 CMST</div>
                </div>
              </div>
              <div className="available-container">
                <div className="available-title">Available to Withdraw</div>
                <div className="available-input">
                  <div className="input-select ">
                    <CustomInput
                      className="ant-input"
                      value={inAmount}
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
                    className={
                      "comdex-slider "
                    }
                    marks={marks}
                    value={inAmount}
                    max={500}
                    onChange={handleSliderChange}
                    min={0}
                    tooltipVisible={sliderTooltipVisible}
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
      })
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

}
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
  };
};
const actionsToProps = {
  setPair,
  setUserLockedValue,
  setAssets,
  setSliderTooltipVisible,
};

export default connect(stateToProps, actionsToProps)(Withdraw);
