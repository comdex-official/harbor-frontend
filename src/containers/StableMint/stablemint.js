import './index.scss'
import * as PropTypes from "prop-types";
import { SvgIcon } from "../../components/common";
import { message, Spin } from "antd";
import { useNavigate } from "react-router";
import { iconNameFromDenom, symbolToDenom } from "../../utils/string";
import TooltipIcon from "../../components/TooltipIcon";
import React, { useEffect, useState } from "react";
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE, DOLLAR_DECIMALS, PRODUCT_ID } from "../../constants/common";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { amountConversionWithComma } from "../../utils/coin";
import NoData from "../../components/NoData";
import { queryExtendedPairVaultById, queryPairVault, queryStableMintExtendedPairVaultById } from "../../services/asset/query";
import { setStableMintVaultList } from "../../actions/stableMint"
import {
    setCurrentPairID,
    setSelectedExtentedPairvault,
} from "../../actions/locker";
import { decimalConversion } from "../../utils/number";
import { queryVaultMintedStatistic } from "../../services/vault/query";
import { connect } from "react-redux";
import { Pagination } from 'antd';


const StableMint = ({
    address,
    lang
}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const navigateToStableMintVault = (path) => {
        navigate({
            pathname: `./${path}`,
        });
    };

    const stableMintExtenedPairVaultList = useSelector(
        (state) => state.stableMint.stableMintVaultList
    );


    const [loading, setLoading] = useState(false);
    const [vaultDebt, setVaultDebt] = useState([])
    const [pageNumber, setPageNumber] = useState(DEFAULT_PAGE_NUMBER);
    const [pageSize, setPageSize] = useState(6);
    const [activePage, setActivePage] = useState(DEFAULT_PAGE_NUMBER)
    const [totalExtendedPair, setTotalExtendedPair] = useState()

    const fetchExtendexPairList = (pairId) => {
        setLoading(true);
        queryPairVault(pairId, (error, data) => {
            setLoading(false);
            if (error) {
                message.error(error);
                return;
            }
            dispatch(setStableMintVaultList([data?.pairVault]));
            // setTotalExtendedPair(data?.pagination?.total?.toNumber())
            // dispatch(setStableMintVaultList(data?.extendedPair));
            // setTotalExtendedPair(data?.pagination?.total?.toNumber())
        });
    };
    // const fetchExtendexPairList = (offset, limit, countTotal, reverse, productId) => {
    //     setLoading(true);
    //     queryStableMintExtendedPairVaultById(offset, limit, countTotal, reverse, productId, (error, data) => {
    //         setLoading(false);
    //         if (error) {
    //             message.error(error);
    //             return;
    //         }
    //         console.log(data, "psm data");
    //         dispatch(setStableMintVaultList(data?.extendedPair));
    //         setTotalExtendedPair(data?.pagination?.total?.toNumber())
    //     });
    // };


    const fetchVaultMintedTokenStatistic = (productId) => {
        queryVaultMintedStatistic(productId, (error, data) => {
            if (error) {
                message.error(error);
                return;
            }
            setVaultDebt((vaultDebt) => [...vaultDebt, data?.pairStatisticData])
        });
    };


    const getIconFromPairName = (extendexPairVaultPairName) => {
        let pairName = extendexPairVaultPairName;
        pairName = pairName?.replace(/\s+/g, ' ').trim()
        if (!pairName?.includes("-")) {
            return pairName?.toLowerCase();
        } else {
            pairName = pairName?.slice(0, -2);
            pairName = pairName?.toLowerCase()
            return pairName;
        }
    }

    const calculateGlobalDebt = (value) => {
        let matchData = vaultDebt[0]?.filter((debt) => debt?.extendedPairVaultId?.toNumber() === value?.id?.toNumber())
        if (matchData[0] && amountConversionWithComma(matchData[0]?.mintedAmount)) {
            return amountConversionWithComma(matchData[0]?.mintedAmount, DOLLAR_DECIMALS);
        }
        return (0).toFixed(6)
    }

    const handlePageChange = (currentPage, pageSize) => {
        setPageNumber(currentPage - 1);
        setPageSize(pageSize);
        setActivePage(currentPage)
        fetchExtendexPairList((currentPage - 1) * pageSize, pageSize, true, false, PRODUCT_ID);
    };

    useEffect(() => {
        fetchExtendexPairList(14)
        // fetchExtendexPairList((pageNumber - 1) * pageSize, pageSize, true, false, PRODUCT_ID)
    }, [address])

    useEffect(() => {
        if (stableMintExtenedPairVaultList?.length > 0) {
            fetchVaultMintedTokenStatistic(PRODUCT_ID)
        }

    }, [address, stableMintExtenedPairVaultList])

    if (loading) {
        return <Spin />;
    }

    return (
        <>
            <div className="app-content-wrapper vault-mint-main-container">
                <div className="card-main-container">
                    {stableMintExtenedPairVaultList?.length > 0 ? <h1 className="choose-vault">Choose Your Stable Mint Vault Type</h1> : ""}
                    {stableMintExtenedPairVaultList?.length > 0 ? (
                        stableMintExtenedPairVaultList?.map((item, index) => {
                            if (
                                item &&
                                item.isStableMintVault &&
                                item.appId.toNumber() === PRODUCT_ID
                            ) {
                                return (
                                    <React.Fragment key={index}>
                                        {item &&
                                            (
                                                <div
                                                    className="card-container "
                                                    onClick={() => {
                                                        dispatch(setCurrentPairID(item?.pairId?.toNumber()));
                                                        dispatch(setSelectedExtentedPairvault(item));
                                                        navigateToStableMintVault(item?.id?.toNumber());
                                                    }}
                                                >
                                                    <div className="up-container">
                                                        <div className="icon-container">
                                                            {/* <SvgIcon name={iconNameFromDenom(symbolToDenom(getIconFromPairName(item?.pairName)))} /> */}
                                                            <SvgIcon name={iconNameFromDenom(symbolToDenom("usdc"))} />
                                                        </div>
                                                        <div className="vault-name-container">
                                                            <div className="vault-name">{item?.pairName}</div>
                                                            <div className="vault-desc" />
                                                        </div>
                                                    </div>
                                                    <div className="bottom-container">
                                                        <div className="contenet-container">
                                                            <div className="name">
                                                                Drawdown Fee <TooltipIcon text="Fixed amount of $CMST deducted at every withdrawal" />
                                                            </div>
                                                            <div className="value">
                                                                {" "}
                                                                {decimalConversion(item?.drawDownFee) * 100 || "0"}%
                                                            </div>
                                                        </div>
                                                        <div className="contenet-container">
                                                            <div className="name">
                                                                Debt Ceiling <TooltipIcon text="Maximum Composite that can be withdrawn per vault type" />
                                                            </div>
                                                            <div className="value">
                                                                {" "}
                                                                {amountConversionWithComma(item?.debtCeiling, DOLLAR_DECIMALS)} CMST
                                                            </div>
                                                        </div>

                                                        <div className="contenet-container">
                                                            <div className="name">
                                                                Vault’s Global Debt <TooltipIcon text="The total $CMST Debt of the protocol against this vault type" />
                                                            </div>
                                                            <div className="value">
                                                                {vaultDebt.length > 0
                                                                    ?
                                                                    calculateGlobalDebt(item)
                                                                    :
                                                                    "0.000000"
                                                                } CMST
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            )}
                                    </React.Fragment>
                                );
                            }
                            else {
                                return ""
                            }
                        })
                    )
                        : (
                            <NoData />
                        )}


                </div>
                {stableMintExtenedPairVaultList?.length > 0 ? <div >
                    <Pagination
                        defaultCurrent={activePage}
                        onChange={handlePageChange}
                        total={totalExtendedPair &&
                            totalExtendedPair}
                        pageSize={pageSize}
                    />
                </div> : ""}
            </div >
        </>
    )
}

StableMint.propTypes = {
    lang: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
};

const stateToProps = (state) => {
    return {
        lang: state.language,
        address: state.account.address,
    };
};

const actionsToProps = {

};

export default connect(stateToProps, actionsToProps)(StableMint);

