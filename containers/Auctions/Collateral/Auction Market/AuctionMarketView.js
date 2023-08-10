import React, { useEffect, useState } from 'react'
import { NextImage } from '../../../../components/image/NextImage';
import { ATOM, EMPTYBG } from '../../../../components/image';
import { Button, Input, message } from 'antd';
import "../../../../styles/containers/Auctions/Auctions.module.scss";
import Link from 'next/link';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import moment from 'moment';
import { formatNumber } from '../../../../utils/number';
import CustomInput from '../../../../components/CustomInput';
import { Col, Row } from '../../../../components/common';
import UserBidTable from './UserBid/UserBidTable';
// import drilldown from 'highcharts/modules/drilldown';
import { queryUserLimitBidsByAssetID } from '@/services/auctionV2/query';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE, DOLLAR_DECIMALS } from '../../../../constants/common';
import { connect, useDispatch } from 'react-redux';
import * as PropTypes from "prop-types";
import { amountConversion, amountConversionWithComma, denomConversion, getAmount, getDenomBalance } from '../../../../utils/coin';
import variables from "../../../../utils/variables";
import Snack from '../../../../components/common/Snack';
import { signAndBroadcastTransaction } from "../../../../services/helper";
import { defaultFee } from "../../../../services/transaction";
import Long from 'long';

const AuctionMarketView = ({
  address,
  lang,
  assetMap,
  filteredMarketBidData,
  balances,
  refreshBalance,
  iconList
}) => {
  const dispatch = useDispatch();

  const [discountValue, setDiscountValue] = useState();
  const [bidAmount, setBidAmount] = useState()
  const [inProgress, setInProgress] = useState(false);

  const options = {
    chart: {
      type: "column",
      inverted: false,
      polar: false,
      height: 300,
      backgroundColor: 'transparent',
    },
    title: {
      text: null
    },
    credits: {
      enabled: false // Hide the Highcharts.com text
    },
    xAxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      labels: {
        style: {
          color: '#B7B1E5',
          fontSize: 12,
          fontWeight: 400
        }
      }
    },
    // colors: [
    //   '#4caefe',
    //   '#3fbdf3',
    //   '#35c3e8',
    //   '#2bc9dc',
    //   '#20cfe1',
    //   '#16d4e6',
    //   '#0dd9db',
    //   '#03dfd0',
    //   '#00e4c5',
    //   '#00e9ba',
    //   '#00eeaf',
    //   '#23e274'
    // ],
    plotOptions: {
      series: {
        borderWidth: 0,
        maxPointWidth: 20,
        borderRadiusTopLeft: 4,
        borderRadiusTopRight: 4
      },
      column: {
        opacity: 1,
      }
    },
    legend: {
      enabled: false,
    },
    tooltip: {
      className: 'chart-tooltip',
      useHTML: true,
      padding: 0,
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: '#fff',
      borderRadius: 15,
      formatter: function () {
        return '<div class="chart-tooltip">' + '<div class="date">' + "15th May, 22" + '</div>' + '<div class="bottom-row">' + '<span class="circle"></span>' + 'CMST' + '  ' + ((this.y)) + '</div>' + '</div>';
      }
    },
    yAxis: {
      title: null,
      gridLineColor: '#393767',
      tickInterval: 500,
      labels: {
        formatter: function () {
          return '$' + this.value;
        },
        style: {
          color: '#B7B1E5',
          fontSize: 12,
          fontWeight: 400
        }
      }
    },
    // series: [{
    //   type: 'column',
    //   borderRadius: 2,
    //   borderColor: "transparent",
    //   colorByPoint: true,
    //   data: [5412, 4977, 4730, 4437, 3947, 3707, 4143, 3609, 3311, 3072, 2899, 2887],
    //   showInLegend: false,

    // }]
    // series: [
    //   {
    //     data: [5412, 4977, 4730, 4437, 3947, 3707, 4143, 3609, 3311, 3072, 2899, 2887],
    //     color: '#0969C9',
    //   }
    // ],
    series: [
      {
        data: [
          {
            y: 2342, color: {
              linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
              stops: [
                [0, '#8857E9 '],   // Start color
                [1, '#4876E7 ']    // End color
              ]
            }
          },
          {
            y: 1800, color: {
              linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
              stops: [
                [0, '#8857E9 '],   // Start color
                [1, '#4876E7 ']    // End color
              ]
            }
          },
          {
            y: 1523, color: {
              linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
              stops: [
                [0, '#8857E9 '],   // Start color
                [1, '#4876E7 ']    // End color
              ]
            }
          },
          {
            y: 4209, color: {
              linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
              stops: [
                [0, '#8857E9 '],   // Start color
                [1, '#4876E7 ']    // End color
              ]
            }
          },
          {
            y: 980, color: {
              linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
              stops: [
                [0, '#8857E9 '],   // Start color
                [1, '#4876E7 ']    // End color
              ]
            }
          },
          {
            y: 1000, color: {
              linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
              stops: [
                [0, '#8857E9 '],   // Start color
                [1, '#4876E7 ']    // End color
              ]
            }
          },
          {
            y: 3180, color: {
              linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
              stops: [
                [0, '#8857E9 '],   // Start color
                [1, '#4876E7 ']    // End color
              ]
            }
          },
          {
            y: 2500, color: {
              linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
              stops: [
                [0, '#8857E9 '],   // Start color
                [1, '#4876E7 ']    // End color
              ]
            }
          },
          {
            y: 4180, color: {
              linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
              stops: [
                [0, '#8857E9 '],   // Start color
                [1, '#4876E7 ']    // End color
              ]
            }
          },
          {
            y: 2180, color: {
              linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
              stops: [
                [0, '#8857E9 '],   // Start color
                [1, '#4876E7 ']    // End color
              ]
            }
          },
          {
            y: 1180, color: {
              linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
              stops: [
                [0, '#8857E9 '],   // Start color
                [1, '#4876E7 ']    // End color
              ]
            }
          },

        ],
      },
    ],
  };
  console.log(filteredMarketBidData, "filteredMarketBidData");
  const onPlusClick = () => {
    console.log(Number(discountValue), "Number(Plus discountValue )");
    if (Number(discountValue + 1) <= 100) {
      setDiscountValue(Number(discountValue) + 1)
    }
  }

  const onNegativeClick = () => {
    if (Number(discountValue - 1) >= 0) {
      setDiscountValue(Number(discountValue) - 1)
    }
  }

  const onDiscountInputChange = (e) => {
    console.log(e.target.value, "input va;lue");

    // const { value } = e.target.value;

    // const parsedValue = parseInt(value, 10);
    // if (!isNaN(parsedValue)) {
    //   if (e.target.value >= 0 && e.target.value <= 100) {
    //     setDiscountValue(Number(e.target.value))
    //   }
    // }

    // working 
    // if (e.target.value >= 0 && e.target.value <= 100) {
    //   setDiscountValue(Number(e.target.value))
    // }
    // }
    const value = e.target.value;
    // Remove any non-numeric characters
    const sanitizedValue = value.replace(/\D/g, '');
    // Parse the sanitized value to an integer
    const parsedValue = parseInt(sanitizedValue, 10);
    // Ensure the parsed value is within the range of 0 to 100
    const finalValue = Math.min(Math.max(parsedValue, 0), 100);

    // Set the finalValue as the input value
    setDiscountValue(finalValue);

  }

  const handleDepositLimtBid = () => {
    if (!address) {
      message.error("Address not found, please connect to Keplr");
      return;
    }
    setInProgress(true);
    message.info("Transaction initiated");
    signAndBroadcastTransaction(
      {
        message: {
          typeUrl: "/comdex.auctionsV2.v1beta1.MsgDepositLimitBidRequest",
          value: {
            bidder: address,
            collateralTokenId: Long.fromNumber(filteredMarketBidData?.collateralAssetId?.toNumber()),
            debtTokenId: Long.fromNumber(filteredMarketBidData?.debtAssetId?.toNumber()),
            premiumDiscount: String(discountValue),
            amount: {
              denom: filteredMarketBidData?.debtAssetDenom,
              amount: getAmount(bidAmount, assetMap[filteredMarketBidData?.debtAssetDenom]?.decimals),
            },
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
        message.success(
          <Snack
            message={variables[lang].tx_success}
            hash={result?.transactionHash}
          />
        );
        // resetValues();
        dispatch({
          type: "BALANCE_REFRESH_SET",
          value: refreshBalance + 1,
        });
      }
    );
  };

  return (
    <>
      <div className="auction_view_main_container">
        <div className="auction_view_container">
          <div className="top_container">
            <div className="title">
              <NextImage src={iconList?.[filteredMarketBidData?.collateralAssetDenom]?.coinImageUrl || EMPTYBG} height={35} width={35} alt="@icon" />
              <span style={{ marginLeft: "-15px", marginRight: "15px" }}>
                <NextImage src={iconList?.[filteredMarketBidData?.debtAssetDenom]?.coinImageUrl || EMPTYBG} height={35} width={35} alt="@icon" />
              </span>
              Bid for liquidated ATOM using CMST
            </div>
            <div className="button">
              <Link href='/auctions'> <Button type='primary'>Back</Button></Link>
            </div>
          </div>
          <div className="bottom_container">
            <div className="bottom_container_main_container">
              <div className="bottom_container_main">
                <div className="left_box card_container">
                  <HighchartsReact highcharts={Highcharts} options={options} />
                </div>
                <div className="right_box">
                  {/* <div className="pool_value_container card_container">
                    <div className="total_pool_value_container">
                      <div className="title">Total Pool Value</div>
                      <div className="value">513.9 CMST</div>
                    </div>
                    <div className="total_collateral_value_container">
                      <div className="title">Total Locked Collateral Value</div>
                      <div className="value">23.2k</div>
                    </div>
                  </div> */}
                  <div className="bid_container card_container">
                    <div className="title">Place Bid</div>
                    <div className="discount_container">
                      <div className="discount_title">Discount</div>
                      <div className="discount_input_container">
                        <span className='add_btn' onClick={onNegativeClick}>-</span>
                        <Input className='input_with_no_border'
                          type='number'
                          placeholder='0.00'
                          onChange={(e) => onDiscountInputChange(e)}
                          value={discountValue} suffix={"%"}
                        />
                        <span className='subtract_btn' onClick={onPlusClick}>+</span>
                      </div>
                    </div>
                    <div className="available_bid_container">
                      <div className="available_title">Bid Amount</div>
                      <div className="available_box">
                        <Button type='primary' className='maxhalf mr-2'>Max</Button>
                        {amountConversionWithComma(getDenomBalance(balances, filteredMarketBidData?.debtAssetDenom) || 0, DOLLAR_DECIMALS, assetMap[filteredMarketBidData?.debtAssetDenom]?.decimals)} {" "}
                        {denomConversion(filteredMarketBidData?.debtAssetDenom)}
                      </div>
                    </div>
                    <div className="bid_input_container">
                      <div className="input_box">
                        <Input className='input_with_no_border'
                          value={bidAmount}
                          type='number'
                          placeholder='0.00'
                          onChange={(e) => setBidAmount(e.target.value)}
                          suffix={`${denomConversion(filteredMarketBidData?.debtAssetDenom) || " "}`}
                        />
                      </div>
                      {/* <div className="denom_box">CMST</div> */}
                    </div>
                    <div className="note_container">
                      NOTE: withdrawal of a successful bid will include a 0.5% fee. All fees are paid to CMST stakers.
                    </div>
                    <div className="bid_btn_container">
                      <Button type='primary'
                        className='btn-filled'
                        loading={inProgress}
                        onClick={handleDepositLimtBid}
                      >Place Bid</Button>
                    </div>
                  </div>
                </div>

                <div className="pool_value_container card_container">
                  <div className="total_pool_value_container">
                    <div className="pool_value_title">Total Bid Value</div>
                    <div className="pool_value_value">{formatNumber(amountConversion(filteredMarketBidData?.bidValue || 0, DOLLAR_DECIMALS, assetMap[filteredMarketBidData?.debtAssetDenom]?.decimals))} {" "} {denomConversion(filteredMarketBidData?.debtAssetDenom)}</div>
                  </div>
                  <div className="total_collateral_value_container">
                    <div className="pool_value_title">Your Total Bid Value</div>
                    <div className="pool_value_value">23.2k CMST</div>
                  </div>
                </div>

              </div>
            </div>
          </div>



          <div className="more-bottom mt-3">
            <h3 className="title ">Your Bids</h3>
            <div className="more-bottom-card">
              <Row>
                <Col>
                  <UserBidTable assetMap={assetMap} />
                </Col>
              </Row>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

AuctionMarketView.propTypes = {
  assetMap: PropTypes.object,
  lang: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  balances: PropTypes.arrayOf(
    PropTypes.shape({
      denom: PropTypes.string.isRequired,
      amount: PropTypes.string,
    })
  ),
  refreshBalance: PropTypes.number.isRequired,
};

const stateToProps = (state) => {
  return {
    lang: state.language,
    assetMap: state.asset.map,
    filteredMarketBidData: state.auction.filteredMarketBidData,
    balances: state.account.balances.list,
    refreshBalance: state.account.refreshBalance,
    address: state.account.address,
    iconList: state.config?.iconList,
  };
};

const actionsToProps = {

};

export default connect(stateToProps, actionsToProps)(AuctionMarketView);
// export default AuctionMarketView;