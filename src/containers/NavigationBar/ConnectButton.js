import * as PropTypes from "prop-types";
import { Button, Dropdown } from "antd";
import { SvgIcon } from "../../components/common";
import { connect } from "react-redux";
import { decode } from "js-base64";
import {
  setAccountAddress,
  setAccountName,
  showAccountConnectModal,
} from "../../actions/account";
import DisConnectModal from "../DisConnectModal";
import React, { useEffect } from "react";
import variables from "../../utils/variables";
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from "../../constants/common";
import {
  setAccountBalances,
  setPoolBalance,
  setcAssetBalance,
  setAssetBalance,
  setDebtBalance,
  setCollateralBalance,
} from "../../actions/account";
import { queryAllBalances } from "../../services/bank/query";
import Lodash from "lodash";
import { setAccountVaults } from "../../actions/account";
import ConnectModal from "../Modal";
import { marketPrice } from "../../utils/number";
import { queryMarketList } from "../../services/oracle/query";
import { setMarkets } from "../../actions/oracle";
import { fetchKeplrAccountName } from "../../services/keplr";
import { cmst, comdex, harbor } from "../../config/network";

const ConnectButton = ({
  setAccountAddress,
  address,
  setAccountBalances,
  lang,
  setAssetBalance,
  setcAssetBalance,
  setPoolBalance,
  markets,
  setAccountVaults,
  setCollateralBalance,
  setDebtBalance,
  refreshBalance,
  setMarkets,
  poolBalances,
  setAccountName,
  pools,
}) => {
  useEffect(() => {
    const savedAddress = localStorage.getItem("ac");
    const userAddress = savedAddress ? decode(savedAddress) : address;

    fetchMarkets();
    // getVaults();

    if (userAddress) {
      setAccountAddress(userAddress);

      fetchKeplrAccountName().then((name) => {
        setAccountName(name);
      });

      fetchBalances(userAddress);
    }
  }, [address, refreshBalance]);

  useEffect(() => {
    if (address) {
      fetchBalances(
        address,
        (DEFAULT_PAGE_NUMBER - 1) * DEFAULT_PAGE_SIZE,
        DEFAULT_PAGE_SIZE,
        true,
        false
      );
    }
  }, [address, markets]);

  useEffect(() => {
    // getVaults();
  }, [pools]);

  const fetchBalances = (address) => {
    queryAllBalances(address, (error, result) => {
      if (error) {
        return;
      }

      setAccountBalances(result.balances, result.pagination);
      calculateAssetBalance(result.balances);
      calculatecAssetBalance(result.balances);
      calculatePoolBalance(result.balances);
    });
  };

  const fetchMarkets = (offset, limit, isTotal, isReverse) => {
    queryMarketList(offset, limit, isTotal, isReverse, (error, result) => {
      if (error) {
        return;
      }
      if (result?.markets?.length > 0) {
        setMarkets(result?.markets, result?.pagination);
      }
    });
  };

  const calculatecAssetBalance = (balances) => {
    const cAssets = balances.filter(
      (item) =>
        item.denom.substr(0, 2) === "uc" && !(item.denom.substr(0, 3) === "ucm")
    );
    const value = cAssets.map((item) => {
      return marketPrice(markets, item.denom) * item.amount;
    });

    setcAssetBalance(Lodash.sum(value));
  };

  const calculatePoolBalance = () => {
    const sum = Lodash.sumBy(poolBalances);

    setPoolBalance(Number(sum * 10 ** 6));
  };

  const getPrice = (denom) => {
    return marketPrice(markets, denom) || 0;
  };

  const calculateAssetBalance = (balances) => {
    const assetBalances = balances.filter(
      (item) =>
        item.denom.substr(0, 4) === "ibc/" ||
        item.denom === comdex.coinMinimalDenom ||
        item.denom === cmst.coinMinimalDenom ||
        item.denom === harbor.coinMinimalDenom
    );

    const value = assetBalances.map((item) => {
      return getPrice(item.denom) * item.amount;
    });

    setAssetBalance(Lodash.sum(value));
  };

  const WalletConnectedDropdown = <ConnectModal />;

  return (
    <>
      {address ? (
        <div className="connected_div">
          <div className="connected_left">
            <div className="testnet-top">
              <SvgIcon name="testnet" />
              {variables[lang].testnet}
            </div>
          </div>
          <DisConnectModal />
        </div>
      ) : (
        <div>
          <Dropdown
            overlay={WalletConnectedDropdown}
            placement="bottomRight"
            trigger={["click"]}
          >
            <Button shape="round" type="primary">
              {variables[lang].connect}
            </Button>
          </Dropdown>
        </div>
      )}
    </>
  );
};

ConnectButton.propTypes = {
  lang: PropTypes.string.isRequired,
  refreshBalance: PropTypes.number.isRequired,
  setAccountAddress: PropTypes.func.isRequired,
  showAccountConnectModal: PropTypes.func.isRequired,
  setAccountBalances: PropTypes.func.isRequired,
  setAccountName: PropTypes.func.isRequired,
  setAssetBalance: PropTypes.func.isRequired,
  setAccountVaults: PropTypes.func.isRequired,
  setcAssetBalance: PropTypes.func.isRequired,
  setCollateralBalance: PropTypes.func.isRequired,
  setDebtBalance: PropTypes.func.isRequired,
  setMarkets: PropTypes.func.isRequired,
  setPoolBalance: PropTypes.func.isRequired,
  address: PropTypes.string,
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
  poolBalances: PropTypes.array,
  pools: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.shape({
        high: PropTypes.number,
        low: PropTypes.number,
        unsigned: PropTypes.bool,
      }),
      reserveAccountAddress: PropTypes.string,
      poolCoinDenom: PropTypes.string,
      reserveCoinDenoms: PropTypes.array,
    })
  ),
  show: PropTypes.bool,
};

const stateToProps = (state) => {
  return {
    lang: state.language,
    address: state.account.address,
    show: state.account.showModal,
    markets: state.oracle.market.list,
    refreshBalance: state.account.refreshBalance,
    poolBalances: state.liquidity.poolBalances,
    pools: state.liquidity.pool.list,
  };
};

const actionsToProps = {
  showAccountConnectModal,
  setAccountAddress,
  setAccountBalances,
  setPoolBalance,
  setcAssetBalance,
  setAssetBalance,
  setAccountVaults,
  setDebtBalance,
  setCollateralBalance,
  setMarkets,
  setAccountName,
};

export default connect(stateToProps, actionsToProps)(ConnectButton);
