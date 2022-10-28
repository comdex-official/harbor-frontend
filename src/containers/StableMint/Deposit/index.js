import { Button, message } from "antd";
import Long from "long";
import * as PropTypes from "prop-types";
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
import { denomToSymbol, iconNameFromDenom, toDecimals } from "../../../utils/string";
import variables from "../../../utils/variables";
import { setAssets, setPair } from "../../../actions/asset";
import {
    setWhiteListedAssets,
    setAllWhiteListedAssets,
    setIsLockerExist,
    setOwnerVaultInfo,
    setCollectorData,
    setExtendedPairVaultListData,
    setSelectedExtentedPairvault
} from "../../../actions/locker";
// import "./index.scss";
import { queryAssets, queryPair, queryPairVault } from "../../../services/asset/query";
import {
    DEFAULT_FEE,
    DEFAULT_PAGE_NUMBER,
    DEFAULT_PAGE_SIZE,
    DOLLAR_DECIMALS,
    PRODUCT_ID,
} from "../../../constants/common";
import {
    queryLockerWhiteListedAssetByProductId,
    queryUserLockerByProductAssetId,
} from "../../../services/locker/query";
import Snack from "../../../components/common/Snack";
import { signAndBroadcastTransaction } from "../../../services/helper";
import { defaultFee } from "../../../services/transaction";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { queryCollectorInformation } from "../../../services/collector";
import { decimalConversion } from "../../../utils/number";
import {
    setAssetIn,
    setAssetOut,
    setAmountOut,
    setAmountIn,
} from "../../../actions/asset";
import { useParams } from "react-router";
import AssetList from '../../../config/ibc_assets.json'
import { comdex } from "../../../config/network";


const Deposit = ({
    lang,
    balances,
    address,
    setAssets,
    assets,
    setAmountIn,
    setAmountOut,
    outAmount,
    refreshBalance,
    setWhiteListedAssets,
    whiteListedAsset,
    ownerLockerInfo,
    setOwnerVaultInfo,
    setCollectorData,
    pair,
    setPair,
    assetMap,
}) => {
    const { pathVaultId } = useParams();
    // New 
    const selectedExtentedPairVaultListData = useSelector((state) => state.locker.extenedPairVaultListData);
    const pairId = selectedExtentedPairVaultListData && selectedExtentedPairVaultListData[0]?.pairId?.low;
    const psmLockedAndMintedData = useSelector((state) => state.stableMint.lockAndMintedData);
    const selectedIBCAsset = AssetList?.tokens.filter((item) => item.coinDenom === denomToSymbol(pair && pair?.denomIn));
    const drawDownFee = decimalConversion(selectedExtentedPairVaultListData[0]?.drawDownFee) * 100 || "0"


    const dispatch = useDispatch();
    const inAmount = useSelector((state) => state.asset.inAmount);
    const isLockerExist = useSelector((state) => state.locker.isLockerExist);


    const [inProgress, setInProgress] = useState(false);
    const [loading, setLoading] = useState(false);
    const [inputValidationError, setInputValidationError] = useState();
    const [collectorInfo, setCollectorInfo] = useState();
    const [validationError, setValidationError] = useState();
    const [currentExtentedVaultdata, setCurrentExtentedVaultdata] = useState();
    const [mintType, setMintType] = useState("Borrow CMST");
    const [pairDenomIn, setPairDenomIn] = useState("");
    const [pairDenomOut, setPairDenomOut] = useState("")
    const [editType, setEditType] = useState("Mint")
    const [lockAndMintedData, setLockAndMintedData] = useState()
    const [upperBoxValue, setUpperBoxValue] = useState("Locked")
    const [bottomBoxValue, setBottomBoxValue] = useState("Minted")
    const [lockedAmount, setLockedAmount] = useState(0);
    const [mintedAmount, setMintedAmount] = useState(0);

    const whiteListedAssetData = [];
    const resetValues = () => {
        dispatch(setAmountIn(0));
    };



    // new 

    const getAssetDataByPairId = (pairId) => {
        setLoading(true)
        queryPair(pairId, (error, data) => {
            if (error) {
                message.error(error);
                setLoading(false)
                return;
            }
            setPair(data?.pairInfo)
            setLoading(false)
        })
    }


    const fetchQueryPairValut = (pairVaultId) => {
        setLoading(true)
        queryPairVault(pairVaultId, (error, data) => {
            if (error) {
                message.error(error);
                setLoading(false)
                return;
            }
            setCurrentExtentedVaultdata(data?.pairVault)
            dispatch(setExtendedPairVaultListData(data?.pairVault))
            dispatch(setSelectedExtentedPairvault(data?.pairVault))
            setLoading(false)
        })
    }


    useEffect(() => {
        fetchQueryPairValut(pathVaultId);
        if (pairId) {
            getAssetDataByPairId(pairId);
        }
    }, [address, pairId, refreshBalance])

    // end 


    const getAssetDenom = () => {
        assets?.map((item) => {
            if (item.id.low === whiteListedAsset[0]?.low) {
                whiteListedAssetData.push(item);
            }
        });
    };

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
        fetchCollectorStats();
    }, [whiteListedAsset]);

    useEffect(() => {
        fetchOwnerLockerExistByAssetId(PRODUCT_ID, whiteListedAssetId, address);
    }, [whiteListedAsset, refreshBalance])


    const fetchAssets = (offset, limit, countTotal, reverse) => {
        setInProgress(true);
        setLoading(true);
        queryAssets(offset, limit, countTotal, reverse, (error, data) => {
            setInProgress(false);
            setLoading(false);
            if (error) {
                message.error(error);
                return;
            }
            setAssets(data.assets, data.pagination);
        });
    };

    const fetchWhiteListedAssetByid = (productId) => {
        setInProgress(true);
        setLoading(true);
        queryLockerWhiteListedAssetByProductId(productId, (error, data) => {
            if (error) {
                message.error(error);
                return;
            }
            setWhiteListedAssets(data?.assetIds);
            setLoading(false);
        });
    };

    const fetchOwnerLockerExistByAssetId = (productId, assetId, address) => {
        queryUserLockerByProductAssetId(
            productId,
            assetId,
            address,
            (error, data) => {
                if (error) {
                    message.error(error);
                    return;
                }
                let lockerExist = data?.lockerInfo?.lockerId?.low;
                setOwnerVaultInfo(data?.lockerInfo);
                if (lockerExist) {
                    dispatch(setIsLockerExist(true));
                } else {
                    dispatch(setIsLockerExist(false));
                }
            }
        );
    };
    const fetchCollectorStats = () => {
        queryCollectorInformation((error, result) => {
            if (error) {
                message.error(error);
                return;
            }
            setCollectorData(result?.collectorLookup[0])
            setCollectorInfo(result?.collectorLookup[0]);
        });
    };

    getAssetDenom();

    const AvailableAssetBalance =
        getDenomBalance(balances, pair?.denomIn) || 0;
    const whiteListedAssetId = whiteListedAsset[0]?.low;
    const lockerId = ownerLockerInfo?.lockerId;

    const handleInputMax = () => {
        if (Number(AvailableAssetBalance)) {
            return dispatch(
                setAmountIn(amountConversion(AvailableAssetBalance))
            );
        } else {
            return null;
        }
    };

    const calculateDrawdown = (userAmount, fee) => {
        let drawDownFee = fee;
        let amount = userAmount;
        let calculatePercentage = Number((drawDownFee / 100) * amount).toFixed(6);
        return calculatePercentage;
    }
    const calcutlateCMSTToBeMinted = (userAmount, fee) => {
        let drawDownFee = fee;
        let amount = userAmount;
        let calculatePercentage = Number((drawDownFee / 100) * amount).toFixed(6);
        let calculateCMSTToBeMinted = amount - calculatePercentage;
        return calculateCMSTToBeMinted
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
                        appId: Long.fromNumber(PRODUCT_ID),
                    },
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

    const handleSubmitAssetDepositStableMint = () => {
        if (!address) {
            message.error("Address not found, please connect to Keplr");
            return;
        }
        setInProgress(true);
        message.info("Transaction initiated");
        signAndBroadcastTransaction(
            {
                message: {
                    typeUrl: "/comdex.vault.v1beta1.MsgDepositStableMintRequest",
                    value: {
                        from: address,
                        appId: Long.fromNumber(PRODUCT_ID),
                        extendedPairVaultId: Long.fromNumber(selectedExtentedPairVaultListData[0]?.id?.low),
                        amount: getAmount(inAmount, assetMap[pair && pair?.denomIn]?.decimals.toNumber()),
                        stableVaultId: Long.fromNumber(psmLockedAndMintedData?.id?.low),
                    },
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
    return (
        <>
            <Col>
                <div className="farm-content-card earn-deposite-card earn-main-deposite">
                    <div className="locker-title">Stable Mint</div>
                    <div className="assets-select-card  ">
                        <div className="assets-left">
                            <label className="leftlabel">
                                Deposit <TooltipIcon text="Deposit stable coin to mint CMST" />
                            </label>
                            <Row>
                                <Col>
                                    <div className="assets-select-wrapper">
                                        {loading ? <h1>Loading...</h1>
                                            :
                                            <React.Fragment>
                                                <div className="farm-asset-icon-container">
                                                    <div className="select-inner">
                                                        <div className="svg-icon">
                                                            <div className="svg-icon-inner">
                                                                <SvgIcon
                                                                    name={iconNameFromDenom(pair?.denomIn)}
                                                                />
                                                                <span
                                                                    style={{ textTransform: "uppercase" }}
                                                                >
                                                                    {denomToSymbol(pair?.denomIn)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </React.Fragment>

                                        }
                                    </div>
                                </Col>
                            </Row>
                        </div>
                        <div className="assets-right">
                            <div className="label-right">
                                Available
                                <span className="ml-1">
                                    {amountConversionWithComma(AvailableAssetBalance, comdex?.coinDecimals, assetMap[pair && pair?.denomIn]?.decimals.toNumber())} {denomConversion(pair?.denomIn)}
                                </span>
                                <div className="maxhalf">
                                    <Button className="active" onClick={() => handleInputMax()}>
                                        Max
                                    </Button>
                                </div>
                            </div>
                            <div className="input-select">
                                <CustomInput
                                    value={inAmount}
                                    onChange={(event) => {
                                        handleFirstInputChange(event.target.value);
                                        calculateDrawdown(inAmount, drawDownFee)
                                    }}
                                    validationError={inputValidationError}
                                // disabled={true}
                                />
                                {/* <small>{showInDollarValue()}</small> */}
                            </div>
                        </div>
                    </div>

                    <div className="interest-rate-container mt-4">
                        <Row>
                            <div className="title">Calculated Drawdown Amount</div>
                            <div className="value">

                                {calculateDrawdown(inAmount, drawDownFee)}
                                {' '}
                                {denomToSymbol(pair?.denomIn)}

                            </div>
                        </Row>
                        <Row>
                            <div className="title">CMST to be minted</div>
                            <div className="value">
                                {calcutlateCMSTToBeMinted(inAmount, drawDownFee)}
                                {" "}
                                {denomToSymbol(pair?.denomOut)}
                            </div>
                        </Row>
                    </div>

                    <div className="assets PoolSelect-btn">
                        <div className="assets-form-btn text-center  mb-2">
                            <Button
                                loading={inProgress}
                                type="primary"
                                className="btn-filled"
                                onClick={() => {
                                    handleSubmitAssetDepositStableMint()
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
            }),
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
            }),
        })
    ),
    whiteListedAsset: PropTypes.arrayOf(
        PropTypes.shape({
            list: PropTypes.shape({
                id: PropTypes.shape({
                    low: PropTypes.number,
                    high: PropTypes.number,
                    inSigned: PropTypes.number,
                }),
            }),
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
    ownerLockerInfo: PropTypes.string,
    pair: PropTypes.shape({
        denomIn: PropTypes.string,
        denomOut: PropTypes.string,
    }),
    assetMap: PropTypes.object,
};
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
        ownerLockerInfo: state.locker.ownerVaultInfo,
        assetMap: state.asset.map,
    };
};

const actionsToProps = {
    setPair,
    setAssets,
    setAllWhiteListedAssets,
    setWhiteListedAssets,
    setOwnerVaultInfo,
    setCollectorData,
    setAmountIn,
    setAmountOut,
    setAssetIn,
    setAssetOut,
};
export default connect(stateToProps, actionsToProps)(Deposit);