import { Button, Slider } from "antd";
import React, { useState } from "react";
import { Col, Row, SvgIcon } from "../../../../components/common";
import CustomInput from "../../../../components/CustomInput";
import TooltipIcon from "../../../../components/TooltipIcon";
import {
  amountConversionWithComma,
  denomConversion,
  getAmount,
} from "../../../../utils/coin";
import { iconNameFromDenom } from "../../../../utils/string";
import variables from "../../../../utils/variables";
import "./index.scss";
import PricePool from "./PricePool";

import { List, Select, Input, Progress, Switch } from "antd";
import { setAmountOut } from "../../../../actions/asset";
import { marketPrice } from "../../../../utils/number";
import "./index.scss";
import VaultDetails from "./VaultDetails";

const Mint = ({ lang, reverse, spotPrice }) => {
  const [firstInput, setFirstInput] = useState();
  const [secondInput, setSecondInput] = useState();
  const [inProgress, setInProgress] = useState(false);
  const [inputValidationError, setInputValidationError] = useState();
  const [outputValidationError, setOutputValidationError] = useState();
  const [collateralRatio, setCollateralRatio] = useState(200);

  const marks = {
    0: "0%",
    150: "Min - 150%",
    200: "Safe: 200%",
  };

  const getOutputPrice = () => {
    return reverse ? spotPrice : 1 / spotPrice; // calculating price from pool
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
                  {amountConversionWithComma("20000020")} CMST
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
                  value={firstInput}
                  onChange={(event) =>
                    // handleFirstInputChange(event.target.value)
                    console.log(event.target.value)
                  }
                  validationError={inputValidationError}
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
                  {amountConversionWithComma("20000020")} CMST
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
                  value={firstInput}
                  onChange={(event) =>
                    // handleFirstInputChange(event.target.value)
                    console.log(event.target.value)
                  }
                  validationError={inputValidationError}
                />
                <small>$ 0.00</small>
              </div>
            </div>
          </div>

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

          {/* <Info /> */}
          <div className="assets PoolSelect-btn">
            <div className="assets-form-btn text-center  mb-2">
              <Button
                loading={inProgress}
                // disabled={
                //   inProgress ||
                //   !pool?.id ||
                //   !Number(firstInput) ||
                //   !Number(secondInput) ||
                //   inputValidationError?.message ||
                //   outputValidationError?.message
                // }
                type="primary"
                className="btn-filled"
                onClick={() => console.log("Farm")}
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

export default Mint;
