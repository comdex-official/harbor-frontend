import "../index.scss";
import { Col, Row, SvgIcon } from "../../../../components/common";
import React, { useEffect, useState } from "react";
import variables from "../../../../utils/variables";
import { Button, message, Select, Slider } from "antd";
import TooltipIcon from "../../../../components/TooltipIcon";
import { iconNameFromDenom, toDecimals } from "../../../../utils/string";
import { amountConversion, denomConversion } from "../../../../utils/coin";
import { getDenomBalance } from "../../../../utils/coin";
import { signAndBroadcastTransaction } from "../../../../services/helper";
import { defaultFee } from "../../../../services/transaction";
import { getAmount } from "../../../../utils/coin";
import { getTypeURL } from "../../../../services/transaction";
import { queryVault } from "../../../../services/vault/query";
import CustomInput from "../../../../components/CustomInput";
import { decimalConversion, marketPrice } from "../../../../utils/number";
import { ValidateInputNumber } from "../../../../config/_validation";
import { DOLLAR_DECIMALS } from "../../../../constants/common";
import { comdex } from "../../../../config/network";
import Snack from "../../../../components/common/Snack";

const Option = Select.Option;

const marks = {
  0: "0%",
  150: "Min - 150%",
  200: "Safe: 200%",
};

const Edit = ({
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
  const [collateralRatio, setCollateralRatio] = useState(200);

  const marks = {
    0: "0%",
    150: "Min - 150%",
    200: "Safe: 200%",
  };

  const handleSliderChange = (value) => {
    setCollateralRatio(value);
    // setAmountOut(
    //   calculateAmountOut(
    //     inAmount,
    //     selectedTokenPrice,
    //     value / 100,
    //     marketPrice(markets, pair && pair.denomOut)
    //   )
    // );
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
                    <SvgIcon name={iconNameFromDenom("uatom")} />
                  </div>
                </div>
                <h2>7647892</h2>
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
                <h2>45732</h2>
              </div>
            </div>
          </div>
          <div className="brrow-edit-form">
            <Row>
              <Col sm="6" className="mb-3">
                <label>
                  Deposite
                  <TooltipIcon text="Deposit collateral to reduce chances of liquidation" />
                </label>
                <CustomInput
                  value={0}
                  // onChange={(event) => {
                  //   setDeposit(event.target.value);
                  //   setWithdraw(0);
                  //   setDraw(0);
                  //   setRepay(0);
                  // }}
                  onFocus={() => setEditType("deposit")}
                />
              </Col>
              <Col sm="6" className="mb-3">
                <label>
                  Withdraw
                  <TooltipIcon text="Withdrawing your collateral would increase chances of liquidation" />
                </label>
                <CustomInput
                  value={0}
                  // onChange={(event) => {
                  //   setWithdraw(event.target.value);
                  //   setDeposit(0);
                  //   setDraw(0);
                  //   setRepay(0);
                  // }}
                  onFocus={() => setEditType("withdraw")}
                />
              </Col>
              <Col sm="6" className="mb-3">
                <label>
                  Draw
                  <TooltipIcon text="Borrow more cAsset from your deposited collateral" />
                </label>
                <CustomInput
                  value={0}
                  // onChange={(event) => {
                  //   setDraw(event.target.value);
                  //   setWithdraw(0);
                  //   setDeposit(0);
                  //   setRepay(0);
                  // }}
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
                      // onClick={() => handleMaxClick()}
                    >
                      Max
                    </button>
                  </div>
                </div>
                <CustomInput
                  value={0}
                  // onChange={(event) => {
                  //   setRepay(event.target.value);
                  //   setWithdraw(0);
                  //   setDraw(0);
                  //   setDeposit(0);
                  // }}
                  onFocus={() => setEditType("repay")}
                />
              </Col>
            </Row>
            {/* <Row> */}
            <div className="intrest-rate-container mt-4">
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
            {/* </Row> */}
          </div>
          <div className="assets-form-btn">
            <Button
              // disabled={
              //   inProgress ||
              //   (!Number(withdraw) &&
              //     !Number(deposit) &&
              //     !Number(draw) &&
              //     !Number(repay))
              // }
              type="primary"
              className="btn-filled"
              // onClick={() => setCautionNoticeValues(true, false)}
            >
              {editType}
            </Button>
            {/* <CautionNotice inProgress={inProgress} handleClick={handleSubmit} /> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Edit;
