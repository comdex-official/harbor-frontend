import * as PropTypes from "prop-types";
import { Col, Row, SvgIcon } from "../../components/common";
import { connect } from "react-redux";
import { Button, message, Table } from "antd";
import { useNavigate } from "react-router";
import "./index.scss";
import PlaceBidModal from "../Auctions/PlaceBidModal";
import FilterModal from "../Auctions/FilterModal/FilterModal";
import data from "./data";
import "./index.scss";
import { Link } from "react-router-dom";
import { iconNameFromDenom } from "../../utils/string";
import TooltipIcon from "../../components/TooltipIcon";
import { queryExtendedPairVault } from "../../services/Mint/query";
import React, { useEffect, useState } from "react";
import { PRODUCT_ID } from "../../constants/common";
import { queryPairVaults } from "../../services/asset/query";
import { setPairs } from "../../actions/asset";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setAllExtendedPair, setCurrentPairID, setExtendedPairVaultListData, setSelectedExtentedPairvault } from "../../actions/locker";
import { amountConversion } from "../../utils/coin";

const Minting = ({
  lang,
  address,
  pair,
  setPairs,

}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const extenedPairVaultList = useSelector((state) => state.locker.extenedPairVaultList);
  const extenedPairVaultListData = useSelector((state) => state.locker.extenedPairVaultListData[0]);
  const currentPairId = useSelector((state) => state.locker.currentPairId);

  // console.log("Extended pair list from reducer", extenedPairVaultListData);

  const [loading, setLoading] = useState(false);
  const columns = [
    {
      title: "Vault",
      dataIndex: "Vault",
      key: "Vault",
      width: 180,
    },
    {
      title: "Min. Collateral Ratio",
      dataIndex: "collateral_ratio",
      key: "collateral_ratio",
      width: 180,
    },
    {
      title: "interest Rate",
      dataIndex: "interest_rate",
      key: "interest_rate",
      width: 180,
    },
    {
      title: "Min. Borrow Amount",
      dataIndex: "borrow_amount",
      key: "borrow_amount",
      width: 200,
      render: (borrow_amount) => (
        <div className="endtime-badge">{borrow_amount}</div>
      ),
    },
    {
      title: "Closing Fee",
      dataIndex: "closing_fee",
      key: "closing_fee",
      width: 150,
      render: (asset_apy) => <>{asset_apy} </>,
    },
    {
      title: "",
      dataIndex: "action",
      key: "action",
      align: "right",
      width: 140,
      render: (vault) => (
        <>
          <div>
            <Link to="/vault">
              <Button type="primary" size="small" className="px-3 valult-mint-btn" onClick={() => {
                console.log(vault);
              }}>
                Mint
              </Button>
            </Link>
          </div>
        </>
      ),
    },
  ];
  const tableData = data.map((item, index) => {
    return {
      key: <>{item.key}</>,
      Vault: (
        <>
          <div className="assets-withicon">{item.valut}</div>
        </>
      ),
      collateral_ratio: (
        <>
          <div className="assets-withicon">{item.collateral}%</div>
        </>
      ),
      interest_rate: (
        <>
          <div className="assets-withicon">{item.Interest}%</div>
        </>
      ),
      borrow_amount: (
        <>
          <div className="assets-withicon">${item.borrow}</div>
        </>
      ),
      closing_fee: (
        <>
          <div className="assets-withicon">{item.closing}%</div>
        </>
      ),
      action: item,
    };
  });

  const navigateToMint = (path) => {
    navigate({
      pathname: `/vault/${path}`,
    });
  }

  useEffect(() => {
    fetchExtendexPairList(PRODUCT_ID);
    fetchQueryPairValuts();
  }, [address])

  // *******Get Vault Query *********

  // *----------Get list of all extended pair vaults Id's across product id----------*

  const fetchExtendexPairList = (productId) => {
    setLoading(true)
    queryExtendedPairVault(productId, (error, data) => {
      if (error) {
        message.error(error);
        return;
      }
      // console.log("Extented pair List", data);
      dispatch(setAllExtendedPair(data?.extendedPairIds));
      setLoading(false)

    })
  }

  // *----------Get list of all extended pair vaults----------*

  const fetchQueryPairValuts = () => {
    setLoading(true)
    queryPairVaults((error, data) => {
      if (error) {
        message.error(error);
        return;
      }
      // console.log("Pair vaults list", data);
      dispatch(setExtendedPairVaultListData(data))
      setLoading(false)
    })
  }

  if (loading) {
    return <h1>Loading...</h1>
  }
  return (
    <div className="app-content-wrapper vault-mint-main-container">

      <div className="card-main-container">
        {extenedPairVaultListData?.pairVault?.length > 0 && extenedPairVaultListData?.pairVault.map((item, index) => {
          if (item && !item.isPsmPair && item.appMappingId.low === PRODUCT_ID) {
            return (
              <React.Fragment key={index}>
                {item && !item.isPsmPair && item.appMappingId.low === PRODUCT_ID && (
                  <div className="card-container " onClick={() => {
                    dispatch(setCurrentPairID(item?.pairId?.low))
                    dispatch(setSelectedExtentedPairvault(item));
                    navigateToMint(item?.id?.low)
                  }}>
                    <div className="up-container">
                      <div className="icon-container">
                        <SvgIcon name={iconNameFromDenom("ucmdx")} />
                      </div>
                      <div className="vault-name-container">
                        <div className="vault-name">{item?.pairName}</div>
                        <div className="vault-desc">Lorem ipsum dolor, sit amet Pariatur, eos.</div>
                      </div>
                    </div>
                    <div className="bottom-container">
                      <div className="contenet-container">
                        <div className="name">Liquidation Ratio <TooltipIcon text="" /></div>
                        <div className="value">{(item?.liquidationRatio) / 10 ** 16} %</div>
                      </div>
                      <div className="contenet-container">
                        <div className="name">Min Collateralization Ratio <TooltipIcon text="" /></div>
                        <div className="value">{(item?.minCr) / 10 ** 16} %</div>
                      </div>
                      <div className="contenet-container">
                        <div className="name">Stability Fee <TooltipIcon text="" /></div>
                        <div className="value">{(item?.stabilityFee) / 10 ** 16} %</div>
                      </div>
                      <div className="contenet-container">
                        <div className="name">Min. Borrow Amount <TooltipIcon text="" /></div>
                        <div className="value"> {amountConversion(item?.debtFloor)} CMST</div>
                      </div>
                      <div className="contenet-container">
                        <div className="name">Debt Ceiling <TooltipIcon text="" /></div>
                        <div className="value"> {amountConversion(item?.debtCeiling)} CMST</div>
                      </div>
                    </div>
                  </div>
                )}
              </React.Fragment>
            )
          }
          // return (
          //   <React.Fragment key={index}>
          //     {item && !item.isPsmPair && item.appMappingId.low === PRODUCT_ID && (
          //       <div className="card-container " onClick={() => {
          //         dispatch(setCurrentPairID(item?.pairId?.low))
          //         dispatch(setSelectedExtentedPairvault(item));
          //         console.log(item);
          //         navigateToMint(item?.pairId?.low)
          //       }}>
          //         <div className="up-container">
          //           <div className="icon-container">
          //             <SvgIcon name={iconNameFromDenom("ucmdx")} />
          //           </div>
          //           <div className="vault-name-container">
          //             <div className="vault-name">{item?.pairName}</div>
          //             <div className="vault-desc">Lorem ipsum dolor, sit amet Pariatur, eos.</div>
          //           </div>
          //         </div>
          //         <div className="bottom-container">
          //           <div className="contenet-container">
          //             <div className="name">Liquidation Ratio <TooltipIcon text="" /></div>
          //             <div className="value">{(item?.liquidationRatio) / 10 ** 16} %</div>
          //           </div>
          //           <div className="contenet-container">
          //             <div className="name">Min Collateralization Ratio <TooltipIcon text="" /></div>
          //             <div className="value">{(item?.minCr) / 10 ** 16} %</div>
          //           </div>
          //           <div className="contenet-container">
          //             <div className="name">Stability Fee <TooltipIcon text="" /></div>
          //             <div className="value">{(item?.stabilityFee) / 10 ** 16} %</div>
          //           </div>
          //           <div className="contenet-container">
          //             <div className="name">Min. Borrow Amount <TooltipIcon text="" /></div>
          //             <div className="value"> {amountConversion(item?.debtFloor)} CMST</div>
          //           </div>
          //           <div className="contenet-container">
          //             <div className="name">Debt Ceiling <TooltipIcon text="" /></div>
          //             <div className="value"> {amountConversion(item?.debtCeiling)} CMST</div>
          //           </div>
          //         </div>
          //       </div>
          //     )}
          //   </React.Fragment>
          // )



        })}
      </div>
    </div>
  );
};

Minting.propTypes = {
  lang: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  setPairs: PropTypes.func.isRequired,
  // pairs: PropTypes.shape({
  //   list: PropTypes.arrayOf(
  //     PropTypes.shape({
  //       denomIn: PropTypes.string,
  //       denomOut: PropTypes.string,
  //       liquidationRatio: PropTypes.string,
  //       id: PropTypes.shape({
  //         high: PropTypes.number,
  //         low: PropTypes.number,
  //         unsigned: PropTypes.bool,
  //       }),
  //     })
  //   ),
  // }),
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
