import { Button, Slider, message } from "antd";
import * as PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Row, SvgIcon } from "../../../../components/common";
import CustomInput from "../../../../components/CustomInput";
import TooltipIcon from "../../../../components/TooltipIcon";
import { useParams } from "react-router";
import {
  amountConversion,
  amountConversionWithComma,
  getAmount,
  getDenomBalance,
} from "../../../../utils/coin";
import { denomToSymbol, iconNameFromDenom, toDecimals } from "../../../../utils/string";
import variables from "../../../../utils/variables";
import "./index.scss";
import PricePool from "./PricePool";
import {
  setPair,
  setAssetIn,
  setAssetOut,
  setAmountIn,
  setAmountOut,
  setCollateralRatio,
} from "../../../../actions/asset";
import { decimalConversion, marketPrice } from "../../../../utils/number";
import "./index.scss";
import VaultDetails from "./VaultDetails";
import { connect, useDispatch } from "react-redux";
import { ValidateInputNumber } from "../../../../config/_validation";
import { setComplete } from "../../../../actions/swap";
import { setVault } from "../../../../actions/account";
import { comdex } from "../../../../config/network";
import { DEFAULT_FEE, DOLLAR_DECIMALS, PRODUCT_ID } from "../../../../constants/common";
import { signAndBroadcastTransaction } from "../../../../services/helper";
import { getTypeURL } from "../../../../services/transaction";
import Snack from "../../../../components/common/Snack";
import { useSelector } from "react-redux";
import Long from "long";
import { CMDX_PRICE, CMST_PRICE } from "../../../../services/oracle/price";
import { queryPair, queryPairVault } from "../../../../services/asset/query";
import { setExtendedPairVaultListData, setSelectedExtentedPairvault } from "../../../../actions/locker";

const Mint = ({
  lang,
  address,
  pair,
  balances,
  setPair,
  setAmountIn,
  setAmountOut,
  setComplete,
  inAmount,
  outAmount,
  markets,
  collateralRatio,
  setCollateralRatio,
  vault,
  refreshBalance,
}) => {
  // pathVaultId ----> extentedPairvaultId
  const { pathVaultId } = useParams();


  const [inProgress, setInProgress] = useState(false);
  const [validationError, setValidationError] = useState();
  const [loading, setLoading] = useState(false);
  const [currentExtentedVaultdata, setCurrentExtentedVaultdata] = useState();

  const dispatch = useDispatch();
  const selectedExtentedPairVaultListData = useSelector((state) => state.locker.extenedPairVaultListData);
  const pairId = selectedExtentedPairVaultListData && selectedExtentedPairVaultListData[0]?.pairId?.low;



  const onChange = (value) => {
    value = toDecimals(value).toString().trim();
    handleAmountInChange(value);
    setValidationError(
      ValidateInputNumber(getAmount(value), collateralAssetBalance)
    );
  };

  // !change cmdx price value here for get actual oracle price 
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
        marketPrice(markets, pair && pair?.denomOut)
      )
    );
  };

  const collateralAssetBalance = getDenomBalance(balances, pair && pair?.denomIn) || 0;
  const stableAssetBalance = getDenomBalance(balances, 'ucmst') || 0;

  const calculateAmountOut = (
    inAmount,
    inAssetPrice,
    ratio,
    amountOutPrice
  ) => {
    const amount = (inAmount * inAssetPrice) / (ratio * amountOutPrice);
    return ((isFinite(amount) && amount) || 0).toFixed(6);
  };

  const selectedTokenPrice = marketPrice(markets, pair && pair?.denomIn);
  let minCrRatio = decimalConversion(selectedExtentedPairVaultListData[0]?.minCr) * 100;
  minCrRatio = Number(minCrRatio);
  let safeCrRatio = minCrRatio + 50;

  const showInAssetValue = () => {
    const oralcePrice = marketPrice(markets, pair?.denomIn);
    const total = oralcePrice * inAmount;

    return `≈ $${Number(total && isFinite(total) ? total : 0).toFixed(
      DOLLAR_DECIMALS
    )}`;
  };

  const showOutAssetValue = () => {
    const oralcePrice = marketPrice(markets, pair?.denomOut);
    const total = oralcePrice * outAmount;

    return `≈ $${Number(total && isFinite(total) ? total : 0).toFixed(
      DOLLAR_DECIMALS
    )}`;
  };


  const handleSliderChange = (value) => {
    setCollateralRatio(value);
    setAmountOut(
      calculateAmountOut(
        inAmount,
        selectedTokenPrice,
        value / 100,
        marketPrice(markets, pair && pair?.denomOut)
      )
    );
  };

  const handleMaxClick = () => {
    if (pair && pair?.denomIn === comdex.coinMinimalDenom) {
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
            appMappingId: Long.fromNumber(PRODUCT_ID),
            extendedPairVaultId: Long.fromNumber(pathVaultId),
            amountIn: getAmount(inAmount),
            amountOut: getAmount(outAmount),
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
          message.error(error);
          resetValues();
          return;
        }

        if (result?.code) {
          message.info(result?.rawLog);
          resetValues();
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

  useEffect(() => {
    resetValues()

    fetchQueryPairValut(pathVaultId);
    if (pairId) {
      getAssetDataByPairId(pairId);
    }
  }, [address, pairId, refreshBalance])

  // *******Get Vault Query *********

  // *----------Get pair vault data by extended pairVault Id----------
  const fetchQueryPairValut = (pairVaultId) => {
    setLoading(true)
    queryPairVault(pairVaultId, (error, data) => {
      if (error) {
        message.error(error);
        return;
      }
      setCurrentExtentedVaultdata(data?.pairVault)
      dispatch(setExtendedPairVaultListData(data?.pairVault))
      dispatch(setSelectedExtentedPairvault(data?.pairVault))
      setLoading(false)
    })
  }

  // *----------Get the asset data by pairId----------

  const getAssetDataByPairId = (pairId) => {
    setLoading(true)
    queryPair(pairId, (error, data) => {
      if (error) {
        message.error(error);
        return;
      }
      setPair(data?.pairInfo)
    })
  }

  useEffect(() => {
    resetValues();
  }, []);

  useEffect(() => {
    setCollateralRatio(safeCrRatio);
  }, [safeCrRatio]);


  const marks = {
    0: "0%",
    [minCrRatio]: `Min`,
    [safeCrRatio]: `Safe`,
  };


  return (
    <>
      <div className="details-wrapper">
        <div className="details-left farm-content-card earn-deposite-card vault-mint-card">
          <div className="mint-title">Configure Your Vault</div>
          <div className="assets-select-card">
            <div className="assets-left">
              <label className="leftlabel">
                Deposit
              </label>
              <div className="assets-select-wrapper">
                {/* Icon Container Start  */}
                <div className="farm-asset-icon-container">
                  <div className="select-inner">
                    <div className="svg-icon">
                      <div className="svg-icon-inner">
                        <SvgIcon name={!loading ? iconNameFromDenom(pair && pair?.denomIn) : ""} />{" "}
                        <span> {!loading ? denomToSymbol(pair && pair?.denomIn) : "Loading..."}</span>
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
                  {amountConversionWithComma(collateralAssetBalance)} {denomToSymbol(pair && pair?.denomIn)}
                </span>
                <div className="maxhalf">
                  <Button
                    className="active"
                    onClick={() =>
                      handleMaxClick()
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
                    onChange(event.target.value)
                  }
                  validationError={validationError}
                />
                {/* <small>$ 0.00</small> */}
                <small>$ {showInAssetValue()}</small>
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
                Withdrawable
                <span className="ml-1">
                  {amountConversionWithComma(stableAssetBalance)} CMST
                </span>
                <div className="maxhalf">
                  <Button
                    className="active"
                    onClick={() => {
                      handleMaxClick()
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
                {/* <small>$ 0.00</small> */}
                <small>$ {showOutAssetValue()}</small>
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
                  (collateralRatio <= minCrRatio
                    ? " red-track"
                    : collateralRatio < safeCrRatio
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
                  !pair ||
                  !Number(inAmount) ||
                  !Number(outAmount) ||
                  validationError?.message ||
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
          <VaultDetails item={currentExtentedVaultdata} />
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
