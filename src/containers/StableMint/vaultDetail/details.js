import { Button, List, message } from "antd";
import * as PropTypes from "prop-types";
import { connect, useDispatch, useSelector } from "react-redux";
import {
    commaSeparator,
    decimalConversion,
    marketPrice,
} from "../../../utils/number";
import { amountConversion, amountConversionWithComma, denomConversion } from "../../../utils/coin";
import { DEFAULT_FEE, DOLLAR_DECIMALS, PRODUCT_ID } from "../../../constants/common";
import { cmst, comdex } from "../../../config/network";
import { SvgIcon } from "../../../components/common";
import { denomToSymbol, iconNameFromDenom } from "../../../utils/string";
import variables from "../../../utils/variables";
import { queryStableVaultStatistic, queryUserVaultsInfo } from "../../../services/vault/query";
import { setOwnerVaultInfo } from '../../../actions/locker';
import { setOwnerCurrentCollateral } from "../../../actions/mint";
import { useEffect, useState } from "react";
import { signAndBroadcastTransaction } from "../../../services/helper";
import Long from "long";
import Snack from "../../../components/common/Snack";
import { setBalanceRefresh } from "../../../actions/account";
import '../../Mint/Vault/Mint/index.scss'
import { useParams } from "react-router";
import { setLockAndMintedData } from "../../../actions/stableMint";
import AssetList from '../../../config/ibc_assets.json'


const PricePool = ({ setOwnerCurrentCollateral,
    ownerVaultInfo,
    markets,
    pair,
    ownerCurrrentCollateral,
    ownerVaultId,
    setOwnerVaultInfo,
    lang,
    address,
    setBalanceRefresh,
    refreshBalance,
}) => {
    const { pathVaultId } = useParams();

    const dispatch = useDispatch();

    const selectedExtendedPairVaultListData = useSelector(
        (state) => state.locker.extenedPairVaultListData[0]
    );

    const psmLockedAndMintedData = useSelector(
        (state) => state.stableMint.lockAndMintedData
    );

    const collateralDeposited =
        Number(amountConversion(ownerVaultInfo?.amountIn)) *
        marketPrice(markets, pair?.denomIn);
    const withdrawn =
        Number(amountConversion(ownerVaultInfo?.amountOut)) *
        marketPrice(markets, pair?.denomOut);

    const collateral = Number(amountConversion(ownerVaultInfo?.amountIn || 0));
    const borrowed = Number(amountConversion(ownerVaultInfo?.amountOut || 0));
    const selectedIBCAsset = AssetList?.tokens.filter((item) => item.coinDenom === denomToSymbol(pair && pair?.denomIn));
    const selectedIBCAssetForDenomOut = AssetList?.tokens.filter((item) => item.coinDenom === denomToSymbol(pair && pair?.denomOut));


    const liquidationRatio = selectedExtendedPairVaultListData?.liquidationRatio;
    const [inProgress, setInProgress] = useState(false);

    // eslint-disable-next-line no-unused-vars
    const liquidationPrice =
        decimalConversion(liquidationRatio) * (borrowed / collateral);


    const fetchStableVaultStatistic = (extendedPairId) => {
        queryStableVaultStatistic(extendedPairId, (error, data) => {
            if (error) {
                message.error(error);
                return;
            }
            console.log(data, "Locked and minted data");
            dispatch(setLockAndMintedData(data?.stableMintVault))
        })
    }
    console.log(selectedExtendedPairVaultListData, "selectedExtendedPairVaultListData");
    console.log(pathVaultId, "Path id");
    console.log(psmLockedAndMintedData, "psmLockedAndMintedData");
    useEffect(() => {
        fetchStableVaultStatistic(pathVaultId)
    }, [address, refreshBalance])


    useEffect(() => {
        if (ownerVaultInfo?.id) {
            if (ownerVaultId) {
                getOwnerVaultInfo(ownerVaultInfo?.id)
            }
            else {
                setOwnerVaultInfo('');
                setOwnerCurrentCollateral(0)
            }
        }
        else {
            setOwnerVaultInfo('');
            setOwnerCurrentCollateral(0)
        }
    }, [ownerVaultInfo, ownerCurrrentCollateral, refreshBalance])

    const submitVaultInterestCalculate = () => {
        if (!address) {
            message.error("Address not found, please connect to Keplr");
            return;
        }
        setInProgress(true);
        message.info("Transaction initiated");
        signAndBroadcastTransaction(
            {
                message: {
                    typeUrl: "/comdex.vault.v1beta1.MsgVaultInterestCalcRequest",
                    value: {
                        from: address,
                        appId: Long.fromNumber(PRODUCT_ID),
                        userVaultId: Long.fromNumber(ownerVaultId),
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
                    return;
                }

                if (result?.code) {
                    message.info(result?.rawLog);
                    // resetValues();
                    return;
                }

                message.success(
                    <Snack
                        message={variables[lang].tx_success}
                        hash={result?.transactionHash}
                    />
                );
                // resetValues();
                dispatch({
                    type: "BALANCE_REFRESH_SET",
                    value: refreshBalance + 1,
                });
            }
        );

    }

    const getOwnerVaultInfo = (ownerVaultId) => {
        queryUserVaultsInfo(ownerVaultId, (error, data) => {
            if (error) {
                message.error(error);
                return;
            }
            let ownerCollateral = decimalConversion(data?.vaultsInfo?.collateralizationRatio) * 100
            ownerCollateral = Number(ownerCollateral).toFixed(DOLLAR_DECIMALS)
            setOwnerCurrentCollateral(ownerCollateral)
        });
    };

    const data = [
        {
            title: `Total ${denomToSymbol(pair?.denomIn) || "Loading..."} locked in Stablemint`,
            counts: (
                <div>
                    {amountConversionWithComma(psmLockedAndMintedData?.amountIn || 0, comdex?.coinDecimals, selectedIBCAsset[0]?.coinDecimals)}
                    <span className="small-text">
                        {denomToSymbol(pair && pair?.denomIn)}
                    </span>
                </div>
            ),
        },
        {
            title: `${denomToSymbol(pair && pair?.denomOut) || " Loading..."} ceiling`,
            counts: (
                <div className="collateral-deposit-main-box">
                    <div className="collateral-deposit-up-box">
                        {amountConversionWithComma(selectedExtendedPairVaultListData?.debtCeiling || 0, DOLLAR_DECIMALS)}
                        <span className="small-text">
                            {denomToSymbol(pair && pair?.denomOut)}
                        </span>
                    </div>
                </div>
            ),
        },
        {
            title: `Total ${denomToSymbol(pair && pair?.denomOut) || "Loading..."}  minted`,
            counts: (
                <>
                    {amountConversionWithComma(psmLockedAndMintedData?.amountOut || 0, comdex?.coinDecimals, selectedIBCAssetForDenomOut[0]?.coinDecimals)}
                    <span className="small-text">
                        {denomToSymbol(pair && pair?.denomOut)}
                    </span>
                </>
            ),
        },
        {
            title: "Drawdown Fee",
            counts: (
                <div>
                    {decimalConversion(selectedExtendedPairVaultListData?.drawDownFee) * 100 || "0"}%
                </div>
            ),
        },
    ];
    return (
        <>
            <div className="composite-card farm-content-card earn-deposite-card ">
                <div className="card-head">
                    <div className="liquidation-price-container">
                        <div className="svg-icon-inner">
                            <SvgIcon name={iconNameFromDenom(pair && pair?.denomIn)} />
                        </div>
                        <span className="das"></span>
                        <div className="svg-icon-inner">
                            <SvgIcon name={iconNameFromDenom(pair && pair?.denomOut)} />{" "}
                        </div>

                    </div>

                    <div className="oracle-price-container">
                        <span className="title">Oracle Price </span>{" "}
                        <span className="price">
                            {" "}
                            $
                            {commaSeparator(
                                Number(marketPrice(markets, pair?.denomIn) || 0).toFixed(
                                    DOLLAR_DECIMALS
                                )
                            )}
                        </span>
                    </div>
                </div>
                <List
                    grid={{
                        gutter: 16,
                        xs: 2,
                        sm: 2,
                        md: 3,
                        lg: 2,
                        xl: 2,
                        xxl: 2,
                    }}
                    dataSource={data}
                    renderItem={(item) => (
                        <List.Item>
                            <div>
                                <p>{item.title}</p>
                                <h3>{item.counts}</h3>
                            </div>
                        </List.Item>
                    )}
                />
            </div>
        </>
    );
};

PricePool.prototype = {
    lang: PropTypes.string.isRequired,
    address: PropTypes.string,
    refreshBalance: PropTypes.number.isRequired,
    setBalanceRefresh: PropTypes.func.isRequired,
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
    ownerVaultId: PropTypes.string,
    ownerVaultInfo: PropTypes.array,
    pair: PropTypes.shape({
        denomIn: PropTypes.string,
        denomOut: PropTypes.string,
    }),
    ownerCurrrentCollateral: PropTypes.number.isRequired,
};

const stateToProps = (state) => {
    return {
        lang: state.language,
        address: state.account.address,
        ownerVaultInfo: state.locker.ownerVaultInfo,
        markets: state.oracle.market.list,
        pair: state.asset.pair,
        ownerVaultId: state.locker.ownerVaultId,
        ownerCurrrentCollateral: state.mint.ownerCurrrentCollateral,
        refreshBalance: state.account.refreshBalance,
    };
};
const actionsToProps = {
    setOwnerCurrentCollateral,
    setOwnerVaultInfo,
    setBalanceRefresh,
};
export default connect(stateToProps, actionsToProps)(PricePool);


