import CustomInput from '@/components/CustomInput'
import { ATOM } from '@/components/image'
import { Icon } from '@/components/image/Icon'
import { NextImage } from '@/components/image/NextImage'
import { Button } from 'antd'
import React, { useEffect, useState } from 'react'
import { queryLockerWhiteListedAssetByProductId, queryUserLockerByProductAssetId, } from '../../services/locker/query'
import { connect, useDispatch, useSelector } from 'react-redux'
import Long from "long";
import * as PropTypes from "prop-types";
import { setAmountIn, setAssets, setPair } from "../../actions/asset";
import {
    setWhiteListedAssets,
    setAllWhiteListedAssets,
    setIsLockerExist,
    setOwnerVaultInfo,
    setCollectorData
} from "../../actions/locker";
import { queryAssets } from "../../services/asset/query";
import {
    DEFAULT_FEE,
    DEFAULT_PAGE_NUMBER,
    DEFAULT_PAGE_SIZE,
    DOLLAR_DECIMALS,
    PRODUCT_ID,
} from "../../constants/common";
import Snack from "../../components/common/Snack";
import { signAndBroadcastTransaction } from "../../services/helper";
import { defaultFee } from "../../services/transaction";
import { queryCollectorInformation } from "../../services/collector";
import { getDenomBalance } from '../../utils/coin'

const Deposit = ({
    lang,
    balances,
    address,
    setAssets,
    assets,
    refreshBalance,
    setWhiteListedAssets,
    whiteListedAsset,
    ownerLockerInfo,
    setOwnerVaultInfo,
    setCollectorData
}) => {

    const dispatch = useDispatch();
    const inAmount = useSelector((state) => state.asset.inAmount);
    const isLockerExist = useSelector((state) => state.locker.isLockerExist);

    const [inProgress, setInProgress] = useState(false);
    const [loading, setLoading] = useState(false);
    const [inputValidationError, setInputValidationError] = useState();
    const [collectorInfo, setCollectorInfo] = useState();


    const whiteListedAssetData = [];
    const resetValues = () => {
        dispatch(setAmountIn(0));
    };

    const getAssetDenom = () => {
        assets?.map((item) => {
            if (item?.id?.toNumber() === whiteListedAsset[0]?.toNumber()) {
                whiteListedAssetData.push(item);
            }
        });
    };

    getAssetDenom();

    const AvailableAssetBalance = getDenomBalance(balances, whiteListedAssetData[0]?.denom) || 0;
    const whiteListedAssetId = whiteListedAsset[0]?.toNumber();
    const lockerId = ownerLockerInfo?.lockerId;

    // Query 

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
                let lockerExist = data?.lockerInfo?.lockerId?.toNumber();
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

    // Query Calls 

    useEffect(() => {
        resetValues();
        fetchAssets(
            (DEFAULT_PAGE_NUMBER - 1) * (DEFAULT_PAGE_SIZE * 2),
            (DEFAULT_PAGE_SIZE * 2),
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


    return (
        <>
            <div className="locker_deposit_main_container">
                <div className="locker_deposit_container card_container">
                    <div className="locker_deposit_data_container">

                        <div className="locker_deposit_data">
                            <div className="deposit_amount_container">
                                <div className="title_container">
                                    <div className="number">01</div>
                                    <div className="text">Input Deposit Amount</div>
                                </div>
                                <div className="input_container_box">
                                    <div className="amount_container">
                                        <Button className='maxhalf'> MAX</Button>
                                        <span className='amount'>7 CMST</span>
                                    </div>
                                    <div className="input_container">
                                        <div className="icon_container">
                                            <div className="assets-withicon">
                                                <div className="assets-icons">
                                                    <NextImage src={ATOM} height={35} width={35} alt="@icon" />
                                                </div>
                                                <div className="name">
                                                    CMST
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <CustomInput
                                                className='custom-input'
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="reward_rate_container">
                                <div className="title_container">
                                    <div className="number">02</div>
                                    <div className="text">Reward Rate</div>
                                </div>
                                <div className="value_container">
                                    <div className="title">Current Reward Rate</div>
                                    <div className="value">0.00%</div>
                                </div>
                            </div>
                            <div className="earn_reward_container">
                                <div className="title_container">
                                    <div className="number">03</div>
                                    <div className="text">Earn Rewards</div>
                                </div>
                                <div className="value_container">
                                    <div className="title">Your Rewards</div>
                                    <div className="value">20 CMST</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="locker_deposit_btn_container">
                        <Button type='primary' className='btn-filled'>
                            Deposit
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}

// export default Deposit
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
    };
};

const actionsToProps = {
    setPair,
    setAssets,
    setAllWhiteListedAssets,
    setWhiteListedAssets,
    setOwnerVaultInfo,
    setCollectorData,
};
export default connect(stateToProps, actionsToProps)(Deposit);