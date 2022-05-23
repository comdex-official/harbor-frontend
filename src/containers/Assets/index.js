import "./index.scss";
import * as PropTypes from "prop-types";
import { Col, Row, SvgIcon } from "../../components/common";
import { connect } from "react-redux";
import React from "react";
import { Table } from "antd";
import variables from "../../utils/variables";
import Deposit from "./Deposit";
import Withdraw from "./Withdraw";
import {
  amountConversion,
  amountConversionWithComma,
  denomConversion,
} from "../../utils/coin";
import { ibcAssetsInfo } from "../../config/ibc";
import { embedChainInfo } from "../../config/chain";
import { message } from "antd";
import { iconNameFromDenom } from "../../utils/string";
import { cmst, comdex } from "../../config/network";
import Lodash from "lodash";
import { marketPrice } from "../../utils/number";
import { DOLLAR_DECIMALS } from "../../constants/common";

const Assets = ({ lang, assetBalance, balances, markets }) => {
  const columns = [
    {
      title: "Asset",
      dataIndex: "asset",
      key: "asset",
    },
    {
      title: "Balances",
      dataIndex: "balances",
      key: "balances",
      align: "right",
      render: (balance) => (
        <>
          <p>{balance?.amount || 0}</p>
          <small>
            {amountConversion(balance?.value, DOLLAR_DECIMALS)}{" "}
            {variables[lang].USD}
          </small>
        </>
      ),
    },
    {
      title: "IBC Deposit",
      dataIndex: "ibcdeposit",
      key: "ibcdeposit",
      // width: 110,
      render: (value) => {
        if (value) {
          return <Deposit chain={value} />;
        }
      },
    },
    {
      title: "IBC Withdraw",
      dataIndex: "ibcwithdraw",
      key: "ibcwithdraw",
      width: 110,
      render: (value) => {
        if (value) {
          return <Withdraw chain={value} />;
        }
      },
    },
  ];

  const getPrice = (denom) => {
    return marketPrice(markets, denom) || 0;
  };

  const ibcBalances = ibcAssetsInfo.map((channelInfo) => {
    const chainInfo = embedChainInfo.filter(
      (item) => item.chainId === channelInfo.counterpartyChainId
    )[0];

    const originCurrency =
      chainInfo &&
      chainInfo.currencies.find(
        (cur) => cur.coinMinimalDenom === channelInfo.coinMinimalDenom
      );

    if (!originCurrency) {
      message.info(
        `Unknown currency ${channelInfo.coinMinimalDenom} for ${channelInfo.counterpartyChainId}`
      );
    }

    const ibcBalance = balances.find(
      (item) => item.denom === channelInfo?.ibcDenomHash
    );
    const value = getPrice(ibcBalance?.denom) * ibcBalance?.amount;

    return {
      chainInfo: chainInfo,
      denom: originCurrency?.coinMinimalDenom,
      balance: {
        amount: ibcBalance?.amount ? amountConversion(ibcBalance.amount) : 0,
        value: value || 0,
      },
      ibc: ibcBalance,
      sourceChannelId: channelInfo.sourceChannelId,
      destChannelId: channelInfo.destChannelId,
      isUnstable: channelInfo.isUnstable,
      currency: originCurrency,
    };
  });

  const nativeCoin = balances.filter(
    (item) => item.denom === comdex?.coinMinimalDenom
  )[0];
  const cmstCoin = balances.filter(
    (item) => item.denom === cmst?.coinMinimalDenom
  )[0];

  const nativeCoinValue = getPrice(nativeCoin?.denom) * nativeCoin?.amount;
  const cmstCoinValue = getPrice(cmstCoin?.denom) * cmstCoin?.amount;

  const currentChainData = [
    {
      key: comdex.chainId,
      asset: (
        <>
          <div className="assets-withicon">
            <div className="assets-icon">
              <SvgIcon name={iconNameFromDenom(comdex?.coinMinimalDenom)} />
            </div>{" "}
            {denomConversion(comdex?.coinMinimalDenom)}
          </div>
        </>
      ),
      balances: {
        amount: nativeCoin?.amount ? amountConversion(nativeCoin.amount) : 0,
        value: nativeCoinValue || 0,
      },
    },
    {
      key: comdex.chainId,
      asset: (
        <>
          <div className="assets-withicon">
            <div className="assets-icon">
              <SvgIcon name={iconNameFromDenom(cmst?.coinMinimalDenom)} />
            </div>{" "}
            {denomConversion(cmst?.coinMinimalDenom)}
          </div>
        </>
      ),
      balances: {
        amount: cmstCoin?.amount ? amountConversion(cmstCoin.amount) : 0,
        value: cmstCoinValue || 0,
      },
    },


  ];

  const tableIBCData =
    ibcBalances &&
    ibcBalances.map((item) => {
      return {
        key: item.denom,
        asset: (
          <>
            <div className="assets-withicon">
              <div className="assets-icon">
                <SvgIcon
                  name={iconNameFromDenom(item.currency?.coinMinimalDenom)}
                />
              </div>{" "}
              {item.currency?.coinDenom}{" "}
            </div>
          </>
        ),
        balances: item.balance,
        ibcdeposit: item,
        ibcwithdraw: item,
      };
    });

  const tableData = Lodash.concat(currentChainData, tableIBCData);

  return (
    <div className="app-content-wrapper">
      <div className=" assets-section">
        <Row>
          <Col>
            <div className="assets-head">
              <div>
                <h2>{variables[lang].comdex_assets}</h2>
              </div>
              <div>
                <span>{variables[lang].total_asset_balance}</span>{" "}
                {amountConversionWithComma(assetBalance, DOLLAR_DECIMALS)}{" "}
                {variables[lang].USD}
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table
              className="custom-table assets-table"
              dataSource={tableData}
              columns={columns}
              pagination={false}
              scroll={{ x: "100%" }}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

Assets.propTypes = {
  lang: PropTypes.string.isRequired,
  assetBalance: PropTypes.number,
  balances: PropTypes.arrayOf(
    PropTypes.shape({
      denom: PropTypes.string.isRequired,
      amount: PropTypes.string,
    })
  ),
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
};

const stateToProps = (state) => {
  return {
    lang: state.language,
    assetBalance: state.account.balances.asset,
    balances: state.account.balances.list,
    markets: state.oracle.market.list,
  };
};

export default connect(stateToProps)(Assets);
