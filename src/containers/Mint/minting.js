import * as PropTypes from "prop-types";
import { SvgIcon } from "../../components/common";
import { connect } from "react-redux";
import { message, Spin } from "antd";
import { useNavigate } from "react-router";
import "./index.scss";
import "./index.scss";
import { iconNameFromDenom } from "../../utils/string";
import TooltipIcon from "../../components/TooltipIcon";
import React, { useEffect, useState } from "react";
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE, PRODUCT_ID } from "../../constants/common";
import { setAssetList, setPairs } from "../../actions/asset";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  setAllExtendedPair,
  setCurrentPairID,
  setSelectedExtentedPairvault,
} from "../../actions/locker";
import { amountConversion } from "../../utils/coin";
import NoData from "../../components/NoData";
import { queryAssets, queryExtendedPairVaultById } from "../../services/asset/query";
import { decimalConversion } from "../../utils/number";

const Minting = ({ address }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const extenedPairVaultList = useSelector(
    (state) => state.locker.extenedPairVaultList[0]
  );
  const assetList = useSelector(
    (state) => state.asset?.assetList
  );

  const [loading, setLoading] = useState(false);

  const navigateToMint = (path) => {
    navigate({
      pathname: `/vault/${path}`,
    });
  };

  useEffect(() => {
    fetchExtendexPairList(PRODUCT_ID);
    fetchAssets(
      (DEFAULT_PAGE_NUMBER - 1) * DEFAULT_PAGE_SIZE,
      DEFAULT_PAGE_SIZE,
      true,
      false
    );

  }, [address])

  const fetchExtendexPairList = (productId) => {
    setLoading(true);
    queryExtendedPairVaultById(productId, (error, data) => {
      setLoading(false);
      if (error) {
        message.error(error);
        return;
      }
      dispatch(setAllExtendedPair(data?.extendedPair));
    });
  };

  const fetchAssets = (offset, limit, countTotal, reverse) => {
    setLoading(true)
    queryAssets(offset, limit, countTotal, reverse, (error, data) => {
      setLoading(false)
      if (error) {
        message.error(error);
        return;
      }
      dispatch(setAssetList(data.assets))
    });
  };

  const getAsssetIcon = (pairID) => {
    const selectedItem = assetList.length > 0 && assetList.filter((item) => (item?.id).toNumber() === pairID);

    return selectedItem[0]?.denom || ""
  }

  if (loading) {
    return <Spin />;
  }

  return (
    <div className="app-content-wrapper vault-mint-main-container">
      <div className="card-main-container">
        {extenedPairVaultList?.length > 0 ? <h1 className="choose-vault">Choose Your Vault Type</h1> : ""}
        {extenedPairVaultList?.length > 0 ? (
          extenedPairVaultList?.map((item, index) => {
            if (
              item &&
              !item.isPsmPair &&
              item.appMappingId.low === PRODUCT_ID
            ) {
              return (
                <React.Fragment key={index}>
                  {item &&
                    !item.isPsmPair &&
                    item.appMappingId.low === PRODUCT_ID && (
                      <div
                        className="card-container "
                        onClick={() => {
                          dispatch(setCurrentPairID(item?.pairId?.low));
                          dispatch(setSelectedExtentedPairvault(item));
                          navigateToMint(item?.id?.low);
                        }}
                      >
                        <div className="up-container">
                          <div className="icon-container">
                            <SvgIcon name={iconNameFromDenom(getAsssetIcon(1))} />
                          </div>
                          <div className="vault-name-container">
                            <div className="vault-name">{item?.pairName}</div>
                            <div className="vault-desc" />
                          </div>
                        </div>
                        <div className="bottom-container">
                          <div className="contenet-container">
                            <div className="name">
                              Liquidation Ratio <TooltipIcon text="If the collateral ratio of the vault goes below this value, the vault will get automatically liquidated which means that the deposited collateral will be sold to recover bad Composite Debt" />
                            </div>
                            <div className="value">
                              {decimalConversion(item?.liquidationRatio) * 100} %
                            </div>
                          </div>
                          <div className="contenet-container">
                            <div className="name">
                              Min. Collateralization Ratio{" "}
                              <TooltipIcon text="Minimum collateral ratio at which composite should be minted" />
                            </div>
                            <div className="value">
                              {decimalConversion(item?.minCr) * 100} %
                            </div>
                          </div>
                          <div className="contenet-container">
                            <div className="name">
                              Stability Fee <TooltipIcon text="Current Interest Rate on Borrowed Amount" />
                            </div>
                            <div className="value">
                              {decimalConversion(item?.stabilityFee) * 100} %
                            </div>
                          </div>
                          <div className="contenet-container">
                            <div className="name">
                              Min. Borrow Amount <TooltipIcon text="Minimum composite that should be borrowed for any active vault" />
                            </div>
                            <div className="value">
                              {" "}
                              {amountConversion(item?.debtFloor)} CMST
                            </div>
                          </div>
                          <div className="contenet-container">
                            <div className="name">
                              Debt Ceiling <TooltipIcon text="Maximum Composite that can be withdrawn per vault type" />
                            </div>
                            <div className="value">
                              {" "}
                              {amountConversion(item?.debtCeiling)} CMST
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                </React.Fragment>
              );
            }
          })
        ) : (
          <NoData />
        )}
      </div>
    </div>
  );
};

Minting.propTypes = {
  lang: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  setPairs: PropTypes.func.isRequired,
};

const stateToProps = (state) => {
  return {
    lang: state.language,
    address: state.account.address,
    pairs: state.asset.pairs,
  };
};

const actionsToProps = {
  setPairs,
};

export default connect(stateToProps, actionsToProps)(Minting);
