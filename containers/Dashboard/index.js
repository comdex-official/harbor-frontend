import React from 'react'
import '../../styles/containers/Dashboard/dashboard.module.scss';
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Table } from 'antd';
import { NextImage } from '@/components/image/NextImage';
import { ATOM } from '@/components/image';
import TVLModal from './TVLModal';
import TVLCMSTModal from './TVLCMSTModal';

const Dashbard = () => {


  const emissionDistributionColumns = [
    {
      title: '',
      dataIndex: "assets_color",
      key: "assets_color",
      render: (text) => <div className='colorbox' style={{ backgroundColor: `${text}` }}></div>,
      width: 30
    },
    {
      title: 'Token',
      dataIndex: "assets",
      key: "assets",
      align: 'left',
      render: (text) => <>
        <div className="assets-withicon">
          <div className="assets-icons">
            <div className="assets-icon">
              {/* <SvgIcon
                name='atom-icon'
              /> */}
              <NextImage src={ATOM} alt="" height={25} width={25} />
            </div>
          </div>
          <div className='name'>{text}</div>
        </div>
      </>
    },
    {
      title: 'Amount',
      dataIndex: "vote",
      key: "vote",
    }
  ];

  const emissionDistributionData = [
    {
      key: 1,
      assets_color: '#00AFB9',
      assets: 'ATOM-C',
      vote: '23%'
    },
    {
      key: 2,
      assets_color: '#FDFCDC',
      assets: 'ATOM-C',
      vote: '23%'
    },
    {
      key: 3,
      assets_color: '#00AFB9',
      assets: 'ATOM-C',
      vote: '23%'
    },
    {
      key: 4,
      assets_color: '#F07167',
      assets: 'ATOM-C',
      vote: '23%'
    },
    {
      key: 5,
      assets_color: '#FED9B7',
      assets: 'ATOM-C',
      vote: '23%'
    }
  ];

  const emissionVotingColumns = [
    {
      title: 'Vaults/Pools',
      dataIndex: "assets",
      key: "assets",
      align: 'left',
      render: (text) => <>
        <div className="assets-withicon">
          <div className="assets-icon">
            <SvgIcon
              name='atom-icon'
            />
          </div>
          <div className='name'>{text}</div>
        </div>
      </>
    },
    {
      title: 'My Borrowed/Farmed',
      dataIndex: "my_borrowed",
      key: "my_borrowed",
    },
    {
      title: 'Total Votes',
      dataIndex: "total_votes",
      key: "total_votes",
      align: 'center',
    },
    {
      title: 'External Incentives',
      dataIndex: "external_incentives",
      key: "external_incentives",
      align: 'left',
      render: (text) => <>
        <div className="assets-withicon">
          <div className="assets-icon">
            <SvgIcon
              name='cmdx-icon'
            />
          </div>
          <div className='name'>{text}</div>
          <ExternalIncentivesModal />
        </div>
      </>
    },
    {
      title: 'My Vote',
      dataIndex: "my_vote",
      key: "my_vote",
      align: 'center',
    },
    {
      title: 'Vote',
      dataIndex: "vote",
      key: "vote",
      align: 'center',
      render: (text) => <div className='vote-slider'>
        <Slider
          min={1}
          max={20}
          onChange={onChange}
          tooltip={false}
        />
        <div className='percents'>{inputValue}%</div>
      </div>
    }
  ];

  const emissionVotingdata = [
    {
      key: 1,
      assets: 'ATOM-A',
      my_borrowed: '13.09 CMST',
      total_votes: '502.76 veHarbor',
      external_incentives: '4.40 CMDX',
      my_vote: '0.00 veHARBOR',
      vote: ''
    },
    {
      key: 2,
      assets: 'ATOM-A',
      my_borrowed: '13.09 CMST',
      total_votes: '502.76 veHarbor',
      external_incentives: '4.40 CMDX',
      my_vote: '0.00 veHARBOR',
      vote: ''
    },
    {
      key: 3,
      assets: 'ATOM-A',
      my_borrowed: '13.09 CMST',
      total_votes: '502.76 veHarbor',
      external_incentives: '4.40 CMDX',
      my_vote: '0.00 veHARBOR',
      vote: ''
    },
    {
      key: 4,
      assets: 'ATOM-A',
      my_borrowed: '13.09 CMST',
      total_votes: '502.76 veHarbor',
      external_incentives: '4.40 CMDX',
      my_vote: '0.00 veHARBOR',
      vote: ''
    },
    {
      key: 5,
      assets: 'ATOM-A',
      my_borrowed: '13.09 CMST',
      total_votes: '502.76 veHarbor',
      external_incentives: '4.40 CMDX',
      my_vote: '0.00 veHARBOR',
      vote: ''
    },
    {
      key: 6,
      assets: 'ATOM-A',
      my_borrowed: '13.09 CMST',
      total_votes: '502.76 veHarbor',
      external_incentives: '4.40 CMDX',
      my_vote: '0.00 veHARBOR',
      vote: ''
    }
  ];

  const PieChart1 = {
    chart: {
      type: "pie",
      backgroundColor: null,
      height: 200,
      width: 150,
      margin: 0,
      style: {
        fontFamily: 'Montserrat'
      }
    },
    credits: {
      enabled: false,
    },
    title: {
      text: null,
    },
    plotOptions: {
      pie: {
        showInLegend: false,
        size: "110%",
        borderWidth: 0,
        innerSize: "78%",
        className: "pie-chart totalvalue-chart",
        dataLabels: {
          enabled: false,
          distance: -14,
          style: {
            fontsize: 50,
          },
        },
      },
    },
    tooltip: {
      formatter: function () {
        return (
          '<div style="text-align:center; font-weight:800; ">' +
          Number(this.y) + " %" +
          "<br />" +
          '<small style="font-size: 10px; font-weight:400;">' +
          this.point.name +
          "</small>" +
          "</div>"
        );
      },
      useHTML: true,
      backgroundColor: "#232231",
      borderColor: "#fff",
      borderRadius: 10,
      zIndex: 99,
      style: {
        color: "#fff",
      },
    },
    series: [
      {
        states: {
          hover: {
            enabled: true,
          },
        },
        name: "",
        data:
          [
            {
              name: "Atom",
              y: 10,
              // color: "",
            },
            {
              name: "Osmo",
              y: 20,
              // color: "",
            },
            {
              name: "CMDX",
              y: 40,
              // color: "",
            },
          ]


      },
    ],
  };

  return (
    <div>
      <div className="dashboard_main_container">
        <div className="dashboard_container">
          <div className="top_container">
            <div className="image_container">
              <img src="/images/dashboard_banner.svg" alt="@dashboard_banner" />
            </div>
          </div>
          <div className="bottom_container">
            <div className="left_container card_container">
              <div className="total_value_container">
                <div className="total_value_box">
                  <div className="heading">
                    Total Value Locked
                  </div>
                  <div className="value">
                    $1,0,81,131
                  </div>
                </div>
                <div className="view_all_btn">
                  {/* View All */}
                  <TVLModal />
                </div>
              </div>
              <div className="wrapper">
                <div className="char">

                  <HighchartsReact highcharts={Highcharts} options={PieChart1} />
                </div>
                <div className="table">
                  <Table
                    className="custom-table dashboard_table"
                    dataSource={emissionDistributionData}
                    columns={emissionDistributionColumns}
                    pagination={false}
                    scroll={{ x: "100%" }}
                  />
                </div>
              </div>
            </div>
            <div className="right_container card_container">
              <div className="total_value_container">
                <div className="total_value_box">
                  <div className="heading">
                    Total CMST Minted
                  </div>
                  <div className="value">
                    1,0,81,131 CMST
                  </div>
                </div>
                <div className="view_all_btn">
                  {/* View All */}
                  <TVLCMSTModal />
                </div>
              </div>
              <div className="wrapper">
                <div className="char">
                  <HighchartsReact highcharts={Highcharts} options={PieChart1} />

                </div>
                <div className="table">
                  <Table
                    className="custom-table dashboard_table"
                    dataSource={emissionDistributionData}
                    columns={emissionDistributionColumns}
                    pagination={false}
                    scroll={{ x: "100%" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashbard