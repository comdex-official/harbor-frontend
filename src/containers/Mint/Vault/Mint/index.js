import { Button, Slider, message } from "antd";
import * as PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Col, Row, SvgIcon } from "../../../../components/common";
import CustomInput from "../../../../components/CustomInput";
import TooltipIcon from "../../../../components/TooltipIcon";
import {
  amountConversion,
  amountConversionWithComma,
  denomConversion,
  getAmount,
  getDenomBalance,
} from "../../../../utils/coin";
import { iconNameFromDenom, toDecimals } from "../../../../utils/string";
import variables from "../../../../utils/variables";
import "./index.scss";
import PricePool from "./PricePool";

import { List, Select, Input, Progress, Switch } from "antd";
import {
  setPair,
  setAssetIn,
  setAssetOut,
  setAmountIn,
  setAmountOut,
  setCollateralRatio,
} from "../../../../actions/asset";
import { marketPrice } from "../../../../utils/number";
import "./index.scss";
import VaultDetails from "./VaultDetails";
import { connect, useDispatch } from "react-redux";
import { ValidateInputNumber } from "../../../../config/_validation";
import { setComplete } from "../../../../actions/swap";
import { setVault } from "../../../../actions/account";
import { comdex } from "../../../../config/network";
import { DEFAULT_FEE } from "../../../../constants/common";
import { signAndBroadcastTransaction } from "../../../../services/helper";
import { getTypeURL } from "../../../../services/transaction";
import Snack from "../../../../components/common/Snack";
import { useSelector } from "react-redux";

const Mint = ({
  lang,
  address,
  pairs,
  pair,
  balances,
  setPair,
  setAssetIn,
  setAssetOut,
  setAmountIn,
  setAmountOut,
  setComplete,
  inAmount,
  outAmount,
  markets,
  collateralRatio,
  setCollateralRatio,
  vaults,
  setVault,
  vault,
  refreshBalance,
}) => {
  const [firstInput, setFirstInput] = useState();
  const [secondInput, setSecondInput] = useState();
  const [inProgress, setInProgress] = useState(false);
  const [validationError, setValidationError] = useState();
  const [outputValidationError, setOutputValidationError] = useState();

  const dispatch = useDispatch();

  const marks = {
    0: "0%",
    150: "Min - 150%",
    200: "Safe: 200%",
  };

  const onChange = (value) => {
    value = toDecimals(value).toString().trim();
    handleAmountInChange(value);
    setValidationError(
      ValidateInputNumber(getAmount(value), collateralAssetBalance)
    );
  };
  const handleAmountInChange = (value) => {
    setValidationError(
      ValidateInputNumber(getAmount(value), collateralAssetBalance)
    );
    setAmountIn(value);
    setAmountOut(
      calculateAmountOut(
        value,
        selectedTokenPrice,
        collateralRatio / 100,
        marketPrice(markets, pair && pair.denomOut)
      )
    );
  };

  const collateralAssetBalance = getDenomBalance(balances, pair && pair.denomIn) || 0;

  const calculateAmountOut = (
    inAmount,
    inAssetPrice,
    ratio,
    amountOutPrice
  ) => {
    const amount = (inAmount * inAssetPrice) / (ratio * amountOutPrice);
    return ((isFinite(amount) && amount) || 0).toFixed(6);
  };

  const selectedTokenPrice = marketPrice(markets, pair && pair.denomIn);

  const getOutputPrice = () => {
    // return reverse ? spotPrice : 1 / spotPrice;
    // calculating price from pool
  };
  const handleSliderChange = (value) => {
    setCollateralRatio(value);
    setAmountOut(
      calculateAmountOut(
        inAmount,
        selectedTokenPrice,
        value / 100,
        marketPrice(markets, pair && pair.denomOut)
      )
    );
  };
  const handleMaxClick = () => {
    if (pair?.denomIn === comdex.coinMinimalDenom) {
      return Number(collateralAssetBalance) > DEFAULT_FEE
        ? handleAmountInChange(
          amountConversion(collateralAssetBalance - DEFAULT_FEE)
        )
        : handleAmountInChange();
    } else {
      return handleAmountInChange(amountConversion(collateralAssetBalance));
    }
  };

  const resetValues = () => {
    setAmountIn(0);
    setAmountOut(0);
  };

  const handleCreate = () => {
    if (!address) {
      message.error("Address not found, please connect to Keplr");
      return;
    }

    if (vault?.id) {
      message.info("This vault already exits. Try editing");
      return;
    }

    setInProgress(true);
    message.info("Transaction initiated");
    signAndBroadcastTransaction(
      {
        message: {
          typeUrl: getTypeURL("create"),
          value: {
            from: address,
            amountIn: getAmount(inAmount),
            amountOut: getAmount(outAmount),
            pairId: pair?.id,
          },
        },
        fee: {
          amount: [{ denom: "ucmdx", amount: DEFAULT_FEE.toString() }],
          gas: "2500000",
        },
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

        setComplete(true);
        message.success(
          <Snack
            message={variables[lang].tx_success}
            hash={result?.transactionHash}
          />
        );
        resetValues();
        dispatch({
          type: "BALANCE_REFRESH_SET",
          value: refreshBalance + 1,
        });
      }
    );
  };


  const { Option } = Select;
  const data = [
    {
      title: "Liquidation Price",
      counts: "$1,234.20",
    },
    {
      title: "Collateral Deposited",
      counts: "$1,234.20",
    },
    {
      title: "Oracle Price",
      counts: "30.45%",
    },
    {
      title: "Withdrawn",
      counts: "$30.45",
    },
  ];
  useEffect(() => {
    setCollateralRatio(200);
  }, []);

  return (
    <>
      <div className="details-wrapper">
        <div className="details-left farm-content-card earn-deposite-card vault-mint-card">
          <div className="mint-title">Configure Your Valut</div>
          <div className="assets-select-card">
            <div className="assets-left">
              <label className="leftlabel">
                Deposit <TooltipIcon />
              </label>
              <div className="assets-select-wrapper">
                {/* Icon Container Start  */}
                <div className="farm-asset-icon-container">
                  <div className="select-inner">
                    <div className="svg-icon">
                      <div className="svg-icon-inner">
                        <SvgIcon name={iconNameFromDenom("uatom")} />{" "}
                        <span> ATOM</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Icon Container End  */}
              </div>
            </div>
            <div className="assets-right">
              <div className="label-right">
                Available
                <span className="ml-1">
                  {amountConversionWithComma(collateralAssetBalance)} ATOM
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
                    onChange(event.target.value)
                  }
                  validationError={validationError}
                />
                <small>$ 0.00</small>
              </div>
            </div>
          </div>

          <div className="assets-select-card mt-4">
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
                        <SvgIcon name={iconNameFromDenom("ucmst")} />{" "}
                        <span> CMST</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Icon Container End  */}
              </div>
            </div>
            <div className="assets-right">
              <div className="label-right">
                Available
                <span className="ml-1">
                  {amountConversionWithComma("000000")} CMST
                </span>
                <div className="maxhalf">
                  <Button
                    className="active"
                    onClick={() => {
                      //   handleFirstInputMax(
                      //     Number(firstAssetAvailableBalance) > DEFAULT_FEE
                      //       ? amountConversion(
                      //           firstAssetAvailableBalance - DEFAULT_FEE
                      //         )
                      //       : null
                      //   )
                      handleMaxClick()
                      console.log("max button click")
                    }
                    }
                  >
                    max
                  </Button>
                </div>
              </div>
              <div className="input-select">
                <CustomInput
                  value={outAmount}
                  disabled
                />
                <small>$ 0.00</small>
              </div>
            </div>
          </div>

          <div className="Interest-rate-container mt-4">
            <Row>
              <div className="title">Set Collateral Ratio</div>
            </Row>
            <div className="slider-numbers mt-4">
              <Slider
                className={
                  "comdex-slider borrow-comdex-slider " +
                  (collateralRatio <= 150
                    ? " red-track"
                    : collateralRatio < 200
                      ? " orange-track"
                      : collateralRatio >= 200
                        ? " green-track"
                        : " ")
                }
                defaultValue={collateralRatio}
                marks={marks}
                value={collateralRatio}
                max={500}
                onChange={handleSliderChange}
                min={0}
                tooltipVisible={false}
              />
              <CustomInput
                defaultValue={collateralRatio}
                onChange={(event) => {
                  handleSliderChange(event.target?.value);
                }}
                placeholder="0"
                value={collateralRatio}
              />
              <span className="collateral-percentage">%</span>
            </div>
          </div>

          {/* <Info /> */}
          <div className="assets PoolSelect-btn">
            <div className="assets-form-btn text-center  mb-2">
              <Button
                loading={inProgress}
                disabled={
                  inProgress ||
                  // !pair ||
                  !Number(inAmount) ||
                  !Number(outAmount) ||
                  // validationError?.message ||
                  Number(collateralRatio) < 150
                }
                loading={inProgress}
                type="primary"
                className="btn-filled"
                onClick={() => handleCreate()}
              >
                Continue
              </Button>
            </div>
          </div>
        </div>

        <div className="details-right ">
          <PricePool />
          <VaultDetails />
        </div>
      </div>
    </>
  );
};
Mint.prototype = {
  lang: PropTypes.string.isRequired,
  setAmountIn: PropTypes.func.isRequired,
  setAmountOut: PropTypes.func.isRequired,
  setAssetIn: PropTypes.func.isRequired,
  setAssetOut: PropTypes.func.isRequired,
  setCollateralRatio: PropTypes.func.isRequired,
  setComplete: PropTypes.func.isRequired,
  setPair: PropTypes.func.isRequired,
  setVault: PropTypes.func.isRequired,
  address: PropTypes.string,
  balances: PropTypes.arrayOf(
    PropTypes.shape({
      denom: PropTypes.string.isRequired,
      amount: PropTypes.string,
    })
  ),
  collateralRatio: PropTypes.number,
  inAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  markets: PropTypes.arrayOf(
    PropTypes.shape({
      rates: PropTypes.shape({
        high: PropTypes.number,
        low: PropTypes.number,
        unsigned: PropTypes.bool,
      }),
      symbol: PropTypes.string,
      script_id: PropTypes.string,
    })
  ),
  outAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  pair: PropTypes.shape({
    denomIn: PropTypes.string,
    denomOut: PropTypes.string,
  }),
  pairs: PropTypes.shape({
    list: PropTypes.arrayOf(
      PropTypes.shape({
        denomIn: PropTypes.string,
        denomOut: PropTypes.string,
        liquidationRatio: PropTypes.string,
        id: PropTypes.shape({
          high: PropTypes.number,
          low: PropTypes.number,
          unsigned: PropTypes.bool,
        }),
      })
    ),
  }),
  refreshBalance: PropTypes.number.isRequired,
  vault: PropTypes.shape({
    collateral: PropTypes.shape({
      denom: PropTypes.string,
    }),
    debt: PropTypes.shape({
      denom: PropTypes.string,
    }),
    id: PropTypes.shape({
      low: PropTypes.number,
    }),
  }),
  vaults: PropTypes.arrayOf(
    PropTypes.shape({
      collateral: PropTypes.shape({
        amount: PropTypes.string,
        denom: PropTypes.string,
      }),
      debt: PropTypes.shape({
        amount: PropTypes.string,
        denom: PropTypes.string,
      }),
      id: PropTypes.shape({
        high: PropTypes.number,
        low: PropTypes.number,
        unsigned: PropTypes.bool,
      }),
    })
  ),
}
const stateToProps = (state) => {
  return {
    lang: state.language,
    address: state.account.address,
    pair: state.asset.pair,
    pairs: state.asset.pairs,
    inAmount: state.asset.inAmount,
    outAmount: state.asset.outAmount,
    markets: state.oracle.market.list,
    collateralRatio: state.asset.collateralRatio,
    balances: state.account.balances.list,
    vaults: state.account.vaults.list,
    vault: state.account.vault,
    refreshBalance: state.account.refreshBalance,
  };
};

const actionsToProps = {
  setPair,
  setVault,
  setComplete,
  setAssetIn,
  setAssetOut,
  setAmountIn,
  setAmountOut,
  setCollateralRatio,
};
export default connect(stateToProps, actionsToProps)(Mint);
