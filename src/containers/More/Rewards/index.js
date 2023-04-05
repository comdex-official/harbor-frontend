import React, { useState } from 'react'
import { Col, Row, SvgIcon } from "../../../components/common";
import './index.scss';
import { Button, Input, Slider, Switch, Table } from "antd";
import { Link } from 'react-router-dom';
import NoDataIcon from '../../../components/common/NoDataIcon';
import ExternalIncentivesModal from './ExternalIncentivesModal';

import cardImage from '../../../assets/images/reward-bg.jpg';

const Rewards = () => {
  const externalIncentivesColumns = [
    {
      title: 'Week',
      dataIndex: "week",
      key: "week",
      align: 'left'
    },
    {
      title: 'Assets',
      dataIndex: "assets",
      key: "assets",
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
      title: 'Action',
      dataIndex: "action",
      key: "action",
      align: 'center',
      className: 'justify-content-center',
      render: () => <><Button type='primary' className='btn-filled px-4'>Claim</Button> 
        {/* <div className='claimed-tag'><SvgIcon name='check-circle' viewbox='0 0 15 15' /> Claimed</div>  */}
      </>,
      width: 140
    }
  ];

  const externalIncentivesdata = [
    {
      key: 1,
      week: '06',
      assets: '4.40 CMDX',
      action: ''
    },
    {
      key: 2,
      week: '05',
      assets: '4.40 CMDX',
      action: ''
    },
    {
      key: 3,
      week: '04',
      assets: '4.40 CMDX',
      action: ''
    },
    {
      key: 4,
      week: '03',
      assets: '4.40 CMDX',
      action: ''
    },
    {
      key: 5,
      week: '02',
      assets: '4.40 CMDX',
      action: ''
    },
    {
      key: 6,
      week: '01',
      assets: '4.40 CMDX',
      action: ''
    },
  ];


  const emissionRewardsColumns = [
    {
      title: 'Week',
      dataIndex: "week",
      key: "week",
      align: 'left'
    },
    {
      title: 'Assets',
      dataIndex: "assets",
      key: "assets",
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
      title: 'Action',
      dataIndex: "action",
      key: "action",
      align: 'center',
      className: 'justify-content-center',
      render: () => <><Button type='primary' className='btn-filled px-4'>Claim</Button> 
        {/* <div className='claimed-tag'><SvgIcon name='check-circle' viewbox='0 0 15 15' /> Claimed</div>  */}
      </>,
      width: 140
    }
  ];

  const emissionRewardsdata = [
    {
      key: 1,
      week: '06',
      assets: '4.40 CMDX',
      action: ''
    },
    {
      key: 2,
      week: '05',
      assets: '4.40 CMDX',
      action: ''
    },
    {
      key: 3,
      week: '04',
      assets: '4.40 CMDX',
      action: ''
    },
    {
      key: 4,
      week: '03',
      assets: '4.40 CMDX',
      action: ''
    },
    {
      key: 5,
      week: '02',
      assets: '4.40 CMDX',
      action: ''
    },
    {
      key: 6,
      week: '01',
      assets: '4.40 CMDX',
      action: ''
    },
  ];

  return (
    <>
      <div className="app-content-wrapper">
        <Row>
          <Col>
            <div className="totol-voting-main-container mb-3">
              <div className='d-flex total-voting-power-tooltip-box'></div>
              <div>
                <Link to="/more"><Button className="back-btn" type="primary">Back</Button></Link>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className='reward-card' style={{ backgroundImage: `url(${cardImage})` }}>
              <h2>Rebase Rewards </h2>
              <p>$veHarbor is distributed to $veHARBOR holders in order to reduce the voting power dilution. Users can see their $veHarbor here.</p>
              <Button type='primary' className='btn-filled'>Take me there!</Button>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md='6'>
            <Row className='mb-2'>
              <Col>
                <h2>External Incentives </h2>
              </Col>
              <Col className="text-right">
                <Button type='primary' className='btn-filled'>Claim All</Button>
              </Col>
            </Row>
            <Table
                className="custom-table reward-table"
                dataSource={externalIncentivesdata}
                columns={externalIncentivesColumns}
                pagination={false}
                scroll={{ x: "100%" }}
                locale={{ emptyText: <NoDataIcon /> }}
              />
          </Col>
          <Col md='6'>
            <Row className='mb-2'>
              <Col>
                <h2>Emission Rewards</h2>
              </Col>
            </Row>
            <Table
                className="custom-table reward-table"
                dataSource={emissionRewardsdata}
                columns={emissionRewardsColumns}
                pagination={false}
                scroll={{ x: "100%" }}
                locale={{ emptyText: <NoDataIcon /> }}
              />
          </Col>
        </Row>
      </div>
    </>
  )
}

export default Rewards;