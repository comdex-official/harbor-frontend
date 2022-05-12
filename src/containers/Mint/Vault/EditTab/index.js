import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import { setVault } from "../../../actions/account";
import { setBalanceRefresh } from "../../../actions/account";
import EditTab  from "./Tab";

EditTab.propTypes = {
  lang: PropTypes.string.isRequired,
  setBalanceRefresh: PropTypes.func.isRequired,
  setVault: PropTypes.func.isRequired,
  balances: PropTypes.arrayOf(
    PropTypes.shape({
      denom: PropTypes.string.isRequired,
      amount: PropTypes.string,
    })
  ),
  refreshBalance: PropTypes.number.isRequired,
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
  vaults: PropTypes.arrayOf(
    PropTypes.shape({
      collateral: PropTypes.shape({
        amount: PropTypes.string,
        denom: PropTypes.string,
      }),
      debt: PropTypes.shape({
        amount: PropTypes.string,
        denom: PropTypes.string,
      }),
      id: PropTypes.shape({
        high: PropTypes.number,
        low: PropTypes.number,
        unsigned: PropTypes.bool,
      }),
    })
  ),
};

const stateToProps = (state) => {
  return {
    lang: state.language,
    address: state.account.address,
    vault: state.account.vault,
    vaults: state.account.vaults.list,
    markets: state.oracle.market.list,
    balances: state.account.balances.list,
    refreshBalance: state.account.refreshBalance,
  };
};

const actionsToProps = {
  setVault,
  setBalanceRefresh,
};

export default connect(stateToProps, actionsToProps)(EditTab);
