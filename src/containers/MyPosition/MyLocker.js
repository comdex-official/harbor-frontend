import * as PropTypes from "prop-types";
import { Col, Row } from "../../components/common";
import { connect } from "react-redux";
import { Table, message } from "antd";
import "./index.scss";
import TooltipIcon from "../../components/TooltipIcon";
import { queryUserLockerHistory } from "../../services/locker/query";
import { useEffect, useState } from "react";
import {
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
  PRODUCT_ID,
} from "../../constants/common";
import { amountConversion } from "../../utils/coin";
import moment from "moment";

const MyEarn = ({ address }) => {
  const [pageNumber, setPageNumber] = useState(DEFAULT_PAGE_NUMBER);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [lockers, setLockers] = useState();
  const [inProgress, setInProgress] = useState(false);

  useEffect(() => {
    if (address) {
      fetchLockers((pageNumber - 1) * pageSize, pageSize, true, false);
    }
  }, [address]);

  const fetchLockers = (offset, limit, isTotal, isReverse) => {
    setInProgress(true);
    queryUserLockerHistory(
      PRODUCT_ID,
      address,
      offset,
      limit,
      isTotal,
      isReverse,
      (error, result) => {
        setInProgress(false);
        if (error) {
          message.error(error);
          return;
        }
        let reverseData = [...result?.userTxData].reverse()
        setLockers(reverseData || []);
      }
    );
  };

  const handleChange = (value) => {
    setPageNumber(value.current - 1);
    setPageSize(value.pageSize);
    fetchLockers(
      (value.current - 1) * value.pageSize,
      value.pageSize,
      true,
      false
    );
  };

  const columns = [
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      width: 300,
    },
    {
      title: (
        <>
          Transaction Type{" "}
          <TooltipIcon text="Type of transaction ( Withdraw or Deposit)" />
        </>
      ),
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
      title: (
        <>
          Balance <TooltipIcon text="Balance after transaction" />
        </>
      ),
      dataIndex: "balance",
      key: "balance",
      width: 300,
    },
  ];

  const tableData =
    lockers &&
    lockers?.length > 0 &&
    lockers?.map((item) => {
      return {
        key: 1,
        amount: (
          <>
            <div className="assets-withicon">
              {amountConversion(item?.amount || 0)} CMST
            </div>
          </>
        ),
        transaction: item?.txType,
        date: moment(item?.txTime).format("MMM DD, YYYY HH:mm"),
        balance: <>{amountConversion(item?.balance || 0)} CMST</>,
        action: item,
      };
    });

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
                loading={inProgress}
                onChange={(event) => handleChange(event)}
                pagination={{
                  total:
                    lockers && lockers.pagination && lockers.pagination.total,
                  showSizeChanger: true,
                  defaultPageSize: pageSize,
                  pageSizeOptions: ["5", "10", "20", "50"],
                }}
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
  address: PropTypes.string,
};

const stateToProps = (state) => {
  return {
    lang: state.language,
    address: state.account.address,
  };
};

const actionsToProps = {};

export default connect(stateToProps, actionsToProps)(MyEarn);
