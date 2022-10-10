import * as PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Button, message, Tabs } from "antd";
import { connect, useDispatch, useSelector } from "react-redux";
import { Col, Row } from "../../components/common";
import SurplusAuction from "./Surplus";
import DebtAuction from "./Debt";
import { setPairs } from "../../actions/asset";
import Collateral from "./Collateral";
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from "../../constants/common";
import { setAuctions } from "../../actions/auction";
import { queryDutchAuctionList, queryFilterDutchAuctions } from "../../services/auction";
import TooltipIcon from "../../components/TooltipIcon";

const Auctions = ({
  auctions,
  setAuctions,
}) => {
  const dispatch = useDispatch()
  const selectedAuctionedAsset = useSelector((state) => state.auction.selectedAuctionedAsset);

  const [activeKey, setActiveKey] = useState("1");
  const [disableFetchBtn, setdisableFetchBtn] = useState(false);
  const { TabPane } = Tabs;

  const [pageNumber, setPageNumber] = useState(DEFAULT_PAGE_NUMBER);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const callback = (key) => {
    setActiveKey(key);
  };


  const fetchAuctions = (offset, limit, isTotal, isReverse) => {
    queryDutchAuctionList(
      offset,
      limit,
      isTotal,
      isReverse,
      (error, result) => {
        if (error) {
          message.error(error);
          return;
        }
        if (result?.auctions?.length > 0) {
          setAuctions(result && result);
        }
        else {
          setAuctions("");
        }
      }
    );
  };

  const fetchFilteredDutchAuctions = (offset, limit, countTotal, reverse, asset) => {
    queryFilterDutchAuctions(offset, limit, countTotal, reverse, asset, (error, data) => {
      if (error) {
        message.error(error);
        return;
      }
      dispatch(setAuctions(data));
    });
  };

  const fetchLatestPrice = () => {
    setdisableFetchBtn(true)
    if (selectedAuctionedAsset?.length > 0) {
      fetchFilteredDutchAuctions((pageNumber - 1) * pageSize, pageSize, true, false, selectedAuctionedAsset)
    } else {
      fetchAuctions((pageNumber - 1) * pageSize, pageSize, true, false)
    }
  }
  useEffect(() => {
    const interval = setTimeout(() => {
      setdisableFetchBtn(false)
    }, 6000);
    return () => {
      clearInterval(interval);
    }
  }, [disableFetchBtn])


  const refreshAuctionButton = {
    right: (
      <>
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
      </>
    ),
  };

  return (
    <>
      <div className="app-content-wrapper">
        <Row>
          <Col>
            <Tabs
              className="comdex-tabs auction-extra-tabs"
              onChange={callback}
              activeKey={activeKey}
              tabBarExtraContent={refreshAuctionButton}
              items={[
                {
                  label: "Collateral",
                  key: "1",
                  children: <Collateral />
                },
                {
                  label: "Debt",
                  key: "2",
                  children: <DebtAuction />
                }
              ]}
            />
          </Col>
        </Row>
      </div>
    </>
  );
};

Auctions.propTypes = {
  lang: PropTypes.string.isRequired,
  setPairs: PropTypes.func.isRequired,
  auctions: PropTypes.string.isRequired,
};

const stateToProps = (state) => {
  return {
    lang: state.language,
    auctions: state.auction.auctions,
  };
};

const actionsToProps = {
  setPairs,
  setAuctions,
};

export default connect(stateToProps, actionsToProps)(Auctions);
