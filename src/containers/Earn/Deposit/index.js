import { Button, Input, message, Select } from "antd";
import Long from "long";
import './index.scss'
import *  as PropTypes from 'prop-types';
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Col, Row, SvgIcon } from "../../../components/common";
import CustomInput from "../../../components/CustomInput";
import TooltipIcon from "../../../components/TooltipIcon";
import { ValidateInputNumber } from "../../../config/_validation";
import {
  amountConversion,
  amountConversionWithComma,
  denomConversion,
  getAmount,
  getDenomBalance,
} from "../../../utils/coin";
import { iconNameFromDenom, toDecimals } from "../../../utils/string";
import variables from "../../../utils/variables";
import { setAmountIn, setAssets, setPair } from "../../../actions/asset";
import { setWhiteListedAssets, setAllWhiteListedAssets, setIsLockerExist, setOwnerVaultInfo } from '../../../actions/locker'
import "./index.scss";
import { queryAssets } from "../../../services/asset/query";
import { DEFAULT_FEE, DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE, DOLLAR_DECIMALS, PRODUCT_ID } from "../../../constants/common";
import { queryLockerWhiteListedAssetByProduct, queryLockerWhiteListedAssetByProductId, queryUserLockerByProductAssetId } from "../../../services/locker/query";
import { queryAllBalances } from "../../../services/bank/query";
import { comdex } from "../../../config/network";
import Snack from "../../../components/common/Snack";
import { signAndBroadcastTransaction } from "../../../services/helper";
import { defaultFee, getTypeURL } from "../../../services/transaction";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

const Deposit = ({
  lang,
  reverse,
  spotPrice,
  balances,
  pair,
  address,
  setAssets,
  assets,
  refreshBalance,
  setWhiteListedAssets,
  setAllWhiteListedAssets,
  allWhiteListedAssets,
  whiteListedAsset,
  ownerLockerInfo,
  setOwnerVaultInfo,
}) => {
  const dispatch = useDispatch();
  const inAmount = useSelector((state) => state.asset.inAmount);
  const isLockerExist = useSelector((state) => state.locker.isLockerExist);

  const [secondInput, setSecondInput] = useState();
  const [inProgress, setInProgress] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inputValidationError, setInputValidationError] = useState();
  const [outputValidationError, setOutputValidationError] = useState();
  const [poolBalance, setLocalPoolBalance] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState();


  const whiteListedAssetData = [];
  const { Option } = Select;

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
    })
  }

  const handleFirstInputChange = (value) => {
    value = toDecimals(value).toString().trim();
    setInputValidationError(
      ValidateInputNumber(
        Number(getAmount(value)),
        AvailableAssetBalance,
        "macro"
      )
    );
    dispatch(setAmountIn(value));
  };
  const showInDollarValue = () => {
    const total = inAmount;

    return `≈ $${Number(total && isFinite(total) ? total : 0).toFixed(
      DOLLAR_DECIMALS
    )}`;
  };

  useEffect(() => {
    resetValues();
    fetchAssets(
      (DEFAULT_PAGE_NUMBER - 1) * DEFAULT_PAGE_SIZE,
      DEFAULT_PAGE_SIZE,
      true,
      false
    );
    fetchWhiteListedAssetByid(PRODUCT_ID);
  }, [address]);

  useEffect(() => {
    fetchOwnerLockerExistByAssetId(PRODUCT_ID, whiteListedAssetId, address);
  }, [whiteListedAsset])


  const fetchAssets = (offset, limit, countTotal, reverse) => {
    setInProgress(true);
    setLoading(true)
    queryAssets(offset, limit, countTotal, reverse, (error, data) => {
      setInProgress(false);
      setLoading(false)
      if (error) {
        message.error(error);
        return;
      }
      setAssets(data.assets, data.pagination);
    });
  };

  const fetchWhiteListedAssetByid = (productId) => {
    setInProgress(true);
    setLoading(true)
    queryLockerWhiteListedAssetByProductId(productId, (error, data) => {
      if (error) {
        message.error(error);
        return;
      }
      setWhiteListedAssets(data?.assetIds)
      setLoading(false)
    })
  }

  const fetchOwnerLockerExistByAssetId = (productId, assetId, address) => {
    queryUserLockerByProductAssetId(productId, assetId, address, (error, data) => {
      if (error) {
        message.error(error);
        return;
      }
      let lockerExist = data?.lockerInfo?.length;
      setOwnerVaultInfo(data?.lockerInfo)
      if (lockerExist > 0) {
        dispatch(setIsLockerExist(true));
      } else {
        dispatch(setIsLockerExist(false));
      }
    })
  }

  getAssetDenom();
  
  const AvailableAssetBalance = getDenomBalance(balances, whiteListedAssetData[0]?.denom) || 0;
  const whiteListedAssetId = whiteListedAsset[0]?.low;
  const lockerId = ownerLockerInfo[0]?.lockerId;

  const handleInputMax = () => {
    if (Number(AvailableAssetBalance) > DEFAULT_FEE) {
      return (
        dispatch(setAmountIn(amountConversion(AvailableAssetBalance - DEFAULT_FEE)))

      )
    } else {
      return null
    }
  }
  const handleSubmitCreateLocker = () => {
    if (!address) {
      message.error("Address not found, please connect to Keplr");
      return;
    }
    setInProgress(true);
    message.info("Transaction initiated");
    signAndBroadcastTransaction(
      {
        message: {
          typeUrl: "/comdex.locker.v1beta1.MsgCreateLockerRequest",
          value: {
            depositor: address,
            amount: getAmount(inAmount),
            assetId: Long.fromNumber(whiteListedAssetId),
            appMappingId: Long.fromNumber(PRODUCT_ID),
          }
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
  const handleSubmitAssetDepositLocker = () => {
    if (!address) {
      message.error("Address not found, please connect to Keplr");
      return;
    }
    setInProgress(true);
    message.info("Transaction initiated");
    signAndBroadcastTransaction(
      {
        message: {
          typeUrl: "/comdex.locker.v1beta1.MsgDepositAssetRequest",
          value: {
            depositor: address,
            lockerId: lockerId,
            amount: getAmount(inAmount),
            assetId: Long.fromNumber(whiteListedAssetId),
            appMappingId: Long.fromNumber(PRODUCT_ID),
          }
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

  return (
    <>
      <Col>
        <div className="farm-content-card earn-deposite-card earn-main-deposite">
          <div className="locker-title">Locker</div>
          <div className="assets-select-card  ">
            <div className="assets-left">
              <label className="leftlabel">
                Deposit <TooltipIcon />
              </label>
              <Row>
                <Col>
                  <div className="assets-select-wrapper">
                    {/* When we receive multiple whitelisted asset then will show dropdown */}

                    {/* Start */}
                    {/* {whiteListedAssetData && whiteListedAssetData[0]?.length > 1 ?
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
                      :
                      <div>
                        {whiteListedAssetData[0][0]?.map((item) => {
                          <div className="farm-asset-icon-container">
                            <div className="select-inner">
                              <div className="svg-icon">
                                <div className="svg-icon-inner">
                                  <SvgIcon name={iconNameFromDenom(item.denom)} />
                                  {denomConversion(item.denom)}
                                </div>
                              </div>
                            </div>
                          </div>
                        })}
                      </div>
                    } */}
                    {/* End */}


                    {/* For Single Asset */}
                    {loading ? <h1>Loading...</h1> : null}
                    {whiteListedAssetData && whiteListedAssetData.map((item, index) => {
                      return (
                        <React.Fragment key={index} >
                          {loading ? null :
                            <div className="farm-asset-icon-container" >
                              <div className="select-inner">
                                <div className="svg-icon">
                                  <div className="svg-icon-inner">
                                    <SvgIcon name={iconNameFromDenom(item.denom)} />
                                    <span style={{ textTransform: "uppercase" }}> {item.name}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          }
                        </React.Fragment>
                      )
                    })}
                  </div>
                </Col>
              </Row>


            </div>
            <div className="assets-right">
              <div className="label-right">
                Available
                <span className="ml-1">
                  {amountConversionWithComma(AvailableAssetBalance)}
                  {denomConversion(whiteListedAssetData[0]?.denom)}
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
                  onChange={(event) => {
                    handleFirstInputChange(event.target.value)
                  }}
                  validationError={inputValidationError}
                />
                <small>{showInDollarValue()}</small>
              </div>
            </div>
          </div>

          <div className="Interest-rate-container mt-4">
            <Row>
              <div className="title">Current Interest rate</div>
              <div className="value">6%</div>
            </Row>
          </div>

          {/* <Info /> */}
          <div className="assets PoolSelect-btn">
            <div className="assets-form-btn text-center  mb-2">
              <Button
                loading={inProgress}
                disabled={
                  !inAmount ||
                  inProgress ||
                  inputValidationError?.message
                }
                type="primary"
                className="btn-filled"
                onClick={() => {
                  if (isLockerExist) {
                    handleSubmitAssetDepositLocker()
                  }
                  else {
                    handleSubmitCreateLocker()
                  }
                }}
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
  refreshBalance: PropTypes.number.isRequired,
  ownerLockerInfo: PropTypes.array,

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
    refreshBalance: state.account.refreshBalance,
    ownerLockerInfo: state.locker.ownerVaultInfo
  };
};

const actionsToProps = {
  setPair,
  setAssets,
  setAllWhiteListedAssets,
  setWhiteListedAssets,
  setOwnerVaultInfo,
};
export default connect(stateToProps, actionsToProps)(Deposit);

