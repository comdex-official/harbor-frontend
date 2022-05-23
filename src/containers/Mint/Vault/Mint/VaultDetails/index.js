import React from 'react'

const VaultDetails = () => {
  return (
    <>
      <div className="composite-card farm-content-card earn-deposite-card ">
        <div className="card-head">
          <div className="head-left">Vault Details</div>
        </div>
        <div className="card-assets-container">
          <div className="assets-row">
            <div className="asset-name">Vault ID</div>
            <div className="asset-value">-</div>
          </div>
          <div className="assets-row">
            <div className="asset-name">interest Rate</div>
            <div className="asset-value">0.25%</div>
          </div>
          <div className="assets-row">
            <div className="asset-name">Closing Fee</div>
            <div className="asset-value">3%</div>
          </div>
          <div className="assets-row">
            <div className="asset-name">Liquidation Ratio</div>
            <div className="asset-value">170%</div>
          </div>
          <div className="assets-row">
            <div className="asset-name">Vault Opening date</div>
            <div className="asset-value">00.00.00</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default VaultDetails