import React from "react";
import PricePool from "../Mint/PricePool";
import VaultDetails from "../Mint/VaultDetails";
import Edit from "./Tab";
import "./index.scss";

const EditTab = () => {
  return (
    <>
      <div className="details-wrapper">
        <div className="details-left farm-content-card earn-deposite-card vault-mint-card">
          <Edit />
        </div>
        <div className="details-right">
          <PricePool />
          <VaultDetails />
        </div>
      </div>
    </>
  );
};

export default EditTab;
