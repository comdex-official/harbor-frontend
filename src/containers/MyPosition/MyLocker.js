import * as PropTypes from "prop-types";
import { Col, Row, SvgIcon } from "../../components/common";
import { connect } from "react-redux";
import variables from "../../utils/variables";
import { Button, Table, Switch, message } from "antd";
import "./index.scss";
import { Link } from "react-router-dom";
import TooltipIcon from "../../components/TooltipIcon";
import { queryLockerLookupTableByApp } from "../../services/locker/query";
import { useEffect } from "react";
import { PRODUCT_ID } from "../../constants/common";

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
      title: <>
        Transaction Type <TooltipIcon text="Type of transaction ( Withdraw or Deposit)" />
      </>,
      dataIndex: "transaction",
      key: "balance",
      width: 300,
    },
    {
      title: "Date of Transaction",
      dataIndex: "date",
      key: "date",
      width: 300,
    },
    {
      title: <>
        Balance <TooltipIcon text="Balance after transaction" />
      </>,
      dataIndex: "balance",
      key: "balance",
      width: 300,
    },
  ];

  const tableData = [
    {
      key: 1,
      amount: (
        <>
          <div className="assets-withicon">
            20 CMST
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
            123 CMST
          </div>
        </>
      ),
      transaction: "Withdraw",
      date: "00:00:00",
      balance: "20 CMST",
    },
  ];
  useEffect(() => {
    fetchLookUpTableByProductId(PRODUCT_ID);
  }, [])

  // *******Get Vault Query *********

  // *----------Get ...... product id----------* From asset module 
  const fetchLookUpTableByProductId = (productId) => {
    // setLoading(true);
    queryLockerLookupTableByApp(productId, (error, data) => {
      // setLoading(false);
      if (error) {
        message.error(error);
        return;
      }
      console.log("Lookup table data", data);
    });
  };




  return (
    <div className="app-content-wrappers earn-table-container">
      <Row>
        <Col>
          <div className="composite-card">
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
