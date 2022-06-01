import * as PropTypes from "prop-types";
import { Col, Row } from "../../components/common";
import { connect } from "react-redux";
import { Button, Table, Progress, message } from "antd";
import "./index.scss";
import { Link } from "react-router-dom";
import TooltipIcon from "../../components/TooltipIcon";
import { useEffect, useState } from "react";
import { queryUserVaults } from "../../services/vault/query";
import { amountConversion } from "../../utils/coin";
import { useNavigate } from "react-router";
import { DOLLAR_DECIMALS } from "../../constants/common";

const MyVault = ({ address }) => {
  const [vaults, setVaults] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    if (address) {
      fetchVaults();
    }
  }, [address]);

  const fetchVaults = () => {
    queryUserVaults(address, (error, result) => {
      if (error) {
        message.error(error);
        return;
      }

      setVaults(result?.vaultsInfo);
    });
  };

  const columns = [
    {
      title: "Vault Type",
      dataIndex: "vault",
      key: "vault",
      width: 180,
    },
    {
      title: (
        <>
          Debt{" "}
          <TooltipIcon text="Composite Debt owed for this vault which is a sum of Composite borrowed and interest accrued" />
        </>
      ),
      dataIndex: "debt",
      key: "debt",
      width: 150,
    },
    {
      title: (
        <>
          Interest Rate{" "}
          <TooltipIcon text="Current annual interest rate of Vault" />
        </>
      ),
      dataIndex: "apy",
      key: "apy",
      width: 150,
      render: (apy) => <>{apy}%</>,
    },
    {
      title: (
        <>
          Collateralization ratio{" "}
          <TooltipIcon text="The collateral ratio of the vault which is equal to collateral deposited by composite borrowed" />
        </>
      ),
      dataIndex: "health",
      key: "health",
      width: 200,
      align: "center",
      render: (ratio) => (
        <>
          <span>{Number(ratio || 0).toFixed(DOLLAR_DECIMALS)}</span>
          {/*TODO: remove ratio and update value conversion*/}
          <Progress
            className="health-progress"
            style={{ width: 130 }}
            percent={ratio}
            size="small"
          />
        </>
      ),
    },
    {
      title: "",
      dataIndex: "action",
      key: "action",
      align: "right",
      width: 200,
      render: (item) => (
        <>
          <Button
            type="primary"
            className="btn-filled"
            size="small"
            onClick={() => handleRouteChange(item)}
          >
            Manage
          </Button>
        </>
      ),
    },
  ];

  const handleRouteChange = (item) => {
    navigate(`/vault/${item?.pairId?.low}`);
  };

  const tableData =
    vaults &&
    vaults?.length > 0 &&
    vaults?.map((item) => {
      return {
        key: 1,
        vault: (
          <>
            <div className="assets-withicon">ATOM-A</div>
          </>
        ),
        debt: amountConversion(item?.debt || 0),
        apy: "20",
        health: item?.collateralizationRatio / 10 ** 16,
        action: item,
      };
    });

  return (
    <div className="app-content-wrapper vaults-table-container">
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
  address: PropTypes.string,
};

const stateToProps = (state) => {
  return {
    lang: state.language,
    address: state.account.address,
  };
};

const actionsToProps = {};

export default connect(stateToProps, actionsToProps)(MyVault);
