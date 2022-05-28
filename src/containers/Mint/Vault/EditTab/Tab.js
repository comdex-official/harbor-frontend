import "../index.scss";
import * as PropTypes from "prop-types";
import { Col, Row, SvgIcon } from "../../../../components/common";
import React, { useEffect, useState } from "react";
import { Button, message, Select, Slider } from "antd";
import TooltipIcon from "../../../../components/TooltipIcon";
import { iconNameFromDenom } from "../../../../utils/string";
import { amountConversion } from "../../../../utils/coin";
import { signAndBroadcastTransaction } from "../../../../services/helper";
import { defaultFee } from "../../../../services/transaction";
import { getAmount } from "../../../../utils/coin";
import { getTypeURL } from "../../../../services/transaction";
import CustomInput from "../../../../components/CustomInput";
import { marketPrice } from "../../../../utils/number";
import { ValidateInputNumber } from "../../../../config/_validation";
import { PRODUCT_ID } from "../../../../constants/common";
import { setExtendedPairVaultListData } from "../../../../actions/locker";
import {
  queryOwnerVaults,
  queryOwnerVaultsInfo,
} from "../../../../services/Mint/query";
import { connect } from "react-redux";
import { setPairs } from "../../../../actions/asset";
import { setAccountVaults } from "../../../../actions/account";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setBalanceRefresh } from "../../../../actions/account";
import { setOwnerVaultId, setOwnerVaultInfo } from "../../../../actions/locker";
import { useParams } from "react-router";
import Long from "long";
import { queryPairVault } from "../../../../services/asset/query";


const marks = {
  0: "0%",
  150: "Min - 150%",
  200: "Safe: 200%",
};

const Edit = ({
  address,
  pair,
  markets,
  ownerVaultId,
  ownerVaultInfo,
  setOwnerVaultId,
  setOwnerVaultInfo,
  setBalanceRefresh,
  refreshBalance,
}) => {
  const dispatch = useDispatch();
  const { pathVaultId } = useParams();

  const vault = useSelector((state) => state.account.vault);

  const userVault = useSelector(
    (state) => state.mint.userLockedVaultData.vault
  );
  const selectedExtentedPairVault = useSelector(
    (state) => state.locker.selectedExtentedPairVault
  );
  const selectedExtentedPairVaultListData = useSelector(
    (state) => state.locker.extenedPairVaultListData
  );

  const [inProgress, setInProgress] = useState(false);
  const [inputAmount, setInputAmount] = useState();
  const [editType, setEditType] = useState("deposit");
  const [inputValidationError, setInputValidationError] = useState();
  const [newCollateralRatio, setNewCollateralRatio] = useState();
  const [collateralRatio, setCollateralRatio] = useState(200);
  const [deposit, setDeposit] = useState();
  const [withdraw, setWithdraw] = useState();
  const [repay, setRepay] = useState();
  const [draw, setDraw] = useState();

  const marks = {
    0: "0%",
    150: "Min - 150%",
    200: "Safe: 200%",
  };

  console.log(pair);

  useEffect(() => {
    fetchQueryPairValut(pathVaultId);
  }, [address]);

  useEffect(() => {
    if (address && selectedExtentedPairVaultListData[0]?.id?.low) {
      getOwnerVaultId(
        PRODUCT_ID,
        address,
        selectedExtentedPairVaultListData[0]?.id?.low
      );
    }
  }, [address, vault]);

  useEffect(() => {
    if (ownerVaultId) {
      getOwnerVaultInfoByVaultId(ownerVaultId);
    }
  }, [address, ownerVaultId]);

  const resetValues = () => {
    setInputValidationError();
    setInputAmount();
    setDeposit();
    setWithdraw();
    setRepay();
    setDraw();
  };

  const collateralAssetBalance = ownerVaultInfo?.amountIn || 0;

  const debtAssetBalance = ownerVaultInfo?.amountOut || 0;

  const collateralPrice = marketPrice(markets, pair?.denomIn);

  const debtPrice = marketPrice(markets, pair?.denomOut);

  const handleSliderChange = (value, type = editType) => {
    const newRatio = value / 100; // converting value to ratio
    if (type === "deposit") {
      const newInput =
        (Number(ownerVaultInfo?.amountOut) * debtPrice * newRatio) /
        collateralPrice -
        Number(ownerVaultInfo?.amountIn);

      setNewCollateralRatio(value);
      setDeposit(amountConversion(newInput));
      setWithdraw(0);
      setDraw(0);
      setRepay(0);
      setInputValidationError(
        ValidateInputNumber(newInput, collateralAssetBalance)
      );
    } else if (type === "withdraw") {
      const newInput =
        Number(ownerVaultInfo?.amountIn) -
        (Number(ownerVaultInfo?.amountOut) * debtPrice * newRatio) /
        collateralPrice;

      setNewCollateralRatio(value);
      setWithdraw(amountConversion(newInput));
      setDeposit(0);
      setDraw(0);
      setRepay(0);
      setInputValidationError(
        ValidateInputNumber(newInput, ownerVaultInfo?.amountIn)
      );
    } else if (type === "repay") {
      const newInput =
        Number(ownerVaultInfo?.amountOut) -
        (Number(ownerVaultInfo?.amountIn) * collateralPrice) /
        (debtPrice * newRatio);

      setNewCollateralRatio(value);
      setRepay(amountConversion(newInput));
      setDeposit(0);
      setDraw(0);
      setWithdraw(0);
      setInputValidationError(ValidateInputNumber(newInput, debtAssetBalance));
    } else {
      const newInput =
        (Number(ownerVaultInfo?.amountIn) * collateralPrice) /
        (debtPrice * newRatio) -
        Number(ownerVaultInfo?.amountOut);

      setNewCollateralRatio(value);
      setDraw(amountConversion(newInput));
      setDeposit(0);
      setWithdraw(0);
      setRepay(0);
      setInputValidationError(ValidateInputNumber(newInput));
    }
  };

  const checkValidation = (value, type) => {
    if (type === "deposit") {
      const ratio =
        ((Number(ownerVaultInfo?.amountIn) + Number(getAmount(value))) *
          collateralPrice) /
        (Number(ownerVaultInfo?.amountOut) * debtPrice);

      setNewCollateralRatio((ratio * 100).toFixed(1));
      setInputValidationError(
        ValidateInputNumber(getAmount(value), collateralAssetBalance)
      );
    } else if (type === "withdraw") {
      const ratio =
        ((Number(ownerVaultInfo?.amountIn) - Number(getAmount(value))) *
          collateralPrice) /
        (Number(ownerVaultInfo?.amountOut) * debtPrice);

      setNewCollateralRatio((ratio * 100).toFixed(1));
      setInputValidationError(
        ValidateInputNumber(getAmount(value), ownerVaultInfo?.amountIn)
      );
    } else if (type === "repay") {
      const ratio =
        (Number(ownerVaultInfo?.amountIn) * collateralPrice) /
        ((Number(ownerVaultInfo?.amountOut) - Number(getAmount(value))) * debtPrice);

      setNewCollateralRatio((ratio * 100).toFixed(1));
      setInputValidationError(
        ValidateInputNumber(getAmount(value), debtAssetBalance)
      );
    } else {
      const ratio =
        (Number(ownerVaultInfo?.amountIn) * collateralPrice) /
        ((Number(ownerVaultInfo?.amountOut) + Number(getAmount(value))) * debtPrice);

      setNewCollateralRatio((ratio * 100).toFixed(1));
      setInputValidationError(ValidateInputNumber(getAmount(value)));
    }
  };

  // ******* Get Vault Query *********

  // *----------Get the owner vaultId by productId, pairId , and address----------

  const getOwnerVaultId = (productId, address, extentedPairId) => {
    queryOwnerVaults(productId, address, extentedPairId, (error, data) => {
      if (error) {
        message.error(error);
        return;
      }
      setOwnerVaultId(data?.vaultId);
    });
  };

  // *----------Get pair vault data by extended pairVault Id----------
  const fetchQueryPairValut = (pairVaultId) => {
    queryPairVault(pairVaultId, (error, data) => {
      if (error) {
        message.error(error);
        return;
      }
      dispatch(setExtendedPairVaultListData(data?.pairVault));
    });
  };

  // *----------Get the owner vaultDetails by ownervaultId----------

  const getOwnerVaultInfoByVaultId = (ownerVaultId) => {
    queryOwnerVaultsInfo(ownerVaultId, (error, data) => {
      if (error) {
        message.error(error);
        return;
      }
      setOwnerVaultInfo(data.vault);
    });
  };

  const handleSubmit = () => {
    setInProgress(true);

    signAndBroadcastTransaction(
      {
        message: {
          typeUrl: getTypeURL(editType),
          value: {
            from: address,
            appMappingId: Long.fromNumber(PRODUCT_ID),
            extendedPairVaultId: Long.fromNumber(
              selectedExtentedPairVaultListData[0]?.id?.low
            ),
            userVaultid: ownerVaultId,
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
        message.success("success");
        getOwnerVaultInfoByVaultId(ownerVaultId);
      }
    );
  };

  return (
    <>
      <div className="edit-tab-card">
        <div className="borrw-content-card">
          <div className="borrow-edit-head">
            <div className="borrowedithead-colum">
              <label>Collateral</label>
              <div className="assets-col">
                <div className="assets-icons">
                  <div className="assets-icons-inner">
                    <SvgIcon name={iconNameFromDenom(pair && pair?.denomIn)} />
                  </div>
                </div>
                <h2>{amountConversion(ownerVaultInfo?.amountIn || 0)}</h2>
              </div>
            </div>
            <div className="borrowedithead-colum">
              <label>Borrowed</label>
              <div className="assets-col">
                <div className="assets-icons">
                  <div className="assets-icons-inner">
                    <SvgIcon name={iconNameFromDenom("ucmst")} />
                  </div>
                </div>
                <h2>{amountConversion(ownerVaultInfo?.amountOut || 0)}</h2>
              </div>
            </div>
          </div>
          <div className="brrow-edit-form">
            <Row>
              <Col sm="6" className="mb-3">
                <label>
                  Deposit
                  <TooltipIcon text="Deposit collateral to reduce chances of liquidation" />
                </label>
                <CustomInput
                  value={deposit}
                  onChange={(event) => {
                    setInputAmount(event.target.value);
                    setDeposit(event.target.value);
                    setWithdraw(0);
                    setDraw(0);
                    setRepay(0);
                    setInputValidationError(event.target.value);
                    checkValidation(event.target.value, editType);
                  }}
                  validationError={inputValidationError}
                  onFocus={() => setEditType("deposit")}
                />
              </Col>
              <Col sm="6" className="mb-3">
                <label>
                  Withdraw
                  <TooltipIcon text="Withdrawing your collateral would increase chances of liquidation" />
                </label>
                <CustomInput
                  value={withdraw}
                  onChange={(event) => {
                    setInputAmount(event.target.value);
                    setWithdraw(event.target.value);
                    setDeposit(0);
                    setDraw(0);
                    setRepay(0);
                    checkValidation(event.target.value, editType);
                  }}
                  onFocus={() => setEditType("withdraw")}
                />
              </Col>
              <Col sm="6" className="mb-3">
                <label>
                  Draw
                  <TooltipIcon text="Borrow more cAsset from your deposited collateral" />
                </label>
                <CustomInput
                  value={draw}
                  onChange={(event) => {
                    setInputAmount(event.target.value);
                    setDraw(event.target.value);
                    setWithdraw(0);
                    setDeposit(0);
                    setRepay(0);
                    checkValidation(event.target.value, editType);
                  }}
                  onFocus={() => setEditType("draw")}
                />
              </Col>
              <Col sm="6" className="mb-3">
                <div className="label_max_button">
                  <label>
                    Repay
                    <TooltipIcon text="Partially repay your borrowed cAsset" />
                  </label>
                  <div className="maxhalf">
                    <button
                      className="ant-btn active"
                    >
                      Max
                    </button>
                  </div>
                </div>
                <CustomInput
                  value={repay}
                  onChange={(event) => {
                    setInputAmount(event.target.value);
                    setRepay(event.target.value);
                    setWithdraw(0);
                    setDraw(0);
                    setDeposit(0);
                    checkValidation(event.target.value, editType);
                  }}
                  onFocus={() => setEditType("repay")}
                />
              </Col>
            </Row>
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
                  defaultValue="150"
                  marks={marks}
                  value={newCollateralRatio}
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
                  value={newCollateralRatio}
                />
                <span className="collateral-percentage">%</span>
              </div>
            </div>
          </div>
          <div className="assets-form-btn">
            <Button
              type="primary"
              className="btn-filled"
              disabled={
                inProgress ||
                inputValidationError?.message ||
                !Number(inputAmount)
              }
              onClick={() => handleSubmit()}
            >
              {editType}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
Edit.propTypes = {
  setAccountVaults: PropTypes.func.isRequired,
  setPairs: PropTypes.func.isRequired,
  lang: PropTypes.string.isRequired,
  setBalanceRefresh: PropTypes.func.isRequired,
  refreshBalance: PropTypes.number.isRequired,
  address: PropTypes.string,
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
  validationError: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      message: PropTypes.string.isRequired,
    }),
  ]),
  ownerVaultId: PropTypes.string,
  ownerVaultInfo: PropTypes.array,
};
const stateToProps = (state) => {
  return {
    lang: state.language,
    address: state.account.address,
    pair: state.asset.pair,
    pairs: state.asset.pairs,
    refreshBalance: state.account.refreshBalance,
    markets: state.oracle.market.list,
    balances: state.account.balances.list,
    ownerVaultId: state.locker.ownerVaultId,
    ownerVaultInfo: state.locker.ownerVaultInfo,
  };
};

const actionsToProps = {
  setPairs,
  setAccountVaults,
  setBalanceRefresh,
  setOwnerVaultId,
  setOwnerVaultInfo,
};
export default connect(stateToProps, actionsToProps)(Edit);
