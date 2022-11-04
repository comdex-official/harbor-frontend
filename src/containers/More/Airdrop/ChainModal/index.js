import React, { useEffect, useState } from "react";
import * as PropTypes from "prop-types";
import { SvgIcon, Row, Col } from "../../../../components/common";
import { connect } from "react-redux";
import { Button, Modal, Input } from "antd";
import "./index.scss";

import AGORIC_ICON from '../../../../assets/images/icons/AGORIC.png';
import TooltipIcon from "../../../../components/TooltipIcon";
import { checkEligibility, unclaimHarbor } from "../../../../services/airdropContractRead";
import { setuserEligibilityData } from "../../../../actions/airdrop";
import { TOTAL_ACTIVITY, TOTAL_VEHARBOR_ACTIVITY } from "../../../../constants/common";
import { amountConversionWithComma } from "../../../../utils/coin";
import { Link } from "react-router-dom";
import { truncateString } from "../../../../utils/string";
import Copy from "../../../../components/Copy";

const ChainModal = ({
  currentChain,
  lang,
  address,
  refreshBalance,
  userEligibilityData,
  setuserEligibilityData,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false)
  const [userAddress, setUserAddress] = useState("");

  // Query 
  const fetchCheckEligibility = (address, chainId) => {
    setLoading(true)
    checkEligibility(address, chainId).then((res) => {
      console.log(res);
      setuserEligibilityData(res)
      setLoading(false)
    }).catch((error) => {
      setLoading(false)
      console.log(error);
    })
  }



  useEffect(() => {
    if (isModalVisible) {
      fetchCheckEligibility(address, currentChain?.chainId)
    }
  }, [address, isModalVisible])

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const checkChainAddressEligibility = () => {
    console.log(userAddress, "userAddress");
    fetchCheckEligibility(userAddress, currentChain?.chainId)
  }
  return (
    <>
      <Button className="icons" disabled={true} onClick={showModal}>
        <div className="icon-inner" >
          <img src={currentChain?.icon} alt="" />
        </div>
      </Button>
      <Modal
        className="claimrewards-modal"
        centered={true}
        closable={false}
        footer={null}
        open={isModalVisible}
        width={683}
        onCancel={handleCancel}
        onOk={handleOk}
        closeIcon={<SvgIcon name="close" viewbox="0 0 19 19" />}
        title={
          <div className="claim-box-modal-main-head">
            <div className="title-head">
              <div className="icons" onClick={showModal}>
                <div className="icon-inner">
                  <img src={currentChain?.icon} alt="" />
                </div>
              </div>
              <span>{currentChain?.chainName}</span>
            </div>
            <div className="mission-complete-btn">
              <Link to={`./complete-mission/${currentChain?.chainId}`}><Button type="primary" size="small" disabled={!userEligibilityData} className="">Complete Mission</Button></Link>
            </div>
          </div>
        }
      >
        <Row className="mb-4">
          <Col>
            <label>Check Eligibility</label>
            <div className="d-flex">
              <Input onChange={(e) => setUserAddress(e.target.value)} placeholder={`Entre Your ${currentChain?.chainName} Wallet Address`} /> <Button type="primary" className="btn-filled" loading={loading} onClick={() => checkChainAddressEligibility()}>Check</Button>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <label>Magic Transaction</label>
            <div className="address-text-container">
              <div className="address"> <span>xxxxx1r09tg524dd7xxxxxxxxxxxxxxxxx2737us</span>  <span className="modal-address-copy-icon">{<Copy text="xxxxx1r09tg524dd7xxxxxxxxxxxxxxxxx2737us" />}</span></div>
            </div>
            <div className="error-text"><SvgIcon name="info" viewbox="0 0 16.25 16.25" /> Send a minimal amount to the above address. Users need to input Comdex address in MEMO.</div>
          </Col>
        </Row>
        <Row>
          <Col className="bottom-text">
            <p>
              Harbor Claim <TooltipIcon text="This will get added into Your Harbor Airdrop Balance" />
              <SvgIcon className="check-green" name="check-circle" viewbox="0 0 15 15" />
            </p>
            <h2>{amountConversionWithComma(userEligibilityData?.claimable_amount / TOTAL_ACTIVITY || 0)}<sub>HARBOR</sub></h2>
          </Col>
          <Col className="bottom-text">
            <p>
              veHarbor Claim <TooltipIcon text="This will get added into Your veHarbor Airdrop Balance" />
              <SvgIcon className="check-green" name="check-circle" viewbox="0 0 15 15" />
            </p>
            <h2>{amountConversionWithComma((Number(userEligibilityData?.claimable_amount / TOTAL_ACTIVITY) * Number(TOTAL_VEHARBOR_ACTIVITY)) || 0)} <sub>veHARBOR</sub></h2>
          </Col>
        </Row>

      </Modal>
    </>
  );
};

ChainModal.propTypes = {
  lang: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  refreshBalance: PropTypes.number.isRequired,
  userEligibilityData: PropTypes.object.isRequired,
};

const stateToProps = (state) => {
  return {
    lang: state.language,
    address: state.account.address,
    refreshBalance: state.account.refreshBalance,
    userEligibilityData: state.airdrop.userEligibilityData,
  };
};

const actionsToProps = {
  setuserEligibilityData,
};

export default connect(stateToProps, actionsToProps)(ChainModal);