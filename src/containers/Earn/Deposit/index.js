import { Button } from "antd";
import React, { useState } from "react";
import { Col, Row, SvgIcon } from "../../../components/common";
import CustomInput from "../../../components/CustomInput";
import TooltipIcon from "../../../components/TooltipIcon";
import {
  amountConversionWithComma,
  denomConversion,
  getAmount,
} from "../../../utils/coin";
import { iconNameFromDenom } from "../../../utils/string";
import variables from "../../../utils/variables";
import Info from "../Info";
import "./index.scss";

const Deposit = ({ lang, reverse, spotPrice }) => {
  const [firstInput, setFirstInput] = useState();
  const [secondInput, setSecondInput] = useState();
  const [inProgress, setInProgress] = useState(false);
  const [inputValidationError, setInputValidationError] = useState();
  const [outputValidationError, setOutputValidationError] = useState();

  const getOutputPrice = () => {
    return reverse ? spotPrice : 1 / spotPrice; // calculating price from pool
  };

  return (
    <>
      <Col>
        <div className="farm-content-card earn-deposite-card">
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
                        <SvgIcon name={iconNameFromDenom("ucmdx")} /> CMST
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
              <div className="title">Current intrest rate</div>
              <div className="value">6%</div>
            </Row>
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
                Deposit
              </Button>
            </div>
          </div>
        </div>
      </Col>
    </>
  );
};

export default Deposit;
