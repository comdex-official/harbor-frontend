import "./index.scss";
import * as PropTypes from "prop-types";
import { Col, Row } from "../../components/common";
import { connect } from "react-redux";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Button, Modal, message } from "antd";

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
                  Perform tasks to claim your HARBOR airdrop.
                </p>
                <div className="button-container">
                  <Button
                    type="primary"
                    className="btn-filled"
                    onClick={() => handleRouteChange("/locker")}
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
                  Perform tasks to claim your HARBOR airdrop.
                </p>
                <div className="button-container">
                  <Button
                    type="primary"
                    className="btn-filled"
                    onClick={() => handleRouteChange("/vote")}
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
                  Perform tasks to claim your HARBOR airdrop.
                </p>
                <div className="button-container">
                  <Button
                    type="primary"
                    className="btn-filled"
                    onClick={showModal}
                  // onClick={() => handleRouteChange("/rewards")}
                  >
                    Claim
                  </Button>


                  <Modal
                    centered={true}
                    className="palcebid-modal auction-placebid-modal"
                    footer={null}
                    header={null}
                    visible={isModalVisible}
                    width={550}
                    closable={false}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    closeIcon={null}
                  >
                    <div className="palcebid-modal-inner">
                      {/* <Row>
                        <Col sm="6">
                          <p>Remaining Time </p>
                        </Col>
                        <Col sm="6" className="text-right">
                          <label>
                            <Timer expiryTimestamp={auction && auction.endTime} />
                          </label>
                        </Col>
                      </Row> */}








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
