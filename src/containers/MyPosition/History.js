import * as PropTypes from "prop-types";
import { Col, Row } from "../../components/common";
import Copy from "../../components/Copy";
import { connect } from "react-redux";
import { Table, message } from "antd";
import { setTransactionHistory } from "../../actions/account";
import React, { useEffect, useState } from "react";
import { comdex } from "../../config/network";
import { decodeTxRaw } from "@cosmjs/proto-signing";
import { fetchTxHistory, messageTypeToText } from "../../services/transaction";
import { generateHash, truncateString } from "../../utils/string";
import Date from "./Date";

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

  console.log("history", props.history);
  const tableData =
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
            {truncateString(hash, 6, 6)}
          </a>
        ),
        amount: 1,
        type: messageTypeToText(decodedTransaction.body.messages[0].typeUrl),
        block_height: item.height,
        date: item.height,
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
      width: 100
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (value) => (
        <div>
          <span>{value}</span>
        </div>
      )
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: 250,
      render: (height) => <Date height={height} />,
    },
    {
      title: "Block Height",
      dataIndex: "block_height",
      key: "block_height",
      width: 150,
    },
    {
      title: "Tnx Hash",
      dataIndex: "tnx_hash",
      key: "tnx_hash",
      width: 150,
      render: (tnx_hash) => (
        <div className="tnxshash-col">
          <span > {tnx_hash} </span><Copy />
        </div>
      ),
    },
  ];

  return (
    <div className="app-content-wrapper">
      <Row>
        <Col>
          <div className="composite-card">
            <div className="card-content">
              <Table
                className=" position-history-table"
                dataSource={tableData}
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
