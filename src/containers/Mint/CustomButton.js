import * as PropTypes from "prop-types";
import { Button, message } from "antd";
import { connect } from "react-redux";
import { defaultFee, getTypeURL } from "../../services/transaction";
import { getAmount } from "../../utils/coin";
import { signAndBroadcastTransaction } from "../../services/helper";
import React, { useEffect, useState } from "react";
import { setComplete } from "../../actions/swap";
import variables from "../../utils/variables";

const CustomButton = ({
  address,
  inAmount,
  outAmount,
  setComplete,
  pair,
  lang,
}) => {
  const [inProgress, setInProgress] = useState(false);

  useEffect(() => {
    setComplete(false);
  }, []);

  const handleClick = () => {
    if (!address) {
      message.error("Address not found, please connect to Keplr");
      return;
    }

    setInProgress(true);
    message.info("Transaction initiated");
    signAndBroadcastTransaction(
      {
        message: {
          typeUrl: getTypeURL("create"),
          value: {
            from: address,
            amountIn: getAmount(inAmount),
            amountOut: getAmount(outAmount),
            pairId: pair?.id,
          },
        },
        fee: defaultFee(),
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

        setComplete(true);
        message.success("Transaction success");
      }
    );
  };

  return (
    <Button
      loading={inProgress}
      disabled={
        inProgress || !Number(inAmount) || !Number(outAmount) || !pair?.id
      }
      type="primary"
      className="btn-filled"
      onClick={handleClick}
    >
      {variables[lang].agree}
    </Button>
  );
};

CustomButton.propTypes = {
  setComplete: PropTypes.func.isRequired,
  address: PropTypes.string,
  inAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  outAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  pair: PropTypes.shape({
    denomIn: PropTypes.string,
    denomOut: PropTypes.string,
  }),
};

const stateToProps = (state) => {
  return {
    address: state.account.address,
    lang: state.language,
    pair: state.asset.pair,
    inAmount: state.asset.inAmount,
    outAmount: state.asset.outAmount,
  };
};

const actionsToProps = {
  setComplete,
};

export default connect(stateToProps, actionsToProps)(CustomButton);
