import * as PropTypes from "prop-types";
import { Button, Modal, message } from "antd";
import { Row, Col } from "../../../../components/common";
import { connect } from "react-redux";
import React, { useEffect, useState } from "react";
import { comdex } from "../../../../config/network";
import variables from "../../../../utils/variables";
import { defaultFee } from "../../../../services/transaction";
import { signAndBroadcastTransaction } from "../../../../services/helper";
import {
  amountConversion,
  amountConversionWithComma,
  denomConversion,
  getAmount,
  orderPriceConversion,
} from "../../../../utils/coin";
import Snack from "../../../../components/common/Snack";
import { ValidateInputNumber } from "../../../../config/_validation";
import { toDecimals } from "../../../../utils/string";
import CustomInput from "../../../../components/CustomInput";
import Long from "long";
import { DOLLAR_DECIMALS, PRODUCT_ID } from "../../../../constants/common";
import "./index.scss";
import { commaSeparator, decimalConversion } from "../../../../utils/number";
import Timer from "../../../../components/Timer";
import { querySingleDutchAuction } from "../../../../services/auction";

const PlaceBidModal = ({
  lang,
  address,
  auction,
  refreshData,
  params,
  balances,
  assetMap,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCurrentAuction, setNewCurrentAuction] = useState(auction)
  const [bidAmount, setBidAmount] = useState(0);
  const [inProgress, setInProgress] = useState(false);
  const [validationError, setValidationError] = useState();
  const [maxPrice, setMaxPrice] = useState();
  const [maxValidationError, setMaxValidationError] = useState();
  const [calculatedQuantityBid, setCalculatedQuantityBid] = useState();

  const fetchFilteredDutchAuctions = (auctionId, auctionMappingId) => {
    querySingleDutchAuction(auctionId, auctionMappingId, (error, data) => {
      if (error) {
        message.error(error);
        return;
      }
      setNewCurrentAuction(data?.auction)
    });
  };

  const showModal = () => {
    fetchFilteredDutchAuctions(auction?.auctionId, auction?.auctionMappingId);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleClick = () => {
    setInProgress(true);

    signAndBroadcastTransaction(
      {
        message: {
          typeUrl: "/comdex.auction.v1beta1.MsgPlaceDutchBidRequest",
          value: {
            bidder: address,
            auctionId: newCurrentAuction?.auctionId,
            amount: {
              denom: newCurrentAuction?.outflowTokenInitAmount?.denom,
              amount: getAmount(bidAmount, assetMap[newCurrentAuction?.outflowTokenCurrentAmount?.denom]?.decimals.toNumber()),
            },
            max: orderPriceConversion(maxPrice || 0),
            appId: Long.fromNumber(PRODUCT_ID),
            auctionMappingId: params?.dutchId,
          },
        },
        fee: defaultFee(),
        memo: "",
      },
      address,
      (error, result) => {
        setInProgress(false);
        setIsModalOpen(false);
        if (error) {
          setBidAmount(0);
          setMaxPrice(0);
          message.error(error);
          return;
        }

        if (result?.code) {
          message.info(result?.rawLog);
          return;
        }

        refreshData();
        setBidAmount(0);
        setMaxPrice(0);
        message.success(
          <Snack
            message={variables[lang].tx_success}
            explorerUrlToTx={comdex.explorerUrlToTx}
            hash={result?.transactionHash}
          />
        );
      }
    );
  };

  const handleChange = (value) => {
    value = toDecimals(value).toString().trim();

    setValidationError(
      ValidateInputNumber(
        value,
        Number(amountConversion(newCurrentAuction?.outflowTokenCurrentAmount?.amount, comdex?.coinDecimals, assetMap[newCurrentAuction?.outflowTokenCurrentAmount?.denom]?.decimals.toNumber()) || 0), "", "", "Bid must be less than Auction Quantity"
      )
    );
    setBidAmount(value);
  };

  const handleMaxPriceChange = (value) => {
    value = toDecimals(value).toString().trim();

    setMaxValidationError(ValidateInputNumber(getAmount(value)));
    setMaxPrice(value);
  };

  const calculateQuantityBidFor = () => {

    let calculatedAmount = Number(bidAmount * Number(
      amountConversion(
        decimalConversion(newCurrentAuction?.outflowTokenCurrentPrice) || 0, comdex?.coinDecimals, assetMap[newCurrentAuction?.outflowTokenCurrentPrice?.denom]?.decimals.toNumber()
      )
    )
    ).toFixed(6);
    setCalculatedQuantityBid(calculatedAmount);
  }

  useEffect(() => {
    calculateQuantityBidFor()
  }, [bidAmount, newCurrentAuction?.outflowTokenCurrentPrice])

  useEffect(() => {
    if (isModalOpen) {
      const interval = setInterval(() => {
        fetchFilteredDutchAuctions(newCurrentAuction?.auctionId, newCurrentAuction?.auctionMappingId)
      }, 5000)
      return () => {
        clearInterval(interval);
      }
    }
  }, [isModalOpen])

  return (
    <>
      <Button type="primary" size="small" className="px-3" onClick={showModal}>
        {" "}
        Place Bid{" "}
      </Button>
      <Modal
        centered={true}
        className="palcebid-modal auction-placebid-modal"
        footer={null}
        header={null}
        open={isModalOpen}
        width={550}
        closable={false}
        onOk={handleOk}
        onCancel={handleCancel}
        closeIcon={null}
      >
        <div className="palcebid-modal-inner">
          <Row>
            <Col sm="6">
              <p>Remaining Time </p>
            </Col>
            <Col sm="6" className="text-right">
              <label>
                <Timer expiryTimestamp={newCurrentAuction && newCurrentAuction.endTime} />
              </label>
            </Col>
          </Row>

          <Row>
            <Col sm="6">
              <p>Opening Auction Price</p>
            </Col>
            <Col sm="6" className="text-right">
              <label> $
                {
                  commaSeparator(
                    Number(
                      amountConversionWithComma(
                        decimalConversion(newCurrentAuction?.outflowTokenInitialPrice || 0) || 0, 4, assetMap[newCurrentAuction?.outflowTokenCurrentPrice?.denom]?.decimals.toNumber()
                      ) || 0
                    )
                  )
                }
              </label>
            </Col>
          </Row>
          <Row>
            <Col sm="6">
              <p>Current Auction Price</p>
            </Col>
            <Col sm="6" className="text-right">
              <label>
                $
                {commaSeparator(
                  Number(
                    amountConversionWithComma(
                      decimalConversion(newCurrentAuction?.outflowTokenCurrentPrice) || 0, 4, assetMap[newCurrentAuction?.outflowTokenCurrentPrice?.denom]?.decimals.toNumber()
                    ) || 0
                  )
                )}
              </label>
            </Col>
          </Row>

          <Row>
            <Col sm="6">
              <p>Auctioned Quantity </p>
            </Col>
            <Col sm="6" className="text-right" onClick={() => {
              handleChange((amountConversion(newCurrentAuction?.outflowTokenCurrentAmount?.amount || 0, comdex?.coinDecimals, assetMap[newCurrentAuction?.outflowTokenCurrentAmount?.denom]?.decimals.toNumber())))
            }}>
              <label style={{ cursor: "pointer" }} >
                {amountConversionWithComma(
                  newCurrentAuction?.outflowTokenCurrentAmount?.amount || 0, comdex?.coinDecimals, assetMap[newCurrentAuction?.outflowTokenCurrentAmount?.denom]?.decimals.toNumber()
                )} {denomConversion(newCurrentAuction?.outflowTokenCurrentAmount?.denom)}
              </label>
            </Col>
          </Row>

          <Row>
            <Col sm="6">
              <p> Target CMST</p>
            </Col>
            <Col sm="6" className="text-right">
              <label >
                {commaSeparator(
                  Number(amountConversion(newCurrentAuction?.inflowTokenTargetAmount?.amount, comdex?.coinDecimals, assetMap[newCurrentAuction?.inflowTokenCurrentAmount?.denom]?.decimals.toNumber()) - amountConversion(newCurrentAuction?.inflowTokenCurrentAmount?.amount, comdex?.coinDecimals, assetMap[newCurrentAuction?.inflowTokenCurrentAmount?.denom]?.decimals.toNumber())).toFixed(6) || 0
                )} {denomConversion(newCurrentAuction?.inflowTokenCurrentAmount?.denom)}
              </label>
            </Col>
          </Row>

          <Row>
            <Col sm="6">
              <p>Quantity Bid For</p>
            </Col>
            <Col sm="6" className="text-right">
              <CustomInput
                value={bidAmount}
                onChange={(event) => handleChange(event.target.value)}
                validationError={validationError}
              />
              <label><div className="input-denom">{denomConversion(newCurrentAuction?.outflowTokenCurrentAmount?.denom)}</div></label>

            </Col>
          </Row>
          <Row>
            <Col sm="6">
              <p>Your CMST Bid</p>
            </Col>
            <Col sm="6" className="text-right">
              <label >
                {calculatedQuantityBid}{" "}
                {denomConversion(newCurrentAuction?.inflowTokenCurrentAmount?.denom)}
              </label>
            </Col>
          </Row>
          <Row>
            <Col sm="6">
              <p>Acceptable Max Price</p>
            </Col>
            <Col sm="6" className="text-right">
              <CustomInput
                value={maxPrice}
                onChange={(event) => handleMaxPriceChange(event.target.value)}
                validationError={maxValidationError}
              />
              <label><div className="input-denom">{denomConversion(newCurrentAuction?.inflowTokenTargetAmount?.denom)}/{denomConversion(newCurrentAuction?.outflowTokenCurrentAmount?.denom)}</div></label>
            </Col>
          </Row>
          <Row className="p-0">
            <Col className="text-center mt-3">
              <Button
                type="primary"
                className="btn-filled px-5"
                size="large"
                loading={inProgress}
                disabled={!Number(bidAmount) || !Number(maxPrice) || validationError?.message}
                onClick={handleClick}
              >
                Place Bid
              </Button>
            </Col>
          </Row>
        </div>
      </Modal>
    </>
  );
};

PlaceBidModal.propTypes = {
  refreshData: PropTypes.func.isRequired,
  lang: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  assetMap: PropTypes.object,
  auction: PropTypes.shape({
    minBid: PropTypes.shape({
      amount: PropTypes.string,
      denom: PropTypes.string,
    }),
    bid: PropTypes.shape({
      amount: PropTypes.string,
      denom: PropTypes.string,
    }),
    id: PropTypes.shape({
      high: PropTypes.number,
      low: PropTypes.number,
      unsigned: PropTypes.bool,
    }),
  }),
  balances: PropTypes.arrayOf(
    PropTypes.shape({
      denom: PropTypes.string.isRequired,
      amount: PropTypes.string,
    })
  ),
  bidAmount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  discount: PropTypes.shape({
    low: PropTypes.number,
  }),
};

const stateToProps = (state) => {
  return {
    lang: state.language,
    bidAmount: state.auction.bidAmount,
    address: state.account.address,
    balances: state.account.balances.list,
    assetMap: state.asset.map,
  };
};

const actionsToProps = {};

export default connect(stateToProps, actionsToProps)(PlaceBidModal);
