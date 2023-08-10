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
  DEBT_AUCTION_TYPE,
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
  DOLLAR_DECIMALS,
  DUTCH_AUCTION_TYPE,
  SURPLUS_AUCTION_TYPE,
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
// import AuctionMarket from "./Auction Market/AuctionMarket";
import { queryAuctionsList, queryDutchAuctionsList, queryLimitBidProtocolDataWithUser, queryMarketAuctionsList, querySingleDutchAuctionsList } from "../../../services/auctionV2/query";
import { ValidateInputNumber } from "@/config/_validation";
import CountdownTimerForAuction from '../CountDownTimerForAuction';
import variables from "../../../utils/variables";
import { defaultFee } from "../../../services/transaction";
import { signAndBroadcastTransaction } from "../../../services/helper";
import Long from "long";
import Snack from "../../../components/common/Snack";

const DebtAuctions = ({
  markets,
  setPairs,
  lang,
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

  const [inProgress, setInProgress] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSingleAuction, setSelectedSingleAuction] = useState();
  const [receivableAmount, setReceivableAmount] = useState(0)
  const [bidAmount, setBidAmount] = useState(0);
  const [validationError, setValidationError] = useState();
  const [auctions, setAuctions] = useState();
  const [auctionPagination, setAuctionAuctionPagination] = useState()

  const tabItems =
    [
      { label: "Active", key: "1", children: <Bidding address={address} refreshBalance={refreshBalance} assetMap={assetMap} /> },
      { label: "Completed", key: "2", children: <InActiveBidding address={address} refreshBalance={refreshBalance} assetMap={assetMap} /> }
    ]

  useEffect(() => {
    setAuctionsPageSize(DEFAULT_PAGE_SIZE)
    setAuctionsPageNumber(DEFAULT_PAGE_NUMBER)
  }, [])


  useEffect(() => {
    fetchAuctions(DEBT_AUCTION_TYPE, (auctionsPageNumber - 1) * auctionsPageSize, auctionsPageSize, true, true);
    // fetchAuctions(SURPLUS_AUCTION_TYPE, (auctionsPageNumber - 1) * auctionsPageSize, auctionsPageSize, true, true);
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
        console.log(result, "result Debt ");
        if (result?.auctions?.length > 0) {
          setAuctions(result && result?.auctions, result?.pagination?.total?.toNumber());
          setAuctionAuctionPagination(result?.pagination?.total?.toNumber());
        }
        else {
          setAuctions("");
        }
        setInProgress(false);
      }
    );
  };

  console.log(auctions, "auctions");
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
      width: 150,
    },
    {
      title: (
        <>
          Bidding Asset{" "}
          <TooltipIcon text="Asset used to buy the auctioned asset" />
        </>
      ),
      dataIndex: "bridge_asset",
      key: "bridge_asset",
      width: 150,
    },
    {
      title: (
        <>
          Quantity <TooltipIcon text="Amount of asset in auction" />
        </>
      ),
      dataIndex: "quantity",
      key: "quantity",
      width: 200,
    },
    {
      title: (
        <>
          End Time <TooltipIcon text="Auction closing time" />
        </>
      ),
      dataIndex: "end_time",
      key: "end_time",
      width: 200,
      render: (end_time) => <div className="endtime-badge">{end_time}</div>,
    },
    {
      title: (
        <>
          Top Bid <TooltipIcon text="Current  bid" />
        </>
      ),
      dataIndex: "min_bid",
      key: "min_bid",
      width: 150,
      render: (item) => (
        <>
          {amountConversionWithComma(item?.collateralToken?.amount)}{" "} {denomConversion(item?.collateralToken?.denom)}
        </>
      ),
    },
    // {
    //   title: (
    //     <>
    //       {/* <FilterModal setPairs={setPairs} /> */}
    //       Bid
    //     </>
    //   ),
    //   dataIndex: "action",
    //   key: "action",
    //   align: "right",
    //   width: 140,
    //   render: (item) => (
    //     <>
    //       <PlaceBidModal
    //         params={params}
    //         auction={item}
    //         refreshData={fetchData}
    //         discount={params?.auctionDiscountPercent}
    //       />
    //     </>
    //   ),
    // },
  ];

  const tableData =
    auctions && auctions?.length > 0
      ? auctions?.map((item, index) => {
        return {
          key: index,
          id: item.id,
          auctioned_asset: (
            <>
              <div className="assets-withicon">
                <div className="assets-icon">
                  <NextImage src={iconList?.[item?.debtToken?.denom]?.coinImageUrl} height={30} width={30} alt="@icon" />
                </div>
                {denomConversion(item?.debtToken?.denom)}
              </div>
            </>
          ),
          bridge_asset: (
            <>
              <div className="assets-withicon display-center">
                <div className="assets-icon">
                  <NextImage src={iconList?.[item?.collateralToken?.denom]?.coinImageUrl} height={30} width={30} alt="@icon" />
                </div>
                {denomConversion(item?.collateralToken?.denom)}
              </div>
            </>
          ),
          end_time: moment(item && item.endTime).format("MMM DD, YYYY HH:mm"),
          quantity: (
            <>
              <div className="assets-withicon display-center">
                {/* <div className="assets-icon">
                  <NextImage src={iconList?.[item?.collateralToken?.denom]?.coinImageUrl} height={30} width={30} alt="@icon" />
                </div> */}
                {amountConversionWithComma(item?.debtToken?.amount)}{" "}
                {denomConversion(item?.debtToken?.denom)}
              </div>
            </>
          ),
          min_bid: item,
          action: item,
        };
      })
      : [];

  const handleChange = (value) => {
    setAuctionsPageNumber(value.current);
    setAuctionsPageSize(value.auctionsPageSize);
    fetchAuctions(
      DEBT_AUCTION_TYPE,
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
    // let calculatedAmount = fixedDecimalNumber(Number(value * Number(amountConversion(decimalConversion(selectedSingleAuction?.debtTokenOraclePrice) || 0, DOLLAR_DECIMALS, assetMap[selectedSingleAuction?.debtToken?.denom]?.decimals))) / amountConversion(decimalConversion(selectedSingleAuction?.collateralTokenAuctionPrice) || 0, DOLLAR_DECIMALS, assetMap[selectedSingleAuction?.collateralToken?.denom]?.decimals) || 0, DOLLAR_DECIMALS);

    // setValidationError(
    //   ValidateInputNumber(
    //     calculatedAmount,
    //     // Number(amountConversion(selectedSingleAuction?.debtToken?.amount, DOLLAR_DECIMALS, assetMap[selectedSingleAuction?.debtToken?.denom]?.decimals) || 0), "", "", "Bid must be less than Bid Asset"
    //     Number(amountConversion(selectedSingleAuction?.collateralToken?.amount, DOLLAR_DECIMALS, assetMap[selectedSingleAuction?.collateralToken?.denom]?.decimals)), "", "", "Bid must be less than Auction Quantity"
    //   )
    // );
    setBidAmount(value);
  };

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
              denom: selectedSingleAuction?.collateralToken?.denom,
              amount: getAmount(bidAmount, assetMap[selectedSingleAuction?.collateralToken?.denom]?.decimals),
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
                loading={inProgress}
                onChange={(event) => handleChange(event)}
                rowClassName={() => 'custom-table-with-hover'}
                onRow={(record, rowIndex) => {
                  return {
                    onClick: () => handelClickAuctionTable(record, rowIndex),
                  };
                }}
                pagination={{
                  total:
                    auctionPagination &&
                    auctionPagination &&
                    auctionPagination,
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
                      <div className="text">Top Bid</div>
                      <div className="value">{amountConversionWithComma(selectedSingleAuction?.collateralToken?.amount || 0, DOLLAR_DECIMALS, assetMap[selectedSingleAuction?.collateralToken?.denom]?.decimals) || 0} {" "}{" "}{denomConversion(selectedSingleAuction?.collateralToken?.denom)}</div>
                    </div>
                    <div className="target_cmst_box">
                      <div className="text">Target {" "}{denomConversion(selectedSingleAuction?.debtToken?.denom)}</div>
                      <div className="value">{amountConversionWithComma(selectedSingleAuction?.debtToken?.amount || 0, DOLLAR_DECIMALS, assetMap[selectedSingleAuction?.debtToken?.denom]?.decimals) || 0} {" "}{denomConversion(selectedSingleAuction?.debtToken?.denom)}</div>
                    </div>
                  </div>
                  <div className="balance_container">
                    <div className="title_text">Quantity Bid For</div>
                    <div className="value_box">
                      <div className="btn_box">
                        <Button className='maxhalf'> MAX</Button>
                      </div>
                      {amountConversionWithComma(getDenomBalance(balances, selectedSingleAuction?.collateralToken?.denom) || 0, DOLLAR_DECIMALS, assetMap[selectedSingleAuction?.collateralToken?.denom]?.decimals) || 0} {" "} {denomConversion(selectedSingleAuction?.collateralToken?.denom)}
                    </div>
                  </div>
                  <div className="token_with_input_container">
                    <div className="input_with_icon_container">
                      <div className="input_container">
                        <div className="icon_container">
                          <div className="assets-withicon">
                            <div className="assets-icons">
                              <NextImage src={iconList?.[selectedSingleAuction?.collateralToken?.denom]?.coinImageUrl} height={35} width={35} alt="@icon" />
                            </div>
                            <div className="name">
                              {denomConversion(selectedSingleAuction?.collateralToken?.denom)}
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

                  {/* <div className="receiable_amount_box">
                    <div className="text">
                      You will Receive
                    </div>
                    <div className="value">
                      {receivableAmount} {" "} {denomConversion(selectedSingleAuction?.collateralToken?.denom)}
                    </div>
                  </div> */}

                  <div className="button_container">
                    <Button type="primary" className="btn-filled" onClick={handlePlaceBid}>Place Bid</Button>
                  </div>

                </div>
              </div>
            </>
          </Modal>


          <div className="more-bottom " style={{ marginTop: "2rem" }}>
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

DebtAuctions.propTypes = {
  lang: PropTypes.string.isRequired,
  setPairs: PropTypes.func.isRequired,
  address: PropTypes.string,
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
  setBalanceRefresh,
  setAuctionsPageSize,
  setAuctionsPageNumber,
};

export default connect(stateToProps, actionsToProps)(DebtAuctions);
