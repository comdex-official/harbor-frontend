import { Button } from 'antd';
import React, { useState } from 'react'
import { Col, Row, SvgIcon } from '../../../components/common';
import CustomInput from '../../../components/CustomInput';
import TooltipIcon from '../../../components/TooltipIcon';
import { amountConversionWithComma, denomConversion, getAmount } from '../../../utils/coin';
import { iconNameFromDenom, toDecimals } from '../../../utils/string';
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { ValidateInputNumber } from '../../../config/_validation';
import { setAmountIn } from '../../../actions/asset';
import { DatePicker, Space } from 'antd';
import { Radio } from 'antd';

const Create = () => {
    const dispatch = useDispatch();
    const inAmount = useSelector((state) => state.asset.inAmount);
    const [inputValidationError, setInputValidationError] = useState();
    const [radioValue, setRadioValue] = useState(1);

    const onRadioInputChange = (e) => {
        console.log('radio checked', e.target.value);
        setRadioValue(e.target.value);
    };

    const onChange = (date, dateString) => {
        console.log(date, dateString);
    };

    const handleFirstInputChange = (value) => {
        value = toDecimals(value).toString().trim();
        setInputValidationError(
            ValidateInputNumber(
                Number(getAmount(value)),
                "",
                "macro"
            )
        );
        dispatch(setAmountIn(value));
    };

    return (
        <>
            <div className=" locker-create-main-wrapper">
                <div className="farm-content-card earn-deposite-card earn-main-deposite locker-main-container">
                    <div className="locker-title">Create New Lock</div>
                    <div className="amount-available-main-container">
                        <div className="amount-container">Amount</div>
                        <div className="available-container">
                            <div className="label-right">
                                Available
                                <span className="ml-1">
                                    {amountConversionWithComma(35627876672)} {denomConversion("uharbor")}
                                </span>
                                <div className="maxhalf">
                                    <Button className="active" >
                                        Max
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="assets-select-card  ">
                        <div className="assets-right">
                            <div className="input-select">
                                <CustomInput
                                    value={inAmount}
                                    onChange={(event) => {
                                        handleFirstInputChange(event.target.value);
                                    }}
                                    validationError={inputValidationError}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="date-main-container mt-4">
                        <div className="amount-available-main-container">
                            <div className="amount-container">Date</div>
                        </div>
                        <div className="assets-select-card  ">
                            <div className="assets-right">
                                <div className="input-select">
                                    <Space direction="vertical">
                                        <DatePicker onChange={onChange} />
                                    </Space>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="date-main-container mt-4">
                        <div className="amount-available-main-container">
                            <div className="amount-container">Expires</div>
                        </div>
                        <div className="radio-input-main-container ">
                            <div className="assets-right">
                                <div className="input-select">
                                    <Radio.Group onChange={onRadioInputChange} value={radioValue}>
                                        <Radio value={1}>1 Week</Radio>
                                        <Radio value={2}>1 Month</Radio>
                                        <Radio value={3}>1 Years</Radio>
                                        <Radio value={4}>4 Years</Radio>
                                    </Radio.Group>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="voting-main-container mt-3 ml-1">
                        <div className="voting-title">Your voting power will be:</div>
                        <div className="value-main-container">
                            <div className="harbor-value">0 VHARBOR</div>
                            <div className="harbor-locked-value">
                                1000 HARBOR locked for a week gets only 4.8 VHARBOR
                            </div>
                        </div>
                    </div>

                    <div className="rewards-calculator-main-box ml-1 mt-4">
                        <div className="reward-value-1  reward-value-common-class">1 week = 100/208 (208 weeks in 4 years)</div>
                        <div className="reward-value-2 reward-value-common-class">1 year = 1000/4 (to calculate single year)</div>
                        <div className="reward-value-3 reward-value-common-class">1 month = 1000/48 (48 months in 4 year)</div>
                        <div className="reward-value-4 reward-value-common-class">4 year = 1000</div>
                    </div>

                    <div className="assets-poolSelect-btn">
                        <div className="assets-form-btn text-center  mb-2">
                            <Button
                                type="primary"
                                className="btn-filled"
                            >
                                Proceed
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Create