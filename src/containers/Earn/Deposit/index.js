import { Button, Input, message, Select } from "antd";
import *  as PropTypes from 'prop-types';
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Col, Row, SvgIcon } from "../../../components/common";
import CustomInput from "../../../components/CustomInput";
import TooltipIcon from "../../../components/TooltipIcon";
import { ValidateInputNumber } from "../../../config/_validation";
import {
  amountConversionWithComma,
  denomConversion,
  getAmount,
  getDenomBalance,
} from "../../../utils/coin";
import { iconNameFromDenom, toDecimals } from "../../../utils/string";
import variables from "../../../utils/variables";
import Info from "../Info";
import { setAssets, setPair } from "../../../actions/asset";
import { setWhiteListedAssets, setAllWhiteListedAssets } from '../../../actions/locker'
import "./index.scss";
import { queryAssets } from "../../../services/asset/query";
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from "../../../constants/common";
import { queryLockerWhiteListedAssetByProduct, queryLockerWhiteListedAssetByProductId } from "../../../services/locker/query";
import { queryAllBalances } from "../../../services/bank/query";
import { comdex } from "../../../config/network";

const Deposit = ({
  lang,
  reverse,
  spotPrice,
  balances,
  pair,
  address,
  setAssets,
  assets,
  setWhiteListedAssets,
  setAllWhiteListedAssets,
  allWhiteListedAssets,
  whiteListedAsset,
}) => {
  const [firstInput, setFirstInput] = useState();
  const [secondInput, setSecondInput] = useState();
  const [inProgress, setInProgress] = useState(false);
  const [inputValidationError, setInputValidationError] = useState();
  const [outputValidationError, setOutputValidationError] = useState();
  const [poolBalance, setLocalPoolBalance] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState();

  // const [whiteListedAssetData, setWhiteListedData] = useState();
  const whiteListedAssetData = [];
  const { Option } = Select;

  const getOutputPrice = () => {
    return reverse ? spotPrice : 1 / spotPrice; // calculating price from pool
  };

  const getAssetDenom = () => {
    let filterAssets =
      assets?.filter((item, index) => {
        return (
          item.id.low === whiteListedAsset[index]?.low)
      })
    whiteListedAssetData.push(filterAssets);
    console.log("Filter Assets", filterAssets);
  }

  const firstAssetAvailableBalance = getDenomBalance(balances, pair?.baseCoinDenom) || 0;

  const handleFirstInputChange = (value) => {
    value = toDecimals(value).toString().trim();

    setInputValidationError(
      ValidateInputNumber(
        Number(getAmount(value)),
        firstAssetAvailableBalance,
        "macro"
      )
    );

    // const numberOfTokens = (value * getOutputPrice()).toFixed(6);
    setFirstInput(value);

    // setOutputValidationError(
    //   ValidateInputNumber(
    //     Number(getAmount(numberOfTokens)),
    //     secondAssetAvailableBalance,
    //     "macro"
    //   )
    // );
    // isFinite(Number(numberOfTokens)) && setSecondInput(numberOfTokens);
  };

  const handleOfferCoinDenomChange = (value) => {

  };


  useEffect(() => {
    fetchAssets(
      (DEFAULT_PAGE_NUMBER - 1) * DEFAULT_PAGE_SIZE,
      DEFAULT_PAGE_SIZE,
      true,
      false
    );
    // fetchWhiteListedAsset()
    fetchWhiteListedAssetByid(1)
  }, [address]);

  const fetchAssets = (offset, limit, countTotal, reverse) => {
    setInProgress(true);
    queryAssets(offset, limit, countTotal, reverse, (error, data) => {
      setInProgress(false);
      if (error) {
        message.error(error);
        return;
      }
      // console.log("All Assets", data.assets);

      setAssets(data.assets, data.pagination);
    });
  };

  // const fetchWhiteListedAsset = () => {
  //   setInProgress(true);
  //   queryLockerWhiteListedAssetByProduct((error, data) => {
  //     if (error) {
  //       message.error(error);
  //       return;
  //     }
  //     setAllWhiteListedAssets(data.productToAllAsset[0].assets)
  //   })
  // }

  const fetchWhiteListedAssetByid = (productId) => {
    setInProgress(true);
    queryLockerWhiteListedAssetByProductId(productId, (error, data) => {
      if (error) {
        message.error(error);
        return;
      }
      console.log("Product Asset", data?.assetIds);
      setWhiteListedAssets(data?.assetIds)
    })
  }

  const AvailableAssetBalance =
    getDenomBalance(balances, selectedAsset) || 0;

  getAssetDenom();
  console.log("Single Asset", whiteListedAssetData[0][0]);

  return (
    <>
      <Col>
        <div className="farm-content-card earn-deposite-card">
          <div className="assets-select-card  ">
            <div className="assets-left">
              <label className="leftlabel">
                Deposit <TooltipIcon />
              </label>
              <Row>
                <Col>
                  <div className="assets-select-wrapper">
                    {whiteListedAssetData && whiteListedAssetData[0]?.length > 1 ?
                      <div >
                        <Select
                          className="assets-select"
                          dropdownClassName="asset-select-dropdown"
                          placeholder={
                            <div className="select-placeholder">
                              <div className="circle-icon">
                                <div className="circle-icon-inner" />
                              </div>
                              Select
                            </div>
                          }
                          onChange={(e) => {
                            console.log(e);
                            setSelectedAsset(e)
                          }}
                          suffixIcon={<SvgIcon name="caret-down" />}
                        >
                          {whiteListedAssetData[0]?.map((item) => (
                            <Option key={item.denom} value={item.denom}>
                              <div className="select-inner">
                                <div className="select-right">
                                  <div className="select-right-inner">
                                    <div className="svg-icon">
                                      <SvgIcon name={iconNameFromDenom(item.denom)} />
                                    </div>
                                    <div>
                                      {denomConversion(item.denom)}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Option>
                          ))}
                          ,
                        </Select>
                      </div>
                      // For Single Asset 
                      // <div>
                      //   {whiteListedAssetData[0]?.map((item) => {
                      //     <div className="farm-asset-icon-container">
                      //       <div className="select-inner">
                      //         <div className="svg-icon">
                      //           <div className="svg-icon-inner">
                      //             <SvgIcon name={iconNameFromDenom(item.denom)} />
                      //             {denomConversion(item.denom)}
                      //             {/* <span> CMST</span> */}
                      //           </div>
                      //         </div>
                      //       </div>
                      //     </div>
                      //   })
                      //   }
                      // </div>
                      :
                      <div>
                        {whiteListedAssetData[0][0]?.map((item) => {
                          <div className="farm-asset-icon-container">
                            <div className="select-inner">
                              <div className="svg-icon">
                                <div className="svg-icon-inner">
                                  <SvgIcon name={iconNameFromDenom(item.denom)} />
                                  {denomConversion(item.denom)}
                                  {/* <span> CMST</span> */}
                                </div>
                              </div>
                            </div>
                          </div>
                        })}
                      </div>
                    }
                    {/* Icon Container Start  */}
                    {/* <div className="farm-asset-icon-container">
                  <div className="select-inner">
                    <div className="svg-icon">
                      <div className="svg-icon-inner">
                        <SvgIcon name={iconNameFromDenom("ucmst")} />
                        <span> CMST</span>
                      </div>
                    </div>
                  </div>
                </div> */}
                    {/* Icon Container End  */}
                    {/* </div>
              {/* <div className="assets-select-wrapper"> */}

                  </div>
                </Col>
              </Row>


            </div>
            <div className="assets-right">
              <div className="label-right">
                Available
                <span className="ml-1">
                  {/* {amountConversionWithComma("20000020")} XYZ */}
                  {amountConversionWithComma(AvailableAssetBalance)}
                  {denomConversion(selectedAsset)}
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
                  onChange={(event) => {
                    // handleFirstInputChange(event.target.value)
                    handleFirstInputChange(event.target.value)
                  }}
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

Deposit.propTypes = {
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
  allWhiteListedAssets: PropTypes.arrayOf(
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
  whiteListedAsset: PropTypes.arrayOf(
    PropTypes.shape({
      list: PropTypes.shape({
        id: PropTypes.shape({
          low: PropTypes.number,
          high: PropTypes.number,
          inSigned: PropTypes.number,
        })
      })
    })
  ),
  balances: PropTypes.arrayOf(
    PropTypes.shape({
      denom: PropTypes.string.isRequired,
      amount: PropTypes.string,
    })
  ),
  demandCoin: PropTypes.shape({
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    denom: PropTypes.string,
  }),
}
const stateToProps = (state) => {
  return {
    address: state.account.address,
    lang: state.language,
    balances: state.account.balances.list,
    pair: state.asset.pair,
    assets: state.asset._.list,
    allWhiteListedAssets: state.locker._.list,
    whiteListedAsset: state.locker.whiteListedAssetById.list,
  };
};

const actionsToProps = {
  setPair,
  setAssets,
  setAllWhiteListedAssets,
  setWhiteListedAssets,
};
export default connect(stateToProps, actionsToProps)(Deposit);

