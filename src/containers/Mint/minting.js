import * as PropTypes from "prop-types";
import { Col, Row, SvgIcon } from "../../components/common";
import { connect } from "react-redux";
import { Button, Table } from "antd";
import "./index.scss";
import PlaceBidModal from "../Auctions/PlaceBidModal";
import FilterModal from "../Auctions/FilterModal/FilterModal";
import data from "./data";
import "./index.scss";

const Minting = (lang) => {
  const columns = [
    {
      title: "Vault",
      dataIndex: "Vault",
      key: "Vault",
      width: 180,
    },
    {
      title: "Min. Collateral Ratio",
      dataIndex: "collateral_ratio",
      key: "collateral_ratio",
      width: 180,
    },
    {
      title: "Intrest Rate",
      dataIndex: "intrest_rate",
      key: "intrest_rate",
      width: 180,
    },
    {
      title: "Min. Borrow Amount",
      dataIndex: "borrow_amount",
      key: "borrow_amount",
      width: 200,
      render: (borrow_amount) => (
        <div className="endtime-badge">{borrow_amount}</div>
      ),
    },
    {
      title: "Closing Fee",
      dataIndex: "closing_fee",
      key: "closing_fee",
      width: 150,
      render: (asset_apy) => <>{asset_apy} </>,
    },
    {
      title: "",
      dataIndex: "action",
      key: "action",
      align: "right",
      width: 140,
      render: () => (
        <>
          <PlaceBidModal />
        </>
      ),
    },
  ];

  const tableData = data.map((item, index) => {
    return {
      key: <>{item.key}</>,
      Vault: (
        <>
          <div className="assets-withicon">
            {item.valut}
          </div>
        </>
      ),
      collateral_ratio: (
        <>
          <div className="assets-withicon">
            {item.collateral}%
          </div>
        </>
      ),
      intrest_rate: (
        <>
          <div className="assets-withicon">{item.intrest}%</div>
        </>
      ),
      borrow_amount: (
        <>
          <div className="assets-withicon">${item.borrow}</div>
        </>
      ),
      closing_fee: (
        <>
          <div className="assets-withicon">{item.closing}%</div>
        </>
      ),
    };
  });
  return (
    <div className="app-content-wrapper">
      <Row>
        <Col>
          <div className="commodo-card py-3">
            <div className="card-content">
              <Table
                className="custom-table liquidation-table mint-table"
                dataSource={tableData}
                columns={columns}
                // pagination={{ defaultPageSize: 10 }}
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

Minting.propTypes = {
  lang: PropTypes.string.isRequired,
};

const stateToProps = (state) => {
  return {
    lang: state.language,
  };
};

const actionsToProps = {};

export default connect(stateToProps, actionsToProps)(Minting);
