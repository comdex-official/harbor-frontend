import React from 'react'
import * as PropTypes from "prop-types";
import { Col, Row, SvgIcon } from "../../../components/common";
import './index.scss';
import { connect } from "react-redux";
import { Button, Table } from "antd";
import { iconNameFromDenom } from "../../../utils/string";
import { commaSeparator, decimalConversion } from "../../../utils/number";
import TooltipIcon from "../../../components/TooltipIcon";
import { amountConversionWithComma, denomConversion } from '../../../utils/coin';
import { DOLLAR_DECIMALS } from '../../../constants/common';

const Vote = ({ address }) => {
  const columns = [
    {
      title: (
        <>
          Asset
        </>
      ),
      dataIndex: "asset",
      key: "asset",
      width: 150,
    },
    {
      title: (
        <>
          My Borrowed{" "}
        </>
      ),
      dataIndex: "my_borrowed",
      key: "my_borrowed",
      width: 150,
    },
    {
      title: (
        <>
          Total Borrowed
        </>
      ),
      dataIndex: "total_borrowed",
      key: "total_borrowed",
      width: 200,
    },
    {
      title: (
        <>
          Total Votes
        </>
      ),
      dataIndex: "total_votes",
      key: "total_votes",
      width: 230,
      render: (end_time) => <div >{end_time}</div>,
    },
    {
      title: (
        <>
          Bribe
        </>
      ),
      dataIndex: "bribe",
      key: "bribe",
      width: 200,
      render: (price) => (
        <>
          <div className="endtime-badge">{amountConversionWithComma(price)} {denomConversion("uharbor")}</div>
        </>
      ),
    },
    {
      title: (
        <>
          My Vote
        </>
      ),
      dataIndex: "my_vote",
      key: "my_vote",
      align: "center",
      width: 100,

    },
    {
      title: (
        <>
          Action
        </>
      ),
      dataIndex: "action",
      key: "action",
      align: "centre",
      width: 130,
      render: (item) => (
        <>
          <Button
            type="primary"
            className="btn-filled"
            size="sm"
          // onClick={handleClick}
          >
            Vote
          </Button>
        </>
      ),
    },
  ];

  const tableData = [
    {

      key: 1,
      id: 1,
      asset: (
        <>
          <div className="assets-withicon">
            <div className="assets-icon">
              <SvgIcon
                name={iconNameFromDenom(
                  "uharbor"
                )}
              />
            </div>
            HARBOR
          </div>
        </>
      ),
      my_borrowed: (
        <>
          <div className="assets-withicon display-center">
            {/* <div className="assets-icon">
              <SvgIcon
                name={iconNameFromDenom(
                  "uatom"
                )}
              />
            </div> */}
            1  ATOM
          </div>
        </>
      ),
      total_borrowed:
        <div>
          {amountConversionWithComma(
            3425367.784332
          )} {denomConversion("ucmdx")}
        </div>,
      total_votes: 4737549883,
      bribe: 4737483,
      my_vote: 0,
      action: "item",
    }

  ]

  return (
    <>
      <div className="app-content-wrapper">
        <Row>
          <Col>
            <div className="composite-card py-3">
              <div className="card-content">
                <Table
                  className="custom-table liquidation-table"
                  dataSource={tableData}
                  columns={columns}
                  // loading={inProgress}
                  // onChange={(event) => handleChange(event)}
                  // pagination={{
                  //   total:
                  //     auctions &&
                  //     auctions.pagination &&
                  //     auctions.pagination.total,
                  //   pageSize,
                  // }}
                  scroll={{ x: "100%" }}
                />
              </div>
            </div>

          </Col>
        </Row>
      </div>

    </>
  )
}

Vote.propTypes = {
  lang: PropTypes.string.isRequired,
  address: PropTypes.string,
};
const stateToProps = (state) => {
  return {
    lang: state.language,
    address: state.account.address,
  };
};
const actionsToProps = {
};
export default connect(stateToProps, actionsToProps)(Vote);