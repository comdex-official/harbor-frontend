import * as PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Button, message, Tabs } from "antd";
import { connect } from "react-redux";
import { Col, Row } from "../../components/common";
import SurplusAuction from "./Surplus";
import DebtAuction from "./Debt";
import { setPairs } from "../../actions/asset";
import { setAuctionsPageSize, setAuctionsPageNumber } from "../../actions/auction";
import Collateral from "./Collateral";
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE, DUTCH_AUCTION_TYPE } from "../../constants/common";
import { setAuctions } from "../../actions/auction";
import TooltipIcon from "../../components/TooltipIcon";
import { queryAuctionsList } from "@/services/auctionV2/query";
import { queryDutchAuctionsList } from "../../services/auctionV2/query";

const Auctions = ({
  auctions,
  setAuctions,
  auctionsPageSize,
  auctionsPageNumber,
  setAuctionsPageSize,
  setAuctionsPageNumber,
}) => {

  const [activeKey, setActiveKey] = useState("1");
  const [disableFetchBtn, setdisableFetchBtn] = useState(false);
  const [updateBtnLoading, setUpdateBtnLoadiing] = useState(false)
  const { TabPane } = Tabs;


  useEffect(() => {
    setAuctionsPageSize(DEFAULT_PAGE_SIZE)
    setAuctionsPageNumber(DEFAULT_PAGE_NUMBER)
  }, [])

  const tabItems =
    [
      { label: "Collateral", key: "1", children: <Collateral updateBtnLoading={updateBtnLoading} /> },
      { label: "Debt", key: "2", children: <DebtAuction /> },
      { label: "Surplus", key: "3", children: <SurplusAuction /> }
    ]

  const callback = (key) => {
    setActiveKey(key);
  };


  const fetchAuctions = (auctionType,offset, limit, isTotal, isReverse) => {
    setUpdateBtnLoadiing(true)
    queryDutchAuctionsList(
      auctionType,
      offset,
      limit,
      isTotal,
      isReverse,
      (error, result) => {
        if (error) {
          setUpdateBtnLoadiing(false)
          message.error(error);
          return;
        }
        if (result?.auctions?.length > 0) {
          setAuctions(result && result?.auctions, result?.pagination?.total?.toNumber());
          setUpdateBtnLoadiing(false)
        }
        else {
          setAuctions("");
          setUpdateBtnLoadiing(false)
        }
      }
    );
  };

  const fetchLatestPrice = () => {
    setdisableFetchBtn(true)
    fetchAuctions(DUTCH_AUCTION_TYPE,(auctionsPageNumber - 1) * auctionsPageSize, auctionsPageSize, true, true)
  }

  useEffect(() => {
    const interval = setTimeout(() => {
      setdisableFetchBtn(false)
    }, 6000);
    return () => {
      clearInterval(interval);
    }
  }, [disableFetchBtn])


  return (
    <>
      <div className="app-content-wrapper auction-extra-tab-btn-relative">
        <Row>
          <Col>
            <Tabs
              className="comdex-tabs auction-extra-tabs"
              onChange={callback}
              activeKey={activeKey}
              items={tabItems}
            />
          </Col>

          {activeKey === "1" && <div className="auction-extra-tab-btn">
            <Col>
              <Row >
                <div className="locker-up-main-container">
                  <div className="locker-up-container mr-4">
                    <div className="claim-container ">
                      <div className="claim-btn">
                        <Button
                          type="primary"
                          className="btn-filled mr-1"
                          disabled={disableFetchBtn}
                          onClick={() => fetchLatestPrice()}
                        >Update Auction Price </Button> <TooltipIcon text="The price of the auction changes every block, click on the button to update the price for placing accurate bids." />
                      </div>
                    </div>
                  </div>
                </div>

              </Row>
            </Col>
          </div>}
        </Row>
      </div>
    </>
  );
};

Auctions.propTypes = {
  lang: PropTypes.string.isRequired,
  setPairs: PropTypes.func.isRequired,
  auctions: PropTypes.object.isRequired,
  auctionsPageSize: PropTypes.number.isRequired,
  auctionsPageNumber: PropTypes.number.isRequired,
};

const stateToProps = (state) => {
  return {
    lang: state.language,
    auctions: state.auction.auctions,
    auctionsPageSize: state.auction.auctionsPageSize,
    auctionsPageNumber: state.auction.auctionsPageNumber,
  };
};

const actionsToProps = {
  setPairs,
  setAuctions,
  setAuctionsPageSize,
  setAuctionsPageNumber,
};

export default connect(stateToProps, actionsToProps)(Auctions);
