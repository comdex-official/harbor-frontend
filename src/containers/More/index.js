import "./index.scss";
import * as PropTypes from "prop-types";
import { Col, Row, SvgIcon } from "../../components/common";
import { Table } from "antd";
import { connect } from "react-redux";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Button, Modal, message } from "antd";
import { iconNameFromDenom } from "../../utils/string";
import { amountConversionWithComma, denomConversion } from "../../utils/coin";

const More = () => {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleRouteChange = (path) => {
    navigate({
      pathname: path,
    });
  };


  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };


  const columns = [
    {
      title: (
        <>
          Pool
        </>
      ),
      dataIndex: "pool",
      key: "pool",
      width: 150,
    },
    {
      title: (
        <>
          You Earned{" "}
        </>
      ),
      dataIndex: "you_earned",
      key: "you_earned",
      width: 150,
      align: "right",
    },

  ];

  const tableData = [
    {

      key: 1,
      id: 1,
      pool: (
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
      you_earned: (
        <>
          <div className="assets-withicon display-right">
            1  ATOM
          </div>
        </>
      ),
    },
    {

      key: 2,
      id: 1,
      pool: (
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
      you_earned: (
        <>
          <div className="assets-withicon display-right">
            1  ATOM
          </div>
        </>
      ),
    }

  ]



  return (


    <div className="app-content-wrapper">
      <Row>
        <Col lg="6" md="6" sm="12" className="mb-3">
          <div className="more-card">
            <div className="more-card-inner">
              <div className="morecard-left">
                <h2> Governance</h2>
                <p>
                  Use HARBOR token to drive key decision for the protocol via proposals
                </p>
                <div className="button-container">
                  <Button
                    type="primary"
                    className="btn-filled"
                    onClick={() => handleRouteChange("/govern")}
                  >
                    Govern
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Col>

        <Col lg="6" md="6" sm="12" className="mb-3">
          <div className="more-card">
            <div className="more-card-inner">
              <div className="morecard-left">
                <h2>Airdrop</h2>
                <p>
                  Perform tasks to claim your HARBOR airdrop.
                </p>
                <div className="button-container">
                  <Button
                    type="primary"
                    className="btn-filled"
                    disabled={true}
                  // onClick={() => handleRouteChange("/airdrop")}
                  >
                    Coming Soon
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Col>

        <Col lg="6" md="6" sm="12" className="mb-3">
          <div className="more-card">
            <div className="more-card-inner">
              <div className="morecard-left">
                <h2>Locker</h2>
                <p>
                  More tokens locked for longer = greater voting power = higher rewards.
                </p>
                <div className="button-container">
                  <Button
                    type="primary"
                    className="btn-filled"
                    onClick={() => handleRouteChange("/locker")}
                    disabled={true}
                  >
                    Lock
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Col>

        <Col lg="6" md="6" sm="12" className="mb-3">
          <div className="more-card">
            <div className="more-card-inner">
              <div className="morecard-left">
                <h2>Vote</h2>
                <p>
                  Earn a share of your pool’s transaction fees, bribes, and emission rewards.
                </p>
                <div className="button-container">
                  <Button
                    type="primary"
                    className="btn-filled"
                    onClick={() => handleRouteChange("/vote")}
                    disabled={true}
                  >
                    Vote
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Col>

        <Col lg="6" md="6" sm="12" className="mb-3">
          <div className="more-card">
            <div className="more-card-inner">
              <div className="morecard-left">
                <h2>Rewards</h2>
                <p>
                 Rewards displayed are an estimation of the trading fees, voting rewards and rebases that you can claim.
                </p>
                <div className="button-container">
                  <Button
                    type="primary"
                    className="btn-filled"
                    onClick={showModal}
                    disabled={true}
                  // onClick={() => handleRouteChange("/rewards")}
                  >
                    Claim
                  </Button>


                  <Modal
                    centered={true}
                    className="palcebid-modal reward-collect-modal"
                    footer={null}
                    header={null}
                    visible={isModalVisible}
                    width={550}
                    closable={false}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    closeIcon={null}
                  >
                    <div className="palcebid-modal-inner rewards-modal-main-container">
                      <Row>
                        <Col>
                          <div className="rewards-title">
                            Claim Rewards
                          </div>
                        </Col>
                      </Row>

                      <Row style={{ paddingTop: 0 }}>
                        <Col>
                          <div className="card-content ">
                            <Table
                              className="custom-table liquidation-table"
                              dataSource={tableData}
                              columns={columns}
                              pagination={false}
                              scroll={{ x: "100%" }}
                            />
                          </div>
                        </Col>
                      </Row>

                      <Row>
                        <Col className="diaplay-center flex">
                          <Button
                            type="primary"
                            className="btn-filled "
                            size="sm"
                          >
                            Claim All
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  </Modal>

                </div>
              </div>
            </div>
          </div>
        </Col>

      </Row>
    </div>
  );
};

More.propTypes = {
  lang: PropTypes.string.isRequired,
};

const stateToProps = (state) => {
  return {
    lang: state.language,
  };
};

export default connect(stateToProps)(More);
