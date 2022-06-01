import { message } from 'antd';
import * as PropTypes from "prop-types";
import React, { useEffect } from 'react'
import { connect, useSelector } from 'react-redux';
import { PRODUCT_ID } from '../../../../../constants/common';
import { queryOwnerVaults, queryOwnerVaultsInfo } from '../../../../../services/vault/query';
import { setOwnerVaultId, setOwnerVaultInfo } from '../../../../../actions/locker';
import moment from 'moment';


const VaultDetails = ({
  address,
  item,
  ownerVaultId,
  setOwnerVaultId,
  ownerVaultInfo,
  setOwnerVaultInfo,
}) => {

  const selectedExtentedPairVaultListData = useSelector((state) => state.locker.extenedPairVaultListData[0]);


  useEffect(() => {
    if (address && selectedExtentedPairVaultListData?.id?.low) {
      getOwnerVaultId(PRODUCT_ID, address, selectedExtentedPairVaultListData?.id?.low);
    }
  }, [address, item])

  useEffect(() => {
    if (ownerVaultId) {
      getOwnerVaultInfoByVaultId(ownerVaultId)
    }
  }, [address, ownerVaultId])


  const dateFormater = (value) => {
    let date = moment(value).format("DD/MM/YYYY");
    return date;

  }


  // ******* Get Vault Query *********

  // *----------Get the owner vaultId by productId, pairId , and address----------

  const getOwnerVaultId = (productId, address, extentedPairId) => {
    queryOwnerVaults(productId, address, extentedPairId, (error, data) => {
      if (error) {
        console.log(error);
        message.error(error);
        return;
      }
      console.log("Owner vault data", data);
      setOwnerVaultId(data?.vaultId)
    })
  }
  // *----------Get the owner vaultDetails by ownervaultId----------

  const getOwnerVaultInfoByVaultId = (ownerVaultId) => {
    queryOwnerVaultsInfo(ownerVaultId, (error, data) => {
      if (error) {
        message.error(error);
        return;
      }
      console.log(data);
      setOwnerVaultInfo(data?.vault)

    })
  }

  return (
    <>
      <div className="composite-card farm-content-card earn-deposite-card ">
        <div className="card-head">
          <div className="head-left">Vault Details</div>
        </div>
        <div className="card-assets-container">
          <div className="assets-row">
            <div className="asset-name">Vault ID</div>
            <div className="asset-value">{ownerVaultId || "-"}</div>
          </div>
          <div className="assets-row">
            <div className="asset-name">interest Rate</div>
            <div className="asset-value">{((selectedExtentedPairVaultListData?.stabilityFee) / 10 ** 16) || "-"} %</div>
          </div>
          <div className="assets-row">
            <div className="asset-name">Closing Fee</div>
            <div className="asset-value">{((selectedExtentedPairVaultListData?.stabilityFee) / 10 ** 16) || "-"} %</div>
          </div>
          <div className="assets-row">
            <div className="asset-name">Liquidation Ratio</div>
            <div className="asset-value">{((selectedExtentedPairVaultListData?.liquidationRatio) / 10 ** 16) || "-"} %</div>
          </div>
          <div className="assets-row">
            <div className="asset-name">Vault Opening date</div>
            <div className="asset-value">{ownerVaultInfo?.createdAt && dateFormater(ownerVaultInfo?.createdAt) || "00.00.00"}</div>
          </div>
        </div>
      </div>
    </>
  );
}
VaultDetails.prototype = {
  address: PropTypes.string,
  ownerVaultId: PropTypes.string,
  ownerVaultInfo: PropTypes.array,
}

const stateToProps = (state) => {
  return {
    address: state.account.address,
    ownerVaultId: state.locker.ownerVaultId,
    ownerVaultInfo: state.locker.ownerVaultInfo
  };
};

const actionsToProps = {
  setOwnerVaultId,
  setOwnerVaultInfo,
};
export default connect(stateToProps, actionsToProps)(VaultDetails);
