import * as PropTypes from "prop-types";
import { Col, Row } from "../../components/common";
import { connect } from "react-redux";
import { Table, message } from "antd";
import "./index.scss";
import TooltipIcon from "../../components/TooltipIcon";
import {queryLockerLookupTableByApp, queryUserLockerHistory} from "../../services/locker/query";
import {useEffect, useState} from "react";
import { PRODUCT_ID } from "../../constants/common";
import {amountConversion} from "../../utils/coin";
import moment from "moment";

const lockerData = [{
  amount: "100000000",
  balance: "100000000",
  txTime: "2022-06-02T07:36:42.515720968Z",
  txType: "Create",

}];

const MyEarn = ({address}) => {

  const [lockers, setLockers] = useState(lockerData);

  useEffect(()=>{
    if(address) {
      fetchLockers();
    }
  },[address]);

  const fetchLockers = () => {
    queryUserLockerHistory(PRODUCT_ID, address, (error, result)=>{
      if(error){
        message.error(error);
        return;
      }

      console.log('locker data', result)
    })
  }

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
          balance: (
              <>
                  {amountConversion(item?.balance || 0)} CMST
              </>
          ) ,
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
