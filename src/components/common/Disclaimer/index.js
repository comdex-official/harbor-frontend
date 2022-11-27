import { Button, Modal, Checkbox } from "antd";
import React, { useState } from "react";
import "./index.scss";

const Disclaimer = () => {
  const [isOpen, setIsOpen] = useState(
    localStorage.getItem("agreement_accepted") === null
  );
  const [isChecked, setIsChecked] = useState(false);
  return (
    <>
      <Modal
        centered={true}
        className="disclaimer-modal"
        footer={null}
        header={null}
        open={isOpen}
        closable={false}
        width={800}
        isHidecloseButton={true}
        maskStyle={{ background: "rgba(0, 0, 0, 0.6)" }}
      >
        <div className="disclaimerinner">
          <h2>Disclaimer</h2>
          <div className="description-text">
            <p>
              Harbor Protocol is a fully decentralised Interchain Stablecoin Protocol on Comdex.
              <br />
              By accessing and/or using Harbor, User  agree to these <a href="https://terms.comdex.one/Comdex_Harbor_Terms_and_Conditions.pdf" target="_blank">Terms and Conditions </a> on behalf of yourself and any entity you represent, and you represent and warrant that you have the right and authority to do so.
            </p>

          </div>
          <div className="text-center mt-4">
            <Checkbox
              checked={isChecked}
              onChange={() => {
                setIsChecked((value) => !value);
              }}
            >
              I have read and understood the Terms and Conditions and wish to proceed.
            </Checkbox>
          </div>
          <div className="d-flex agree-btn">
            <Button
              disabled={!isChecked}
              name="Agree"
              type="primary"
              size="large"
              onClick={() => {
                setIsOpen(false);
                localStorage.setItem("agreement_accepted", "true");

              }}
              className="btn-filled"
            >
              Proceed
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Disclaimer;
