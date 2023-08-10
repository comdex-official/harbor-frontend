import * as PropTypes from "prop-types";
import { Col, Row, SvgIcon } from "../../../components/common";
import { connect, useDispatch } from "react-redux";
import { Button, Modal, Table, Tabs } from "antd";
import PlaceBidModal from "./PlaceBidModal";
import "../../../styles/containers/Auctions/Auctions.module.scss";
import FilterModal from "../FilterModal/FilterModal";
import { setPairs } from "../../../actions/asset";
import { setAuctions } from "../../../actions/auction";
import Bidding from "./Bidding";
import { setBalanceRefresh } from "../../../actions/account";
import { setAuctionsPageSize, setAuctionsPageNumber } from "../../../actions/auction";
import {
  queryDutchAuctionList,
  queryAuctionParams,
  queryFilterDutchAuctions,
} from "../../../services/auction";
import {
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
  DOLLAR_DECIMALS,
  DUTCH_AUCTION_TYPE,
} from "../../../constants/common";
import { message } from "antd";
import { useState, useEffect } from "react";
import {
  amountConversion,
  amountConversionWithComma,
  denomConversion,
  getAmount,
  getDenomBalance,
} from "../../../utils/coin";
import moment from "moment";
import { iconNameFromDenom, toDecimals } from "../../../utils/string";
import { commaSeparator, decimalConversion, fixedDecimalNumber, marketPrice } from "../../../utils/number";
import TooltipIcon from "../../../components/TooltipIcon";
import { comdex } from "../../../config/network";
import NoDataIcon from "../../../components/common/NoDataIcon";
import InActiveBidding from "./inActiveBiddings";
import { MyTimer } from "../../../components/TimerForAirdrop";
import Timer from "../../../components/Timer";
import Image from "next/image";
import { ATOM } from "../../../components/image";
import { NextImage } from "../../../components/image/NextImage";
import CustomInput from "../../../components/CustomInput";
import AuctionMarket from "./Auction Market/AuctionMarket";
import { queryAuctionsList, queryDutchAuctionsList, queryLimitBidProtocolDataWithUser, queryMarketAuctionsList, querySingleDutchAuctionsList } from "../../../services/auctionV2/query";
import { ValidateInputNumber } from "@/config/_validation";
import CountdownTimerForAuction from '../CountDownTimerForAuction';
import { signAndBroadcastTransaction } from "../../../services/helper";
import { defaultFee } from "../../../services/transaction";
import Snack from "../../../components/common/Snack";
import variables from "../../../utils/variables";
import Long from "long";

const CollateralAuctions = ({
  markets,
  lang,
  updateBtnLoading,
  setPairs,
  auctions,
  setAuctions,
  refreshBalance,
  address,
  assetMap,
  auctionsPageSize,
  auctionsPageNumber,
  setAuctionsPageSize,
  setAuctionsPageNumber,
  balances,
  iconList
}) => {
  const dispatch = useDispatch()
  const { TabPane } = Tabs;

  const [inProgress, setInProgress] = useState(false);
  const [marketInProgress, setMarketInProgress] = useState(false);
  const [params, setParams] = useState({});
  const [activeKey, setActiveKey] = useState("1");
  const [selectedRow, setSelectedRow] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSingleAuction, setSelectedSingleAuction] = useState();
  const [receivableAmount, setReceivableAmount] = useState(0)
  const [bidAmount, setBidAmount] = useState(0);
  const [validationError, setValidationError] = useState();
  const [marketAuctionPageSize, setMarketAuctionPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [marketAuctionPageNumber, setMarketAuctionPageNumber] = useState(DEFAULT_PAGE_NUMBER)
  const [limitBidOrderList, setLimitBidOrderList] = useState("")

  const tabItems =
    [
      { label: "Active", key: "1", children: <Bidding address={address} refreshBalance={refreshBalance} assetMap={assetMap} /> },
      { label: "Completed", key: "2", children: <InActiveBidding address={address} refreshBalance={refreshBalance} assetMap={assetMap} /> }
    ]

  const callback = (key) => {
    setActiveKey(key);
  };


  useEffect(() => {
    setAuctionsPageSize(DEFAULT_PAGE_SIZE)
    setAuctionsPageNumber(DEFAULT_PAGE_NUMBER)
  }, [])


  useEffect(() => {
    fetchAuctions(DUTCH_AUCTION_TYPE, (auctionsPageNumber - 1) * auctionsPageSize, auctionsPageSize, true, true);
    // fetchMarketAuctionsLists("comdex18lhjf74ehq285g0k48nuskrq5a2ge9uzhqxqps", (marketAuctionPageNumber - 1) * marketAuctionPageSize, marketAuctionPageSize, true, true);
    fetchMarketAuctionsLists(address, (marketAuctionPageNumber - 1) * marketAuctionPageSize, marketAuctionPageSize, true, true);
  }, [address, refreshBalance])


  const fetchAuctions = (auctionType, offset, limit, isTotal, isReverse) => {
    setInProgress(true);
    queryDutchAuctionsList(
      auctionType,
      offset,
      limit,
      isTotal,
      isReverse,
      (error, result) => {
        if (error) {
          setInProgress(false);
          message.error(error);
          return;
        }
        if (result?.auctions?.length > 0) {
          setAuctions(result && result?.auctions, result?.pagination?.total?.toNumber());
        }
        else {
          setAuctions("");
        }
        setInProgress(false);
      }
    );
  };

  const fetchMarketAuctionsList = (offset, limit, isTotal, isReverse) => {
    setMarketInProgress(true);
    queryMarketAuctionsList(
      offset,
      limit,
      isTotal,
      isReverse,
      (error, result) => {
        if (error) {
          setMarketInProgress(false);
          message.error(error);
          return;
        }
        if (result?.limitBidProtocolData?.length > 0) {
          // console.log(result?.limitBidProtocolData, "result Market Auction");
          // setAuctions(result && result?.auctions, result?.pagination?.total?.toNumber());
          setLimitBidOrderList(result?.limitBidProtocolData)
        }
        else {
          setLimitBidOrderList("");
        }
        setMarketInProgress(false);
      }
    );
  };
  const fetchMarketAuctionsLists = (address, offset, limit, isTotal, isReverse) => {
    setMarketInProgress(true);
    queryLimitBidProtocolDataWithUser(
      address,
      offset,
      limit,
      isTotal,
      isReverse,
      (error, result) => {
        if (error) {
          setMarketInProgress(false);
          message.error(error);
          return;
        }
        if (result?.limitBidProtocolDataWithUser?.length > 0) {
          setLimitBidOrderList(result?.limitBidProtocolDataWithUser)
        }
        else {
          setLimitBidOrderList("");
        }
        setMarketInProgress(false);
      }
    );
  };

  const fetchSingleDutchAuction = (auctionId) => {
    querySingleDutchAuctionsList(auctionId, (error, result) => {
      if (error) {
        message.error(error);
        return;
      }
      console.log(result, "Single Auction Listv2");
      setSelectedSingleAuction(result?.auction)
    })
  }

  const columns = [
    {
      title: (
        <>
          Auctioned Asset <TooltipIcon text="Asset to be sold in the auction" />
        </>
      ),
      dataIndex: "auctioned_asset",
      key: "auctioned_asset",
      width: 170,
    },
    {
      title: (
        <>
          Bid Asset{" "}
          <TooltipIcon text="Asset used to buy the auctioned asset" />
        </>
      ),
      dataIndex: "bridge_asset",
      key: "bridge_asset",
      width: 180,
    },
    // {
    //   title: (
    //     <>
    //       Auctioned Quantity <TooltipIcon text="Amount of Auctioned asset being sold" />
    //     </>
    //   ),
    //   dataIndex: "quantity",
    //   key: "quantity",
    //   width: 170,
    // },
    {
      title: (
        <>
          Time Remaining <TooltipIcon text="Auction closing time" />
        </>
      ),
      dataIndex: "end_time",
      key: "end_time",
      width: 180,
      render: (end_time) => <div className="endtime-badge">{end_time}</div>,
    },
    {
      title: (
        <>
          Oracle Price
        </>
      ),
      dataIndex: "oracle_price",
      key: "oracle_price",
      width: 120,
      // align:"left"
    },
    {
      title: (
        <>
          Current Auction Price <TooltipIcon text="Current price of auction asset" />
        </>
      ),
      dataIndex: "current_price",
      key: "current_price",
      width: 150,
      align: "center",
      render: (item) => (
        <>
          $
          {commaSeparator(
            Number(
              amountConversion(decimalConversion(item?.collateralTokenAuctionPrice) || 0, DOLLAR_DECIMALS) || 0
            )
          )}
        </>
      ),
    },
    // {
    //   title: (
    //     <>
    //       Bid
    //     </>
    //   ),
    //   dataIndex: "action",
    //   key: "action",
    //   align: "right",
    //   width: 80,
    //   render: (item) => (
    //     <>
    //       <PlaceBidModal
    //         params={params}
    //         auction={item}
    //         discount={params?.auctionDiscountPercent}
    //       />
    //     </>
    //   ),
    // },
  ];

  const tableData =
    auctions && auctions?.auctions?.length > 0
      ? auctions?.auctions?.map((item, index) => {
        return {
          key: index,
          id: item.id,
          auctioned_asset: (
            <>
              <div className="assets-withicon">
                <div className="assets-icon">
                  {/* <SvgIcon
                    name={iconNameFromDenom(
                      item?.collateralToken?.denom
                    )}
                  /> */}
                  <NextImage src={iconList?.[item?.collateralToken?.denom]?.coinImageUrl} height={30} width={30} alt="@icon" />
                </div>
                {item?.collateralToken?.amount &&
                  amountConversionWithComma(
                    item?.collateralToken?.amount, DOLLAR_DECIMALS, assetMap[item?.collateralToken?.denom]?.decimals
                  )} {" "}
                {denomConversion(item?.collateralToken?.denom)}
              </div>
            </>
          ),
          bridge_asset: (
            <>
              <div className="assets-withicon ">
                <div className="assets-icon">
                  {/* <SvgIcon
                    name={iconNameFromDenom(
                      item?.debtToken?.denom
                    )}
                  /> */}
                  <NextImage src={iconList?.[item?.debtToken?.denom]?.coinImageUrl} height={30} width={30} alt="@icon" />
                </div>
                {item?.debtToken?.amount &&
                  amountConversionWithComma(
                    item?.debtToken?.amount, DOLLAR_DECIMALS, assetMap[item?.debtToken?.denom]?.decimals
                  )} {" "}
                {denomConversion(item?.debtToken?.denom)}
              </div>
            </>
          ),
          // end_time: moment(item && item.endTime).format("MMM DD, YYYY HH:mm"),
          // end_time: <Timer expiryTimestamp={item && item.endTime} />,
          end_time: <CountdownTimerForAuction endTime={item && item.endTime} placeBidModal={false} />,
          quantity:
            <div>
              {item?.outflowTokenCurrentAmount?.amount &&
                amountConversionWithComma(
                  item?.outflowTokenCurrentAmount?.amount, comdex?.coinDecimals, assetMap[item?.outflowTokenCurrentAmount?.denom]?.decimals
                )} {denomConversion(item?.outflowTokenCurrentAmount?.denom)}
            </div>,
          // oracle_price: "$" + commaSeparator(Number(marketPrice(markets, item?.collateralToken?.denom, assetMap[item?.collateralToken?.denom]?.id) || 0).toFixed(DOLLAR_DECIMALS)),
          oracle_price: "$" + commaSeparator(Number(amountConversion(decimalConversion(item?.collateralTokenOraclePrice) || 0, DOLLAR_DECIMALS) || 0)),
          current_price: item,
          action: item,
        };
      })
      : [];

  const handleChange = (value) => {
    setAuctionsPageNumber(value.current);
    setAuctionsPageSize(value.auctionsPageSize);
    fetchAuctions(
      DUTCH_AUCTION_TYPE,
      (value.current - 1) * value.auctionsPageSize,
      value.auctionsPageSize,
      true,
      true
    );
  };

  const handelClickAuctionTable = (e, rowIndex) => {
    setSelectedRow(e?.action)
    fetchSingleDutchAuction(e?.action?.auctionId)
    showModal()
  }

  const handleInputChange = (value) => {
    value = toDecimals(value).toString().trim();
    let calculatedAmount = fixedDecimalNumber(Number(value * Number(amountConversion(decimalConversion(selectedSingleAuction?.debtTokenOraclePrice) || 0, DOLLAR_DECIMALS, assetMap[selectedSingleAuction?.debtToken?.denom]?.decimals))) / amountConversion(decimalConversion(selectedSingleAuction?.collateralTokenAuctionPrice) || 0, DOLLAR_DECIMALS, assetMap[selectedSingleAuction?.collateralToken?.denom]?.decimals) || 0, DOLLAR_DECIMALS);

    setValidationError(
      ValidateInputNumber(
        value,
        Number(amountConversion(selectedSingleAuction?.debtToken?.amount, DOLLAR_DECIMALS, assetMap[selectedSingleAuction?.debtToken?.denom]?.decimals) || 0), "", "", "Bid must be less than Bid Asset"
        // Number(amountConversion(selectedSingleAuction?.collateralToken?.amount, DOLLAR_DECIMALS, assetMap[selectedSingleAuction?.collateralToken?.denom]?.decimals)), "", "", "Bid must be less than Auction Quantity"
      )
    );
    setBidAmount(value);
  };

  const handleMaxClick = () => {
    setBidAmount(amountConversion(selectedSingleAuction?.debtToken?.amount || 0, comdex?.coinDecimals, assetMap[selectedSingleAuction?.debtToken?.denom]?.decimals) || 0)
  }

  const calculateQuantityBidFor = () => {
    let calculatedAmount = fixedDecimalNumber(Number(bidAmount * Number(amountConversion(decimalConversion(selectedSingleAuction?.debtTokenOraclePrice) || 0, DOLLAR_DECIMALS, assetMap[selectedSingleAuction?.debtToken?.denom]?.decimals))) / amountConversion(decimalConversion(selectedSingleAuction?.collateralTokenAuctionPrice) || 0, DOLLAR_DECIMALS, assetMap[selectedSingleAuction?.collateralToken?.denom]?.decimals) || 0, DOLLAR_DECIMALS);
    setReceivableAmount(calculatedAmount);
  }

  useEffect(() => {
    calculateQuantityBidFor()
  }, [bidAmount, selectedSingleAuction?.collateralTokenAuctionPrice])

  useEffect(() => {
    if (isModalOpen) {
      const interval = setInterval(() => {
        fetchSingleDutchAuction(selectedRow?.auctionId)
      }, 5000)
      return () => {
        clearInterval(interval);
      }
    }
  }, [isModalOpen])

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handlePlaceBid = () => {
    setInProgress(true);
    signAndBroadcastTransaction(
      {
        message: {
          // typeUrl: "/comdex.auctionV2.v1beta1.MsgPlaceMarketBidRequest",
          typeUrl: "/comdex.auctionsV2.v1beta1.MsgPlaceMarketBidRequest",
          value: {
            bidder: address,
            auctionId: Long.fromNumber(selectedSingleAuction?.auctionId?.toNumber()),
            amount: {
              denom: selectedSingleAuction?.debtToken?.denom,
              amount: getAmount(bidAmount, assetMap[selectedSingleAuction?.debtToken?.denom]?.decimals),
            },
          },
        },
        fee: defaultFee(),
        memo: "",
      },
      address,
      (error, result) => {
        setInProgress(false);
        // setIsModalOpen(false);
        if (error) {
          // setBidAmount(0);
          message.error(error);
          return;
        }
        if (result?.code) {
          message.info(result?.rawLog);
          return;
        }
        // setBidAmount(0);
        message.success(
          <Snack
            message={variables[lang].tx_success}
            explorerUrlToTx={comdex.explorerUrlToTx}
            hash={result?.transactionHash}
          />
        );
        dispatch({
          type: "BALANCE_REFRESH_SET",
          value: refreshBalance + 1,
        });
      }
    );
  };

  return (
    <div className="app-content-wrapper">
      <Row>
        <Col>
          <div className={auctions?.auctions?.length > 0 ? "composite-card py-3" : "composite-card py-3 height-16"}>
            <div className="card-content">
              <Table
                className="custom-table liquidation-table"
                dataSource={tableData}
                columns={columns}
                loading={inProgress || updateBtnLoading}
                onChange={(event) => handleChange(event)}
                rowClassName={() => 'custom-table-with-hover'}
                onRow={(record, rowIndex) => {
                  return {
                    onClick: () => handelClickAuctionTable(record, rowIndex),
                  };
                }}
                pagination={{
                  total:
                    auctions &&
                    auctions.pagination &&
                    auctions.pagination,
                  auctionsPageSize,
                }}
                scroll={{ x: "100%" }}
                locale={{ emptyText: <NoDataIcon /> }}
              />
            </div>
          </div>

          {/* PlceBid Modal  */}

          <Modal
            centered={true}
            className="palce_bid_modal"
            footer={null}
            header={null}
            open={isModalOpen}
            width={450}
            // closable={(width < 650) ? true : null}
            onOk={handleOk}
            onCancel={handleCancel}
          // closeIcon={null}
          >
            <>
              <div className="place_bid_modal_main_container">
                <div className="place_bid_modal_container">
                  <CountdownTimerForAuction endTime={selectedSingleAuction?.endTime} placeBidModal={true} />
                  <div className="auction_quantity_container">
                    <div className="price_box">
                      <div className="text">Current Auction Price</div>
                      <div className="value">{`$${commaSeparator(Number(amountConversion(decimalConversion(selectedSingleAuction?.collateralTokenAuctionPrice) || 0, DOLLAR_DECIMALS) || 0))}`}</div>
                    </div>
                    <div className="target_cmst_box">
                      <div className="text">Target{" "}{denomConversion(selectedSingleAuction?.debtToken?.denom)}</div>
                      <div className="value">{amountConversionWithComma(selectedSingleAuction?.debtToken?.amount || 0, comdex?.coinDecimals, assetMap[selectedSingleAuction?.debtToken?.denom]?.decimals) || 0} {" "}{" "}{denomConversion(selectedSingleAuction?.debtToken?.denom)}</div>
                    </div>
                  </div>
                  <div className="balance_container">
                    <div className="title_text">Quantity Bid For</div>
                    <div className="value_box">
                      <div className="btn_box">
                        <Button className='maxhalf' onClick={handleMaxClick}> MAX</Button>
                      </div>
                      {amountConversionWithComma(getDenomBalance(balances, selectedSingleAuction?.debtToken?.denom) || 0, DOLLAR_DECIMALS, assetMap[selectedSingleAuction?.debtToken?.denom]?.decimals) || 0} {" "} {denomConversion(selectedSingleAuction?.debtToken?.denom)}
                    </div>
                  </div>
                  <div className="token_with_input_container">
                    <div className="input_with_icon_container">
                      <div className="input_container">
                        <div className="icon_container">
                          <div className="assets-withicon">
                            <div className="assets-icons">
                              <NextImage src={iconList?.[selectedSingleAuction?.debtToken?.denom]?.coinImageUrl} height={35} width={35} alt="@icon" />
                            </div>
                            <div className="name">
                              {denomConversion(selectedSingleAuction?.debtToken?.denom)}
                            </div>
                          </div>
                        </div>
                        <div className="custom_input_container">
                          <CustomInput
                            className='custom-input'
                            value={bidAmount}
                            onChange={(event) => handleInputChange(event.target.value)}
                            validationError={validationError}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="receiable_amount_box">
                    <div className="text">
                      You will Receive
                    </div>
                    <div className="value">
                      {receivableAmount} {" "} {denomConversion(selectedSingleAuction?.collateralToken?.denom)}
                    </div>
                  </div>

                  <div className="button_container">
                    <Button type="primary"
                      className="btn-filled"
                      onClick={handlePlaceBid}
                      disabled={
                        validationError?.message ||
                        !bidAmount
                      }
                    >Place Bid</Button>
                  </div>

                </div>
              </div>
            </>
          </Modal>


          {/* Auction Market  */}

          <div className="more-bottom mt-3">
            <h3 className="title ">Limit Order Bid</h3>
            <div className="more-bottom-card">
              <Row>
                <Col>
                  <AuctionMarket
                    address={address}
                    refreshBalance={refreshBalance}
                    assetMap={assetMap}
                    limitBidOrderList={limitBidOrderList}
                    marketAuctionPageSize={marketAuctionPageSize}
                    marketAuctionPageNumber={marketAuctionPageNumber}
                    iconList={iconList}
                    marketInProgress={marketInProgress}
                  />
                </Col>
              </Row>
            </div>
          </div>


          <div className="more-bottom " style={{ marginTop: "6rem" }}>
            <h3 className="title ">Bidding History</h3>
            <div className="more-bottom-card">
              <Row>
                <Col>
                  <InActiveBidding address={address} refreshBalance={refreshBalance} assetMap={assetMap} iconList={iconList} />
                </Col>
              </Row>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

CollateralAuctions.propTypes = {
  lang: PropTypes.string.isRequired,
  setPairs: PropTypes.func.isRequired,
  address: PropTypes.string,
  auctions: PropTypes.string.isRequired,
  assetMap: PropTypes.object,
  refreshBalance: PropTypes.number.isRequired,
  auctionsPageSize: PropTypes.number.isRequired,
  auctionsPageNumber: PropTypes.number.isRequired,
  markets: PropTypes.object,
  balances: PropTypes.arrayOf(
    PropTypes.shape({
      denom: PropTypes.string.isRequired,
      amount: PropTypes.string,
    })
  ),
};

const stateToProps = (state) => {
  return {
    lang: state.language,
    address: state.account.address,
    auctions: state.auction.auctions,
    auctionsPageSize: state.auction.auctionsPageSize,
    auctionsPageNumber: state.auction.auctionsPageNumber,
    assetMap: state.asset.map,
    refreshBalance: state.account.refreshBalance,
    markets: state.oracle.market,
    balances: state.account.balances.list,
    iconList: state.config?.iconList,
  };
};

const actionsToProps = {
  setPairs,
  setAuctions,
  setBalanceRefresh,
  setAuctionsPageSize,
  setAuctionsPageNumber,
};

export default connect(stateToProps, actionsToProps)(CollateralAuctions);
