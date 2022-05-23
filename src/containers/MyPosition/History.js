import * as PropTypes from "prop-types";
import { Col, Row, SvgIcon } from "../../components/common";
import Copy from "../../components/Copy";
import { connect } from "react-redux";
import variables from "../../utils/variables";
import { Table, message } from "antd";
import { setTransactionHistory } from "../../actions/account";
import React, { useEffect, useState } from "react";
import { comdex } from "../../config/network";
import { decodeTxRaw } from "@cosmjs/proto-signing";
import { fetchTxHistory, messageTypeToText } from "../../services/transaction";
import { generateHash } from "../../utils/string";
import moment from "moment";
import "./index.scss";

const History = (props) => {
  const [inProgress, setInProgress] = useState(false);
  const [pageNumber, setpageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    getTransactions(props.address, pageNumber, pageSize);
  }, []);

  const getTransactions = (address, pageNumber, pageSize) => {
    setInProgress(true);
    fetchTxHistory(address, pageNumber, pageSize, (error, result) => {
      setInProgress(false);
      if (error) {
        message.error(error);
        return;
      }

      props.setTransactionHistory(result.txs, result.totalCount);
    });
  };

  const tableData1 =
    props.history &&
    props.history.list &&
    props.history.list.length > 0 &&
    props.history.list.map((item, index) => {
      const decodedTransaction = decodeTxRaw(item.tx);
      const hash = generateHash(item.tx);

      return {
        key: index,
        tnx_hash: (
          <a
            href={`${comdex.explorerUrlToTx.replace(
              "{txHash}",
              hash?.toUpperCase()
            )}`}
            rel="noreferrer"
            target="_blank"
          >
            {" "}
            {hash}
          </a>
        ),
        type: messageTypeToText(decodedTransaction.body.messages[0].typeUrl),
        block_height: item.height,
        date: moment(),
      };
    });

  const handleChange = (value) => {
    setpageNumber(value.current);
    setPageSize(value.pageSize);
    getTransactions(props.address, value.current, value.pageSize);
  };

  const columns = [
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      // width: 180
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      // width: 150,
      render: (date) => (
        <div className="dates-col">
          <div className="dates">{date}</div> <small>11:23 EST</small>
        </div>
      ),
    },
    {
      title: "Block Height",
      dataIndex: "block_height",
      key: "block_height",
      // width: 150,
    },
    {
      title: "Tnx Hash",
      dataIndex: "tnx_hash",
      key: "tnx_hash",
      width: 150,
      render: (tnx_hash) => (
        <div className="tnxshash-col">
          {tnx_hash} <Copy />
        </div>
      ),
    },
  ];

  const tableData = [
    {
      key: 1,
      type: "Deposit",
      date: "30 Jul 2022",
      block_height: "1234",
      tnx_hash: "0x6696672B38cF38e5521c8C6e3A902EF4e2F78736",
    },
    {
      key: 2,
      type: "Repay",
      date: "30 Jul 2022",
      block_height: "1234",
      tnx_hash: "0x6696672B38cF38e5521c8C6e3A902EF4e2F78736",
    },
  ];

  return (
    <div className="app-content-wrapper">
      <Row>
        <Col>
          <div className="composite-card">
            <div className="card-content">
              <Table
                className="custom-table"
                dataSource={tableData1}
                columns={columns}
                scroll={{ x: "100%" }}
              loading={inProgress}
              pagination={{
                total: props.history && props.history.count,
                showSizeChanger: true,
                defaultPageSize: 5,
                pageSizeOptions: ["5", "10", "20", "50"],
              }}
              total={props.history && props.history.count}
              onChange={(event) => handleChange(event)}
              />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

History.propTypes = {
  lang: PropTypes.string.isRequired,
  setTransactionHistory: PropTypes.func.isRequired,
  address: PropTypes.string,
  count: PropTypes.number,
  history: PropTypes.shape({
    count: PropTypes.number,
    list: PropTypes.arrayOf(
      PropTypes.shape({
        index: PropTypes.number,
        height: PropTypes.number,
        tx: PropTypes.any,
      })
    ),
  }),
};

const stateToProps = (state) => {
  return {
    lang: state.language,
    history: state.account.history,
    address: state.account.address,
  };
};

const actionsToProps = {
  setTransactionHistory,
};

export default connect(stateToProps, actionsToProps)(History);
