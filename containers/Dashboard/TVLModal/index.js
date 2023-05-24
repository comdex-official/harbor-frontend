import React, { useEffect, useState } from 'react'
// import { Col, Row, SvgIcon } from "../../../../components/common";
import { Modal, Table } from "antd";
// import { denomToSymbol, iconNameFromDenom } from "../../../../utils/string";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
// import { combineColor, poolColor, vaultColor } from '../color';
import '../../../styles/containers/Dashboard/TVLModal/tvl.module.scss';
// import { amountConversion } from '../../../../utils/coin';
// import { votingCurrentProposal } from '../../../../services/voteContractsRead';
// import { DOLLAR_DECIMALS } from '../../../../constants/common';
import { NextImage } from '@/components/image/NextImage';
import { Col, Row } from '@/components/common';
import { DOLLAR_DECIMALS } from '@/constants/common';
import { ATOM } from '@/components/image';

const TVLModal = ({ userCurrentProposalData, currentProposalAllData }) => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [concatedExtendedPair, setConcatedExtendedPair] = useState([]);
  const [concatedPairName, setConcatedPairName] = useState([]);
  const [topProposalData, setTopProposalData] = useState()

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  function getColor(index) {
    const length = combineColor.length;
    const wrappedIndex = index % length;
    return combineColor[wrappedIndex];
  }

  const calculateTotalVotes = (value) => {
    let userTotalVotes = 0;
    let calculatePercentage = 0;

    calculatePercentage = (Number(value) / Number(amountConversion(currentProposalAllData?.total_voted_weight || 0, DOLLAR_DECIMALS))) * 100;
    calculatePercentage = Number(calculatePercentage || 0).toFixed(DOLLAR_DECIMALS)
    if (calculatePercentage === "Infinity") {
      return 0
    } else {
      return calculatePercentage;
    }
  }

  // useEffect(() => {
  //   if (userCurrentProposalData) {
  //     let filteredData = [...userCurrentProposalData];
  //     filteredData.sort((a, b) => calculateTotalVotes(amountConversion(b?.total_vote || 0, 6) || 0) - calculateTotalVotes(amountConversion(a?.total_vote || 0, 6) || 0));
  //     setTopProposalData(filteredData)
  //   }

  // }, [userCurrentProposalData, currentProposalAllData])



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


  return (
    <>
      <div className="right" onClick={showModal}>
        View All
      </div>
      <Modal
        centered={true}
        className="dashboard_tvl_modal"
        footer={null}
        header={null}
        title={
          <>
            <div className="total_value_box">
              <div className="heading">
                Total Value Locked
              </div>
              <div className="value">
                1,0,81,131 CMST
              </div>
            </div>
          </>
        }
        open={isModalOpen}
        width={650}
        closable={true}
        onOk={handleOk}
        onCancel={handleCancel}
      // closeIcon={<SvgIcon name='close' viewbox='0 0 19 19' />}
      >
        <div className="dashboard-tvl-modal-container">
          <Row>
            <Col>
              <div className="tvl-card">
                <div className="graph-container">
                  <Row>
                    <Col sm='6'>
                      <div className="chart-graph-container">
                        <HighchartsReact highcharts={Highcharts} options={PieChart1} />
                      </div>
                    </Col>
                    <Col sm='6'>
                      <div className="card-content">
                        <Table
                          className="custom-table dashboard_tvl_table"
                          dataSource={emissionDistributionData}
                          columns={emissionDistributionColumns}
                          pagination={false}
                          scroll={{ x: "100%" }}
                        />
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>

            </Col>
          </Row>
        </div>
      </Modal>
    </>
  )
}

export default TVLModal;