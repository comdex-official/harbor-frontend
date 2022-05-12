import { Col, Row } from "../../../components/common";
import React, { useEffect } from "react";
import { getDenomBalance } from "../../../utils/coin";
import { calculateUserShare } from "../../../utils/calculations";
import { marketPrice } from "../../../utils/number";
import { querySupply } from "../../../services/bank/query";
import { message } from "antd";
import { setPoolTokenSupply } from "../../../actions/liquidity";
import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import {DOLLAR_DECIMALS} from "../../../constants/common";

const Info = ({
  pool,
  balances,
  setPoolTokenSupply,
  poolTokenSupply,
  markets,
}) => {
  const userPoolBalance = getDenomBalance(balances, pool?.poolCoinDenom) || 0;
  const poolBalance = pool?.balances;

  useEffect(() => {
    if (pool?.poolCoinDenom) {
      fetchSupply(pool?.poolCoinDenom);
    }
  }, [pool]);

  const fetchSupply = (denom) => {
    querySupply(denom, (error, supply) => {
      if (error) {
        message.error(error);
        return;
      }

      setPoolTokenSupply(supply?.amount);
    });
  };

  const firstAssetShare = calculateUserShare(
    userPoolBalance,
    poolBalance[0]?.amount,
    poolTokenSupply
  );
  const secondAssetShare = calculateUserShare(
    userPoolBalance,
    poolBalance[1]?.amount,
    poolTokenSupply
  );

  const getUserLiquidity = () => {
    const share =
      Number(firstAssetShare) * marketPrice(markets, poolBalance[0]?.denom) +
      Number(secondAssetShare) * marketPrice(markets, poolBalance[1]?.denom);

    return share ? share.toFixed(DOLLAR_DECIMALS) : 0;
  };

  return (
    <div>
      <Row className="pool_balance mt-5 p-1">
        <Col className="label-right">My pool balance</Col>
        <Col className="text-right">${getUserLiquidity()||0} ≈ {userPoolBalance || 0} PoolToken</Col>
      </Row>
    </div>
  );
};

Info.propTypes = {
  lang: PropTypes.string.isRequired,
  setPoolTokenSupply: PropTypes.func.isRequired,
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
  pool: PropTypes.shape({
    id: PropTypes.shape({
      high: PropTypes.number,
      low: PropTypes.number,
      unsigned: PropTypes.bool,
    }),
    reserveAccountAddress: PropTypes.string,
    poolCoinDenom: PropTypes.string,
  }),
  poolTokenSupply: PropTypes.shape({
    amount: PropTypes.string,
    denom: PropTypes.string,
  }),
};

const stateToProps = (state) => {
  return {
    lang: state.language,
    pool: state.liquidity.pool._,
    balances: state.account.balances.list,
    poolTokenSupply: state.liquidity.poolTokenSupply,
    markets: state.oracle.market.list,
  };
};

const actionsToProps = {
  setPoolTokenSupply,
};

export default connect(stateToProps, actionsToProps)(Info);
