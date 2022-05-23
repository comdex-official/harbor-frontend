import * as PropTypes from "prop-types";
import { Col, Row, SvgIcon } from "../../components/common";
import { connect } from "react-redux";
import variables from "../../utils/variables";
import { Button, Table, Progress } from "antd";
import "./index.scss";
import { Link } from "react-router-dom";

const MyVault = (lang) => {
  const columns = [
    {
      title: "Vault Type",
      dataIndex: "vault",
      key: "vault",
      width: 180,
    },
    {
      title: "Debt",
      dataIndex: "debt",
      key: "debt",
      width: 150,
    },
    {
      title: "Interest Rate",
      dataIndex: "apy",
      key: "apy",
      width: 150,
      render: (apy) => <>{apy}%</>,
    },
    {
      title: "Health Factor",
      dataIndex: "health",
      key: "health",
      width: 200,
      align: "center",
      render: () => (
        <Progress
          className="health-progress"
          style={{ width: 130 }}
          percent={30}
          size="small"
        />
      ),
    },
    {
      title: "",
      dataIndex: "action",
      key: "action",
      align: "right",
      width: 200,
      render: () => (
        <>
          <Link to="/vault">
            <Button type="primary" className="btn-filled" size="small">
              Manage
            </Button>
          </Link>
        </>
      ),
    },
  ];

  const tableData = [
    {
      key: 1,
      vault: (
        <>
          <div className="assets-withicon">
            {/* <div className="assets-icon">
              <SvgIcon name="ust-icon" viewBox="0 0 30 30" />
            </div> */}
            ATOM-A
          </div>
        </>
      ),
      debt: "142 CMST",
      apy: "20",
    },
    {
      key: 1,
      vault: (
        <>
          <div className="assets-withicon">
            {/* <div className="assets-icon">
              <SvgIcon name="ust-icon" viewBox="0 0 30 30" />
            </div> */}
            ATOM-B
          </div>
        </>
      ),
      debt: "90 CMST",
      apy: "20",
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

MyVault.propTypes = {
  lang: PropTypes.string.isRequired,
};

const stateToProps = (state) => {
  return {
    lang: state.language,
  };
};

const actionsToProps = {};

export default connect(stateToProps, actionsToProps)(MyVault);
