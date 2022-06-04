import React from "react";
import { Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchLedgerAddress } from "../../../actions/ledger";
import { getAccountNumber } from "../../../utils/number";

const ButtonSubmit = () => {
  const dispatch = useDispatch();
  const accountIndex = useSelector((state) => state.ledger.accountIndex);
  const accountNumber = useSelector((state) => state.ledger.accountNumber);

  const onClick = () => {
    dispatch(
      fetchLedgerAddress(
        getAccountNumber(accountNumber.value),
        getAccountNumber(accountIndex.value)
      )
    );
  };

  const disabled =
    accountIndex.error.message !== "" || accountNumber.error.message !== "";

  return (
    <Button
      className="button button-primary"
      type="button"
      value="Submit"
      disable={disabled}
      onClick={onClick}
    >
      Ledger
    </Button>
  );
};

export default ButtonSubmit;
