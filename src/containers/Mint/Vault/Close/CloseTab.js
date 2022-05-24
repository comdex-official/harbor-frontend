import * as PropTypes from "prop-types";
import { connect, useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import variables from "../../../../utils/variables";
import { Button, message } from "antd";
import TooltipIcon from "../../../../components/TooltipIcon";
import { amountConversionWithComma, denomConversion, getDenomBalance } from "../../../../utils/coin";
import { amountConversion } from "../../../../utils/coin";
import { signAndBroadcastTransaction } from "../../../../services/helper";
import { defaultFee } from "../../../../services/transaction";
import { marketPrice } from "../../../../utils/number";
import { useNavigate, useParams } from "react-router";
import { setVault } from "../../../../actions/account";
import { setBalanceRefresh } from "../../../../actions/account";
import { DEFAULT_FEE, DOLLAR_DECIMALS, PRODUCT_ID } from "../../../../constants/common";
import "./index.scss";
import { denomToSymbol } from "../../../../utils/string";
import { queryVaultByOwner, queryVaults } from "../../../../services/Mint/query";
import { setUserLockedVaultData } from "../../../../actions/mint";
import Long from "long";

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
  const dispatch = useDispatch();
  const { pathVaultId } = useParams();

  const selectedExtentedPairVault = useSelector((state) => state.locker.selectedExtentedPairVault);
  const userVault = useSelector((state) => state.mint.userLockedVaultData.vault)
  // console.log("vault", vault);
  // console.log("vault", userVault?.id);
  const [inProgress, setInProgress] = useState(false);
  const navigate = useNavigate();

  const returnDenom = () => {
    let assetPair = selectedExtentedPairVault && selectedExtentedPairVault[0]?.pairName;
    if (assetPair === "cmdx-cmst") {
      console.log("yes");
    }
    switch (assetPair) {
      case "cmdx-cmst":
        return "ucmdx";
      case "osmo-cmst":
        return "uosmo";
      default:
        return "ucmdx";
    }
  }
  const collateralAssetBalance = getDenomBalance(balances, returnDenom()) || 0;

  useEffect(() => {
    queryUserVault('hbr2')
  }, [address])



  const queryUserVault = (id) => {
    setInProgress(true);
    queryVaults(id, (error, data) => {
      if (error) {
        message.error(error);
        return;
      }
      console.log("User vault", data);
      dispatch(setUserLockedVaultData(data))
      setInProgress(false)
    })
  }
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
            appMappingId: Long.fromNumber(PRODUCT_ID),
            extendedPairVaultId: Long.fromNumber(pathVaultId),
            userVaultid: userVault?.id,
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
            {amountConversion(userVault?.amountOut || 0)} CMST
          </div>
        </div>
        <div className="close-tab-row">
          <div className="text-left">
            {variables[lang].withdraw_amount}{" "}
            <TooltipIcon text={variables[lang].tooltip_withdraw_amount} />
          </div>
          <div className="text-right">

            {amountConversion(userVault?.amountIn || 0)} {denomToSymbol(returnDenom())}
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

// panic message redacted to hide potentially sensitive system info: panic