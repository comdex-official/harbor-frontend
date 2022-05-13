import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import React, { useState } from "react";
import variables from "../../../../utils/variables";
import { Button, message } from "antd";
import TooltipIcon from "../../../../components/TooltipIcon";
import { denomConversion, getDenomBalance } from "../../../../utils/coin";
import { amountConversion } from "../../../../utils/coin";
import { signAndBroadcastTransaction } from "../../../../services/helper";
import { defaultFee } from "../../../../services/transaction";
import { marketPrice } from "../../../../utils/number";
import { useNavigate } from "react-router";
import { setVault } from "../../../../actions/account";
import { setBalanceRefresh } from "../../../../actions/account";
import { DEFAULT_FEE, DOLLAR_DECIMALS } from "../../../../constants/common";
import "./index.scss";

const CloseTab = ({
  lang,
  address,
  vault,
  markets,
  setVault,
  refreshBalance,
  setBalanceRefresh,
  balances,
}) => {
  const [inProgress, setInProgress] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    setInProgress(true);

    if (
      Number(getDenomBalance(balances, vault?.debt?.denom)) <
      Number(vault?.debt?.amount)
    ) {
      message.info("Insufficient funds");
      setInProgress(false);
      return;
    }

    signAndBroadcastTransaction(
      {
        message: {
          typeUrl: "/comdex.vault.v1beta1.MsgCloseRequest",
          value: {
            from: address,
            id: vault?.id,
          },
        },
        fee: defaultFee(),
        memo: "",
      },
      address,
      (error, result) => {
        setInProgress(false);
        if (error) {
          message.error(error);
          return;
        }

        if (result?.code) {
          message.info(result?.rawLog);
          return;
        }

        setVault({}); // clearing local vault as it is closed.
        setBalanceRefresh(refreshBalance + 1);
        message.success("success");
        navigate({
          pathname: `/home`,
          hash: "2",
        });
      }
    );
  };

  return (
    <div className="borrw-content-card ">
      <div className="close-tab-content">
        <div className="close-tab-row">
          <div className="text-left">
            {variables[lang].burn_amount}{" "}
            <TooltipIcon text={variables[lang].tooltip_burn_amount} />
          </div>
          <div className="text-right">
            {amountConversion(vault?.debt?.amount || 10000000)} CMST
            {/* {denomConversion(vault?.debt?.denom)} */}
          </div>
        </div>
        <div className="close-tab-row">
          <div className="text-left">
            {variables[lang].withdraw_amount}{" "}
            <TooltipIcon text={variables[lang].tooltip_withdraw_amount} />
          </div>
          <div className="text-right">
            {amountConversion(vault?.collateral?.amount || 110000000)} ATOM
            {/* {denomConversion(vault?.collateral?.denom)} */}
          </div>
        </div>
      </div>
      <div className="assets-form-btn">
        <Button
          loading={inProgress}
          disabled={inProgress}
          type="primary"
          onClick={() => handleClick()}
          className="btn-filled"
        >
          {variables[lang].close}
        </Button>
      </div>
    </div>
  );
};

CloseTab.propTypes = {
  lang: PropTypes.string.isRequired,
  setBalanceRefresh: PropTypes.func.isRequired,
  setVault: PropTypes.func.isRequired,
  address: PropTypes.string,
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
  refreshBalance: PropTypes.number.isRequired,
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
    markets: state.oracle.market.list,
    refreshBalance: state.account.refreshBalance,
    balances: state.account.balances.list,
  };
};

const actionsToProps = {
  setVault,
  setBalanceRefresh,
};

export default connect(stateToProps, actionsToProps)(CloseTab);
