import * as PropTypes from "prop-types";
import { Button, Radio, Modal, Space, message } from "antd";
import { Row, Col } from "../../../../components/common";
import { connect } from "react-redux";
import React, { useState } from "react";
import "./index.scss"
import { transactionForVote } from '../../../../services/contractsWrite'
import { useParams } from "react-router";

const VoteNowModal = ({
  lang,
  address,
  currentProposal,
}) => {
  const { proposalId } = useParams();
  let currentProposalId = Number(proposalId);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userVote, setUserVote] = useState();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setLoading(true)
    if (address) {
      transactionForVote(currentProposalId, userVote, (error, result) => {
        if (error) {
          console.log(error);
          message.error(error?.message)
          setLoading(false)
          return;
        }
        console.log(result);
        message.success("Success")
        setLoading(false)
        setIsModalVisible(false);
      })
    }
    else {
      setLoading(false)
      message.error("Please Connect Wallet")
    }

  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  return (
    <>
      <Button type="primary" className="btn-filled mb-n4" onClick={showModal} loading={loading} disabled={loading} >Vote Now</Button>
      <Modal
        centered={true}
        className="votenow-modal"
        footer={null}
        header={null}
        visible={isModalVisible}
        width={550}
        closable={false}
        onOk={handleOk}
        onCancel={handleCancel}
        closeIcon={null}
      >
        <div className="votenow-modal-inner">
          <Row>
            <Col sm="12">
              <h3>Your Vote</h3>
              <p>#2 Lorem Ipsum diote Lorem Ipsum diote Lorem Ipsum diote</p>
              <Radio.Group name="radiogroup" onChange={(e) => setUserVote(e.target.value)}>
                <Space direction="vertical">
                  <Radio value="yes">Yes</Radio>
                  <Radio value="no">No</Radio>
                  <Radio value="veto">NoWithVeto</Radio>
                  <Radio value="abstrain">Abstain</Radio>
                </Space>
              </Radio.Group>
            </Col>
          </Row>
          <Row className="p-0">
            <Col className="text-right mt-3">
              <Button type="primary" className="px-5 mr-3" size="large" onClick={handleCancel} loading={loading} >
                Delete
              </Button>
              <Button type="primary" className="btn-filled px-5" size="large" onClick={handleOk} loading={loading}  >
                Confirm
              </Button>
            </Col>
          </Row>
        </div>
      </Modal>
    </>
  );
};

VoteNowModal.propTypes = {
  lang: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  currentProposal: PropTypes.array.isRequired,
};

const stateToProps = (state) => {
  return {
    lang: state.language,
    address: state.account.address,
  };
};

const actionsToProps = {
};

export default connect(stateToProps, actionsToProps)(VoteNowModal);
