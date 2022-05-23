import "./index.scss";
import * as PropTypes from "prop-types";
import { Col, Row } from "../../components/common";
import { connect } from "react-redux";
import React, { useEffect, useState } from "react";
import variables from "../../utils/variables";
import { Tabs, message } from "antd";
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_NUMBER } from "../../constants/common";
import { queryPairs } from "../../services/asset/query";
import { useLocation } from "react-router";
import { decode } from "../../utils/string";
import { queryVaultList } from "../../services/vault/query";
import { setAccountVaults } from "../../actions/account";
import { setAllExtendedPair } from "../../actions/asset";
import Minting from "./minting";

const { TabPane } = Tabs;

const Borrow = ({
  lang,
  address,
  vault,
  pairs,
  setPairs,
  setAccountVaults,

}) => {
  const [activeKey, setActiveKey] = useState("1");
  const location = useLocation();
  const type = decode(location.hash);

  useEffect(() => {
    if (type) {
      setActiveKey("2");
    }

    // if (!pairs.list.length) {
    //   fetchPairs(
    //     (DEFAULT_PAGE_NUMBER - 1) * DEFAULT_PAGE_SIZE,
    //     DEFAULT_PAGE_SIZE,
    //     true,
    //     false
    //   );
    // }
    // getVaults();
  }, [address]);

  // const fetchPairs = (offset, limit, countTotal, reverse) => {
  //   queryPairs(offset, 100, countTotal, reverse, (error, data) => {
  //     if (error) {
  //       message.error(error);
  //       return;
  //     }
  //   });
  // };

  // const getVaults = () => {
  //   fetchVaults(
  //     address,
  //     (DEFAULT_PAGE_NUMBER - 1) * DEFAULT_PAGE_SIZE,
  //     DEFAULT_PAGE_SIZE,
  //     true,
  //     false
  //   );
  // };

  // const fetchVaults = (address, offset, limit, isTotal, isReverse) => {
  //   queryVaultList(
  //     address,
  //     offset,
  //     limit,
  //     isTotal,
  //     isReverse,
  //     (error, result) => {
  //       if (error) {
  //         message.error(error);
  //         return;
  //       }

  //       setAccountVaults(result?.vaultsInfo, result?.pagination);
  //     }
  //   );
  // };

  return (
    <div className="app-content-wrapper">
      <Minting />
    </div>
  );
};

Borrow.propTypes = {
  setAccountVaults: PropTypes.func.isRequired,
  lang: PropTypes.string.isRequired,
  address: PropTypes.string,
  pairs: PropTypes.shape({
    list: PropTypes.arrayOf(
      PropTypes.shape({
        denomIn: PropTypes.string,
        denomOut: PropTypes.string,
        liquidationRatio: PropTypes.string,
        id: PropTypes.shape({
          high: PropTypes.number,
          low: PropTypes.number,
          unsigned: PropTypes.bool,
        }),
      })
    ),
  }),
  vault: PropTypes.shape({
    collateral: PropTypes.shape({
      denom: PropTypes.string,
    }),
    debt: PropTypes.shape({
      denom: PropTypes.string,
    }),
    id: PropTypes.shape({
      low: PropTypes.number,
    }),
  }),
};

const stateToProps = (state) => {
  return {
    lang: state.language,
    address: state.account.address,
    vault: state.account.vault,
  };
};

const actionToProps = {
  setAccountVaults,
  // setAllExtendedPair,
};

export default connect(stateToProps, actionToProps)(Borrow);
