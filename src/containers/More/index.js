import "./index.scss";
import * as PropTypes from "prop-types";
import { Col, Row } from "../../components/common";
import { connect } from "react-redux";
import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router";

const More = () => {
  const navigate = useNavigate();

  const handleRouteChange = (path) => {
    navigate({
      pathname: path,
    });
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
                  Stake your CMDX tokens to earn rewards and participate in
                  governance proposals
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
                  Auction between bidders to capitalize on the liquidation of
                  assets and acquire assets at a discounted rate
                </p>
                <div className="button-container">
                  <Button
                    type="primary"
                    className="btn-filled"
                    onClick={() => handleRouteChange("/airdrop")}
                  >
                    Enter Now
                  </Button>
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
