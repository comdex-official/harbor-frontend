import * as PropTypes from "prop-types";
import { Col, Row, SvgIcon } from "../../components/common";
import { connect } from "react-redux";
import variables from "../../utils/variables";
import { Button, Table, Switch } from "antd";
import "./index.scss";
import { Link } from "react-router-dom";

function onChange(checked) {
  console.log(`switch to ${checked}`);
}

const MyEarn = (lang) => {
  const columns = [
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      width: 300,
    },
    {
      title: "Type of Transaction",
      dataIndex: "transaction",
      key: "balance",
      // width: 150,
      width: 300,
    },
    {
      title: "Date of Transaction",
      dataIndex: "date",
      key: "date",
      width: 300,
      // width: 150,
      // render: (apy) => <>{apy}%</>,
    },
    {
      title: "Balance",
      dataIndex: "balance",
      key: "balance",
      width: 300,
      // width: 200,
      // render: (item) => <Switch onChange={() => onChange(item)} />,
    },
  ];

  const tableData = [
    {
      key: 1,
      amount: (
        <>
          <div className="assets-withicon">
            {/* <div className="assets-icon">
              <SvgIcon name="ust-icon" viewBox="0 0 30 30" />
            </div> */}
            20
          </div>
        </>
      ),
      transaction: "Deposit",
      date: "00:00:00",
      balance: "30 CMST",
    },
    {
      key: 2,
      amount: (
        <>
          <div className="assets-withicon">
            {/* <div className="assets-icon">
              <SvgIcon name="ust-icon" viewBox="0 0 30 30" />
            </div> */}
            123
          </div>
        </>
      ),
      transaction: "Withdraw",
      date: "00:00:00",
      balance: "20 CMST",
    },
  ];

  return (
    <div className="app-content-wrappers earn-table-container">
      <Row>
        <Col>
          <div className="commodo-card">
            <div className="card-content">
              <Table
                className="custom-table"
                dataSource={tableData}
                columns={columns}
                pagination={false}
                scroll={{ x: "100%" }}
              />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

MyEarn.propTypes = {
  lang: PropTypes.string.isRequired,
};

const stateToProps = (state) => {
  return {
    lang: state.language,
  };
};

const actionsToProps = {};

export default connect(stateToProps, actionsToProps)(MyEarn);
