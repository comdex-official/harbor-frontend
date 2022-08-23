import { Button } from 'antd';
import * as PropTypes from "prop-types";
import React from 'react'
import { connect } from 'react-redux';
import { Col } from '../../../components/common';
import TooltipIcon from '../../../components/TooltipIcon';

const CloseLocker = ({ address, ownerLockerInfo }) => {

    const handleCloseLocker = () => {
        if (!address) {
            message.error("Address not found, please connect to Keplr");
            return;
        }
        setInProgress(true);
        message.info("Transaction initiated");
        signAndBroadcastTransaction(
            {
                message: {
                    typeUrl: "/comdex.locker.v1beta1.MsgCloseLockerRequest",
                    value: {
                        depositor: address,
                        appId: Long.fromNumber(PRODUCT_ID),
                        assetId: Long.fromNumber(whiteListedAssetId),
                        lockerId: lockerId,
                    },
                },
                fee: defaultFee(),
            },
            address,
            (error, result) => {
                setInProgress(false);
                if (error) {
                    message.error(error);
                    return;
                }

                if (result?.code) {
                    message.info(result?.rawLog);
                    return;
                }
                message.success(
                    <Snack
                        message={variables[lang].tx_success}
                        hash={result?.transactionHash}
                    />
                );
                resetValues();
                dispatch({
                    type: "BALANCE_REFRESH_SET",
                    value: refreshBalance + 1,
                });
            }
        );
    }
    return (
        <>
            <Col>
                <div className="farm-content-card earn-deposite-card earn-main-deposite locker-close-card">
                    <div className="locker-title">  Close Locker</div>
                    <div className="assets-select-card locker-close-card-details  ">
                        <div className="assets-left">
                            <label className="leftlabel">
                                Payable Amount <TooltipIcon />
                            </label>
                        </div>
                        <div className="assets-right">
                            <div className="label-right">
                                0.000000 CMST
                            </div>

                        </div>
                    </div>

                    <div className="assets PoolSelect-btn">
                        <div className="assets-form-btn text-center  mb-2">
                            <Button
                                // loading={inProgress}
                                // disabled={
                                //     !inAmount || inAmount <= 0 || inProgress || inputValidationError?.message
                                // }
                                type="primary"
                                className="btn-filled"
                                onClick={() => {
                                    if (isLockerExist) {
                                        handleCloseLocker()
                                    }
                                }}
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            </Col>
        </>
    )
}

CloseLocker.propTypes = {
    address: PropTypes.string.isRequired,
    ownerLockerInfo: PropTypes.array,
};
const stateToProps = (state) => {
    return {
        address: state.account.address,
        lang: state.language,
        ownerLockerInfo: state.locker.ownerVaultInfo,
    };
};
const actionsToProps = {
};
export default connect(stateToProps, actionsToProps)(CloseLocker);