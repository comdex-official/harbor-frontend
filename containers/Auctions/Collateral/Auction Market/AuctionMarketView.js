import React from 'react'
import { NextImage } from '../../../../components/image/NextImage';
import { ATOM } from '../../../../components/image';
import { Button, Input } from 'antd';
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

const AuctionMarketView = () => {

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

  return (
    <>
      <div className="auction_view_main_container">
        <div className="auction_view_container">
          <div className="top_container">
            <div className="title">
              <NextImage src={ATOM} />
              <span style={{ marginLeft: "-15px", marginRight: "15px" }}>
                <NextImage src={ATOM} />
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
                        <span className='add_btn'>-</span>
                        <Input className='input_with_no_border' value={"10%"} />
                        <span className='subtract_btn'>+</span>
                      </div>
                    </div>
                    <div className="available_bid_container">
                      <div className="available_title">Bid Amount</div>
                      <div className="available_box">
                        <Button type='primary' className='maxhalf mr-2'>Max</Button>
                        7 CMST
                      </div>
                    </div>
                    <div className="bid_input_container">
                      <div className="input_box">
                        <Input className='input_with_no_border' value={100} />
                      </div>
                      <div className="denom_box">CMST</div>
                    </div>
                    <div className="note_container">
                      NOTE: withdrawal of a successful bid will include a 0.5% fee. All fees are paid to CMST stakers.
                    </div>
                    <div className="bid_btn_container">
                      <Button type='primary' className='btn-filled'>Place Bid</Button>
                    </div>
                  </div>
                </div>

                <div className="pool_value_container card_container">
                  <div className="total_pool_value_container">
                    <div className="pool_value_title">Total Pool Value</div>
                    <div className="pool_value_value">513.9 CMST</div>
                  </div>
                  <div className="total_collateral_value_container">
                    <div className="pool_value_title">Total Locked Collateral Value</div>
                    <div className="pool_value_value">23.2k</div>
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
                  <UserBidTable />
                </Col>
              </Row>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

export default AuctionMarketView;