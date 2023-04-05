import React, { useState } from 'react'
import { Col, Row, SvgIcon } from "../../../../components/common";
import { Modal, Table } from "antd";
import { denomToSymbol } from "../../../../utils/string";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { poolColor, vaultColor } from '../color';
import './index.scss'

const EmissionDistributionAllModal = ({}) => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [concatedExtendedPair, setConcatedExtendedPair] = useState([]);
  const [concatedPairName, setConcatedPairName] = useState([]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const PieChart1 = {
    chart: {
      type: "pie",
      backgroundColor: null,
      height: 230,
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
    series: [
      {
        states: {
          hover: {
            enabled: true,
          },
        },
        name: "",
        data: concatedExtendedPair && concatedExtendedPair?.map((item, index) => {
          return ({
            name: (item?.extended_pair_id / 1000000) >= 1 ? denomToSymbol(concatedPairName[item?.extended_pair_id]?.baseCoin?.denom) + "-" + denomToSymbol(concatedPairName[item?.extended_pair_id]?.quoteCoin?.denom)
              :
              concatedPairName[item?.extended_pair_id],
            y: Number(item?.total_vote),
            color: (item?.extended_pair_id / 1000000) >= 1 ? poolColor[Math.floor(item?.extended_pair_id / 1000000) - 1] : vaultColor[item?.extended_pair_id - 1],
          })
        })
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
      title: 'Vaults/Pools',
      dataIndex: "assets",
      key: "assets",
      align: 'left',
      render: (text) => <>
        <div className="assets-withicon">
          <div className="assets-icons">
            <div className="assets-icon">
              <SvgIcon
                name='atom-icon'
              />
            </div>
            <div className="assets-icon">
              <SvgIcon
                name='cmdx-icon'
              />
            </div>
          </div>
          <div className='name'>{text}</div>
        </div>
      </>
    },
    {
      title: 'Vote',
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
    },
    {
      key: 6,
      assets_color: '#FDFCDC',
      assets: 'ATOM-C',
      vote: '23%'
    },
    {
      key: 7,
      assets_color: '#00AFB9',
      assets: 'ATOM-C',
      vote: '23%'
    },
    {
      key: 8,
      assets_color: '#F07167',
      assets: 'ATOM-C',
      vote: '23%'
    },
    {
      key: 9,
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
        className="emission-modal"
        footer={null}
        header={null}
        title='Vaults & Pools'
        open={isModalOpen}
        width={850}
        closable={true}
        onOk={handleOk}
        onCancel={handleCancel}
        closeIcon={<SvgIcon name='close' viewbox='0 0 19 19' />}
      >
        <div className="palcebid-modal-inner emission-modal-container">
          <Row>
            <Col>
              <div className="emission-card">
                <div className="graph-container">
                  <Row>
                    <Col sm='6'>
                      <div className="graph-container">
                        <HighchartsReact highcharts={Highcharts} options={PieChart1} />
                      </div>
                    </Col>
                    <Col sm='6'>
                      <div className="asset-container">
                        <div className="composite-card ">
                          <div className="card-content">
                            <Table
                              className="custom-table emission-distribution-table"
                              dataSource={emissionDistributionData}
                              columns={emissionDistributionColumns}
                              pagination={false}
                              scroll={{ x: "100%" }}
                            />
                          </div>
                        </div>
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

export default EmissionDistributionAllModal;