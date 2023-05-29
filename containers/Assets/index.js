import { Col, Row } from '@/components/common';
import * as PropTypes from "prop-types";
import { connect, useDispatch } from "react-redux";
import React, { useState } from 'react'
import '../../styles/containers/Assets/assets.module.scss';
import AssetTable from './AssetTable';
import { commaSeparatorWithRounding } from '@/utils/coin';
import { DOLLAR_DECIMALS } from '@/constants/common';
import { IoReload } from "react-icons/io5";

const Assets = ({
    lang,
    assetBalance,
    balances,
    markets,
    refreshBalance,
    assetMap,
    harborPrice,
}) => {
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);

    const handleBalanceRefresh = () => {
        setLoading(true);
        let assetReloadBth = document.getElementById("reload-btn");
        assetReloadBth.classList.toggle("reload");
        if (!assetReloadBth.classList.contains("reload")) {
            assetReloadBth.classList.add("reload-2");
        } else {
            assetReloadBth.classList.remove("reload-2");
        }

        dispatch({
            type: "BALANCE_REFRESH_SET",
            value: refreshBalance + 1,
        });
        setTimeout(() => {
            setLoading(false);
        }, 500);
    };

    return (
        <>
            <div className="asset_main_container">
                <div className="asset_container">

                    <div className="asset_top_row card_container">
                        <div className="asset_top_row_main_container">
                            <div className="asset_top_row_container">
                                {/* <Row>
                                    <Col sm="4">
                                        <Row>
                                            <div className="title">Total Asset Balance</div>
                                        </Row>
                                        <div className="value">$1,234.00</div>
                                    </Col>
                                    <Col sm="4">
                                        <Row>
                                            <div className="title">Collateral Locked</div>
                                        </Row>
                                        <div className="value">$17,234.00</div>
                                    </Col>
                                    <Col sm="4">
                                        <Row>
                                            <div className="title">My veHARBOR</div>
                                        </Row>
                                        <div className="value">678923 veHARBOR</div>
                                    </Col>
                                </Row> */}

                                <div className="d-flex">
                                    <div className="asset_stats_main_container">
                                        <div className="asset_stats_container">
                                            <Row>
                                                <div className="title">Total Asset Balance</div>
                                            </Row>
                                            <Row className="align-items-center">
                                                <div className="value">${commaSeparatorWithRounding(assetBalance, DOLLAR_DECIMALS)} </div>
                                                <div className="d-flex">
                                                    <span
                                                        className="asset-reload-btn"
                                                        id="reload-btn-container"
                                                        onClick={() => handleBalanceRefresh()}
                                                    >
                                                        {" "}
                                                        <IoReload id="reload-btn" />{" "}
                                                    </span>
                                                </div>
                                            </Row>
                                        </div>
                                        <div className="asset_stats_container">
                                            <Row>
                                                <div className="title">Collateral Locked</div>
                                            </Row>
                                            <div className="value">$17,234.00</div>
                                        </div>
                                        <div className="asset_stats_container">
                                            <Row>
                                                <div className="title">My veHARBOR</div>
                                            </Row>
                                            <div className="value">678923 veHARBOR</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="asset_utilities_row">


                    </div>

                    <div className="asset_table_row">
                        <AssetTable loading={loading} setLoading={setLoading} />
                    </div>
                </div>
            </div>
        </>
    )
}


Assets.propTypes = {
    lang: PropTypes.string.isRequired,
    assetBalance: PropTypes.number,
    refreshBalance: PropTypes.number.isRequired,
    assetMap: PropTypes.object,
    harborPrice: PropTypes.number.isRequired,
    balances: PropTypes.arrayOf(
        PropTypes.shape({
            denom: PropTypes.string.isRequired,
            amount: PropTypes.string,
        })
    ),
    markets: PropTypes.object,
};

const stateToProps = (state) => {
    return {
        lang: state.language,
        assetBalance: state.account.balances.asset,
        balances: state.account.balances.list,
        markets: state.oracle.market,
        refreshBalance: state.account.refreshBalance,
        assetMap: state.asset.map,
        harborPrice: state.liquidity.harborPrice,
    };
};

export default connect(stateToProps)(Assets);
// export default Assets;