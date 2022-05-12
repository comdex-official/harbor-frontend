import "../index.scss";
import { Col, Row, SvgIcon } from "../../../components/common";
import React, { useEffect, useState } from "react";
import variables from "../../../utils/variables";
import { Button, message, Select, Slider } from "antd";
import TooltipIcon from "../../../components/TooltipIcon";
import { iconNameFromDenom, toDecimals } from "../../../utils/string";
import { amountConversion, denomConversion } from "../../../utils/coin";
import { getDenomBalance } from "../../../utils/coin";
import { signAndBroadcastTransaction } from "../../../services/helper";
import { defaultFee } from "../../../services/transaction";
import { getAmount } from "../../../utils/coin";
import { getTypeURL } from "../../../services/transaction";
import { queryVault } from "../../../services/vault/query";
import CustomInput from "../../../components/CustomInput";
import { decimalConversion, marketPrice } from "../../../utils/number";
import { ValidateInputNumber } from "../../../config/_validation";
import { DOLLAR_DECIMALS } from "../../../constants/common";
import { comdex } from "../../../config/network";
import Snack from "../../../components/common/Snack";

const Option = Select.Option;

const marks = {
  0: "0%",
  150: "Min - 150%",
  200: "Safe: 200%",
};

const EditTab = ({
  lang,
  address,
  vaults,
  vault,
  markets,
  balances,
  setVault,
  setBalanceRefresh,
  refreshBalance,
}) => {
  const [inProgress, setInProgress] = useState(false);
  const [inputAmount, setInputAmount] = useState();
  const [editType, setEditType] = useState("deposit");
  const [inputValidationError, setInputValidationError] = useState();
  const [newCollateralRatio, setNewCollateralRatio] = useState();

  useEffect(() => {
    if (vault.id) {
      fetchVault(vault.id);
    }
  }, [vaults]);

  const resetValues = () => {
    setInputValidationError();
    setInputAmount();
  };

  const fetchVault = (id) => {
    queryVault(id, (error, result) => {
      if (error) {
        message.error(error);
        return;
      }

      setVault(result?.vaultInfo);

      const currentCollateral = (
        decimalConversion(result?.vaultInfo?.collateralizationRatio) * 100
      ).toFixed(1);
      setNewCollateralRatio(currentCollateral);
    });
  };

  const collateralAssetBalance =
    getDenomBalance(balances, vault?.collateral?.denom) || 0;

  const debtAssetBalance = getDenomBalance(balances, vault?.debt?.denom) || 0;

  const collateralPrice = marketPrice(markets, vault?.collateral?.denom);
  const debtPrice = marketPrice(markets, vault?.debt?.denom);

  const handleSubmit = () => {
    setInProgress(true);

    signAndBroadcastTransaction(
      {
        message: {
          typeUrl: getTypeURL(editType),
          value: {
            from: address,
            id: vault?.id,
            amount: getAmount(inputAmount),
          },
        },
        fee: defaultFee(),
        memo: "",
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

        resetValues();
        setBalanceRefresh(refreshBalance + 1);
        message.success(
          <Snack
            message={variables[lang].tx_success}
            explorerUrlToTx={comdex.explorerUrlToTx}
            hash={result?.transactionHash}
          />
        );

        if (vault?.id) {
          fetchVault(vault?.id);
        }
      }
    );
  };

  const handleSliderChange = (value, type = editType) => {
    const newRatio = value / 100; // converting value to ratio
    if (type === "deposit") {
      const newInput =
        (Number(vault?.debt?.amount) * debtPrice * newRatio) / collateralPrice -
        Number(vault?.collateral?.amount);

      setNewCollateralRatio(value);
      setInputAmount(amountConversion(newInput));
      setInputValidationError(
        ValidateInputNumber(newInput, collateralAssetBalance)
      );
    } else if (type === "withdraw") {
      const newInput =
        Number(vault?.collateral?.amount) -
        (Number(vault?.debt?.amount) * debtPrice * newRatio) / collateralPrice;

      setNewCollateralRatio(value);
      setInputAmount(amountConversion(newInput));
      setInputValidationError(
        ValidateInputNumber(newInput, vault?.collateral?.amount)
      );
    } else if (type === "repay") {
      const newInput =
        Number(vault?.debt?.amount) -
        (Number(vault?.collateral?.amount) * collateralPrice) /
          (debtPrice * newRatio);

      setNewCollateralRatio(value);
      setInputAmount(amountConversion(newInput));
      setInputValidationError(
        ValidateInputNumber(newInput, debtAssetBalance)
      );
    } else {
      const newInput =
        (Number(vault?.collateral?.amount) * collateralPrice) /
          (debtPrice * newRatio) -
        Number(vault?.debt?.amount);

      setNewCollateralRatio(value);
      setInputAmount(amountConversion(newInput));
      setInputValidationError(ValidateInputNumber(newInput));
    }
  };

  const handleInputChange = (value) => {
    value = toDecimals(value).toString().trim();
    setInputAmount(value);
    checkValidation(value, editType);
  };

  const checkValidation = (value, type) => {
    if (type === "deposit") {
      const ratio =
        ((Number(vault?.collateral?.amount) + Number(getAmount(value))) *
          collateralPrice) /
        (Number(vault?.debt?.amount) * debtPrice);

      setNewCollateralRatio((ratio * 100).toFixed(1));
      setInputValidationError(
        ValidateInputNumber(getAmount(value), collateralAssetBalance)
      );
    } else if (type === "withdraw") {
      const ratio =
        ((Number(vault?.collateral?.amount) - Number(getAmount(value))) *
          collateralPrice) /
        (Number(vault?.debt?.amount) * debtPrice);

      setNewCollateralRatio((ratio * 100).toFixed(1));
      setInputValidationError(
        ValidateInputNumber(getAmount(value), vault?.collateral?.amount)
      );
    } else if (type === "repay") {
      const ratio =
        (Number(vault?.collateral?.amount) * collateralPrice) /
        ((Number(vault?.debt?.amount) - Number(getAmount(value))) * debtPrice);

      setNewCollateralRatio((ratio * 100).toFixed(1));
      setInputValidationError(
        ValidateInputNumber(getAmount(value), debtAssetBalance)
      );
    } else {
      const ratio =
        (Number(vault?.collateral?.amount) * collateralPrice) /
        ((Number(vault?.debt?.amount) + Number(getAmount(value))) * debtPrice);

      setNewCollateralRatio((ratio * 100).toFixed(1));
      setInputValidationError(ValidateInputNumber(getAmount(value)));
    }
  };

  const showPriceInDollers = () => {
    const denom =
      editType === "deposit" || editType === "withdraw"
        ? vault?.collateral?.denom
        : vault?.debt?.denom;

    return `1 ${denomConversion(denom)} ≈ ${marketPrice(markets, denom)} ${
      variables[lang].USD
    }`;
  };

  const handleOptionChange = (type) => {
    setEditType(type);
    checkValidation(inputAmount, type);
  };

  return (
    <div className="borrw-content-wapper">
      <div className="borrowcard-header">
        <div className="head-colums">
          <div className="head-icons">
            <div className="head-icons-inner">
              <SvgIcon name="collateral-icon" viewbox="0 0 36.444 36.996" />
            </div>
          </div>
          <label>{variables[lang].collateral}</label>
          <p>{amountConversion(vault?.collateral?.amount || 0)}</p>
        </div>
        <div className="head-colums">
          <div className="head-icons">
            <div className="head-icons-inner">
              <SvgIcon name="borrowed-icon" viewbox="0 0 39.009 39" />
            </div>
          </div>
          <label>{variables[lang].borrowed}</label>
          <p>{amountConversion(vault?.debt?.amount || 0)}</p>
        </div>
        <div className="head-colums">
          <div className="head-icons">
            <div className="head-icons-inner">
              <SvgIcon name={iconNameFromDenom(vault?.collateral?.denom)} />{" "}
            </div>
          </div>
          <label>{denomConversion(vault?.collateral?.denom)}</label>
          <p>{amountConversion(collateralAssetBalance)}</p>
        </div>
        <div className="head-colums">
          <div className="head-icons">
            <div className="head-icons-inner">
              <SvgIcon name="gold-icon" />
            </div>
          </div>
          <label>{denomConversion(vault?.debt?.denom)}</label>
          <p>{amountConversion(debtAssetBalance)}</p>
        </div>
      </div>
      <div className="borrowcard-content">
        <div className="assets-select-card">
          <div className="assets-left">
            <div className="assets-select-wrapper">
              <Select
                className="assets-select center-select-text"
                dropdownClassName="asset-select-dropdown"
                defaultActiveFirstOption={true}
                suffixIcon={
                  <SvgIcon name="arrow-down" viewbox="0 0 19.244 10.483" />
                }
                defaultValue="deposit"
                onChange={(value) => handleOptionChange(value)}
              >
                <Option value="deposit">Deposit</Option>
                <Option value="withdraw">Withdraw</Option>
                <Option value="draw">Draw</Option>
                <Option value="repay">Repay</Option>
              </Select>
            </div>
          </div>
          <div className="assets-right swap-assets-right">
            <div>
              <CustomInput
                className="assets-select-input with-select mt-0"
                value={inputAmount}
                validationError={inputValidationError}
                onChange={(event) => handleInputChange(event.target.value)}
              />
              <small>{showPriceInDollers()}</small>
            </div>
          </div>
        </div>
        <div className="slider-bar mt-3">
          <label>
            {variables[lang].collateral_ratio}{" "}
            <TooltipIcon text={variables[lang].liquidate_below_minimum} />
          </label>
          <div className="slider-numbers">
            <Slider
              className={"comdex-slider borrow-comdex-slider " + (newCollateralRatio <= 150 ? " red-track":(newCollateralRatio < 200 ? " orange-track": (newCollateralRatio >= 200 ? " green-track": " ")))}
              defaultValue="150"
              marks={marks}
              max={500}
              onChange={handleSliderChange}
              value={newCollateralRatio}
              tooltipVisible={false}
            />
            <CustomInput
              defaultValue={newCollateralRatio}
              placeholder="0"
              onChange={(event) => handleSliderChange(event.target.value)}
              value={newCollateralRatio}
            />
            <span className="collateral-percentage">%</span>
          </div>
        </div>
        <Row>
          <Col sm="10" className="mt-3 mx-auto card-bottom-details">
            <Row className="mt-1">
              <Col>
                <label>{variables[lang].oracle_price}</label>
              </Col>
              <Col className="text-right">
                {debtPrice?.toFixed(DOLLAR_DECIMALS)} {variables[lang].USD}
              </Col>
            </Row>
          </Col>
        </Row>
        <div className="assets-form-btn">
          <Button
            disabled={
              inProgress ||
              inputValidationError?.message ||
              !Number(inputAmount) ||
              inputAmount === amountConversion(vault?.debt?.amount) ||
              Number(newCollateralRatio) < 150 
            }
            type="primary"
            className="btn-filled"
            loading={inProgress}
            onClick={() => handleSubmit()}
          >
            {variables[lang][editType]}{" "}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditTab;