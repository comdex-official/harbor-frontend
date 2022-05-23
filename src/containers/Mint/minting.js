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
import { useEffect, useState } from "react";
import { PRODUCT_ID } from "../../constants/common";
import { queryPairVault } from "../../services/asset/query";
import { setPairs } from "../../actions/asset";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setAllExtendedPariId } from "../../actions/locker";
import { amountConversion } from "../../utils/coin";

const Minting = ({
  lang,
  address,
  pair,
  setPairs,

}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // const extededPairId = useSelector((state) => state.locker.extededPairId);

  const [extendedPairId, setExtendedpairId] = useState();
  const [loading, setLoading] = useState(false);
  const [queryVault, setQueryVault] = useState();

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
      title: "Intrest Rate",
      dataIndex: "intrest_rate",
      key: "intrest_rate",
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
      intrest_rate: (
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

  const navigateToMint = () => {
    console.log("Clicked");
    navigate({
      pathname: `/vault`,
    });
  }

  useEffect(() => {
    fetchExtendexPairList(PRODUCT_ID);
    fetchQueryPairValut(1);
  }, [address])

  // *******Get Vault Query *********


  const fetchExtendexPairList = (productId) => {
    setLoading(true)
    queryExtendedPairVault(productId, (error, data) => {
      if (error) {
        message.error(error);
        return;
      }
      // dispatch(setAllExtendedPariId(data?.extendedPairIds[0]?.low));
      setExtendedpairId(data?.extendedPairIds[0]?.low)
      console.log("Extended Pair ID ", data?.extendedPairIds[0]?.low);
      setLoading(false)

    })
  }
  const fetchQueryPairValut = (extendexPairId) => {
    queryPairVault(extendexPairId, (error, data) => {
      if (error) {
        message.error(error);
        return;
      }
      console.log("QueryPair vault", data?.pairVault);
      setQueryVault(data?.pairVault);
      setPairs(data)
    })
  }
  if (loading) {
    return <h1>Loading...</h1>
  }

  return (
    <div className="app-content-wrapper vault-mint-main-container">
      {/* <Row> */}
      {/* <Col>
          <div className="composite-card py-3">
            <div className="card-content">
              <Table
                className="custom-table liquidation-table mint-table"
                dataSource={tableData}
                columns={columns}
                pagination={false}
                scroll={{ x: "100%" }}
              />
            </div>
          </div>
        </Col> */}

      {/* {extendedPairId?.map((item) => {
        return (
          <> */}

      <div className="card-main-container">
        <div className="card-container " onClick={() => {
          navigateToMint()
        }}>
          <div className="up-container">
            <div className="icon-container">
              <SvgIcon name={iconNameFromDenom("ucmdx")} />
            </div>
            <div className="vault-name-container">
              <div className="vault-name">CMDX - CMST </div>
              <div className="vault-desc">Lorem ipsum dolor, sit amet Pariatur, eos.</div>
            </div>
          </div>
          <div className="bottom-container">
            <div className="contenet-container">
              <div className="name">Liquidation Ratio <TooltipIcon text="" /></div>
              <div className="value">170%</div>
            </div>
            <div className="contenet-container">
              <div className="name">Min Collateralization Ratio <TooltipIcon text="" /></div>
              <div className="value">{(queryVault?.minCr) / 10 ** 16}%</div>
            </div>
            <div className="contenet-container">
              <div className="name">Stability Fee <TooltipIcon text="" /></div>
              <div className="value">{(queryVault?.stabilityFee) / 10 ** 16} %</div>
            </div>
            <div className="contenet-container">
              <div className="name">Min. Borrow Amount <TooltipIcon text="" /></div>
              <div className="value"> {amountConversion(queryVault?.debtFloor)} CMST</div>
            </div>
            <div className="contenet-container">
              <div className="name">Debt Ceiling <TooltipIcon text="" /></div>
              <div className="value"> {amountConversion(queryVault?.debtCeiling)} CMST</div>
            </div>
          </div>
        </div>
      </div>
      {/* </>
        )
      })} */}


      {/* <div className="card-main-container"> */}


      {/* <div className="card-container  ">
          <div className="up-container">
            <div className="icon-container">
              <SvgIcon name={iconNameFromDenom("uatom")} />
            </div>
            <div className="vault-name-container">
              <div className="vault-name">ATOM-A</div>
              <div className="vault-desc">Lorem ipsum dolor, sit amet Pariatur, eos.</div>
            </div>
          </div>
          <div className="bottom-container">
            <div className="contenet-container">
              <div className="name">Liquidation Ratio <TooltipIcon text="" /></div>
              <div className="value">170%</div>
            </div>
            <div className="contenet-container">
              <div className="name">Min Collateralization Ratio <TooltipIcon text="" /></div>
              <div className="value">0.25%</div>
            </div>
            <div className="contenet-container">
              <div className="name">Stability Fee <TooltipIcon text="" /></div>
              <div className="value">3%</div>
            </div>
            <div className="contenet-container">
              <div className="name">Min. Borrow Amount <TooltipIcon text="" /></div>
              <div className="value">0CMST</div>
            </div>
            <div className="contenet-container">
              <div className="name">Debt Ceiling <TooltipIcon text="" /></div>
              <div className="value">0CMST</div>
            </div>
          </div>
        </div>

        <div className="card-container  ">
          <div className="up-container">
            <div className="icon-container">
              <SvgIcon name={iconNameFromDenom("uatom")} />
            </div>
            <div className="vault-name-container">
              <div className="vault-name">ATOM-A</div>
              <div className="vault-desc">Lorem ipsum dolor, sit amet Pariatur, eos.</div>
            </div>
          </div>
          <div className="bottom-container">
            <div className="contenet-container">
              <div className="name">Liquidation Ratio <TooltipIcon text="" /></div>
              <div className="value">170%</div>
            </div>
            <div className="contenet-container">
              <div className="name">Min Collateralization Ratio <TooltipIcon text="" /></div>
              <div className="value">0.25%</div>
            </div>
            <div className="contenet-container">
              <div className="name">Stability Fee <TooltipIcon text="" /></div>
              <div className="value">3%</div>
            </div>
            <div className="contenet-container">
              <div className="name">Min. Borrow Amount <TooltipIcon text="" /></div>
              <div className="value">0CMST</div>
            </div>
            <div className="contenet-container">
              <div className="name">Debt Ceiling <TooltipIcon text="" /></div>
              <div className="value">0CMST</div>
            </div>
          </div>
        </div>

        <div className="card-container  ">
          <div className="up-container">
            <div className="icon-container">
              <SvgIcon name={iconNameFromDenom("uatom")} />
            </div>
            <div className="vault-name-container">
              <div className="vault-name">ATOM-A</div>
              <div className="vault-desc">Lorem ipsum dolor, sit amet Pariatur, eos.</div>
            </div>
          </div>
          <div className="bottom-container">
            <div className="contenet-container">
              <div className="name">Liquidation Ratio <TooltipIcon text="" /></div>
              <div className="value">170%</div>
            </div>
            <div className="contenet-container">
              <div className="name">Min Collateralization Ratio <TooltipIcon text="" /></div>
              <div className="value">0.25%</div>
            </div>
            <div className="contenet-container">
              <div className="name">Stability Fee <TooltipIcon text="" /></div>
              <div className="value">3%</div>
            </div>
            <div className="contenet-container">
              <div className="name">Min. Borrow Amount <TooltipIcon text="" /></div>
              <div className="value">0CMST</div>
            </div>
            <div className="contenet-container">
              <div className="name">Debt Ceiling <TooltipIcon text="" /></div>
              <div className="value">0CMST</div>
            </div>
          </div>
        </div>

        <div className="card-container  ">
          <div className="up-container">
            <div className="icon-container">
              <SvgIcon name={iconNameFromDenom("uatom")} />
            </div>
            <div className="vault-name-container">
              <div className="vault-name">ATOM-A</div>
              <div className="vault-desc">Lorem ipsum dolor, sit amet Pariatur, eos.</div>
            </div>
          </div>
          <div className="bottom-container">
            <div className="contenet-container">
              <div className="name">Liquidation Ratio <TooltipIcon text="" /></div>
              <div className="value">170%</div>
            </div>
            <div className="contenet-container">
              <div className="name">Min Collateralization Ratio <TooltipIcon text="" /></div>
              <div className="value">0.25%</div>
            </div>
            <div className="contenet-container">
              <div className="name">Stability Fee <TooltipIcon text="" /></div>
              <div className="value">3%</div>
            </div>
            <div className="contenet-container">
              <div className="name">Min. Borrow Amount <TooltipIcon text="" /></div>
              <div className="value">0CMST</div>
            </div>
            <div className="contenet-container">
              <div className="name">Debt Ceiling <TooltipIcon text="" /></div>
              <div className="value">0CMST</div>
            </div>
          </div>
        </div>

        <div className="card-container  ">
          <div className="up-container">
            <div className="icon-container">
              <SvgIcon name={iconNameFromDenom("uatom")} />
            </div>
            <div className="vault-name-container">
              <div className="vault-name">ATOM-A</div>
              <div className="vault-desc">Lorem ipsum dolor, sit amet Pariatur, eos.</div>
            </div>
          </div>
          <div className="bottom-container">
            <div className="contenet-container">
              <div className="name">Liquidation Ratio <TooltipIcon text="" /></div>
              <div className="value">170%</div>
            </div>
            <div className="contenet-container">
              <div className="name">Min Collateralization Ratio <TooltipIcon text="" /></div>
              <div className="value">0.25%</div>
            </div>
            <div className="contenet-container">
              <div className="name">Stability Fee <TooltipIcon text="" /></div>
              <div className="value">3%</div>
            </div>
            <div className="contenet-container">
              <div className="name">Min. Borrow Amount <TooltipIcon text="" /></div>
              <div className="value">0CMST</div>
            </div>
            <div className="contenet-container">
              <div className="name">Debt Ceiling <TooltipIcon text="" /></div>
              <div className="value">0CMST</div>
            </div>
          </div>
        </div> */}

      {/* </div> */}

      {/* </Row> */}
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
