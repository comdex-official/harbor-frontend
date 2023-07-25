import CustomInput from '@/components/CustomInput'
import { ATOM } from '@/components/image'
import { Icon } from '@/components/image/Icon'
import { NextImage } from '@/components/image/NextImage'
import { Button } from 'antd'
import React from 'react'

const Withdraw = () => {
    return (
        <>
            <div className="locker_deposit_main_container">
                <div className="locker_deposit_container card_container">
                    <div className="locker_deposit_data_container">

                        <div className="locker_deposit_data">
                            <div className="deposit_amount_container">
                                <div className="title_container">
                                    <div className="number">01</div>
                                    <div className="text">Input Withdraw Amount</div>
                                </div>
                                <div className="input_container_box">
                                    <div className="amount_container">
                                        <Button className='maxhalf'> MAX</Button>
                                        <span className='amount'>7 CMST</span>
                                    </div>
                                    <div className="input_container">
                                        <div className="icon_container">
                                            <div className="assets-withicon">
                                                <div className="assets-icons">
                                                    <NextImage src={ATOM} height={35} width={35} />
                                                </div>
                                                <div className="name">
                                                    CMST
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <CustomInput
                                                className='custom-input'
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="reward_rate_container mr-4">
                                <div className="title_container">
                                    <div className="number">02</div>
                                    <div className="text">Calculate</div>
                                </div>
                                <div className="value_container">
                                    <div className="title">Calculated Drawdown Amount</div>
                                    <div className="value"><NextImage src={ATOM} height={35} width={35} /> 124 CMST</div>
                                </div>
                            </div>
                            <div className="earn_reward_container">
                                <div className="title_container">
                                    <div className="number">03</div>
                                    <div className="text">Mint CMST</div>
                                </div>
                                <div className="value_container">
                                    <div className="title">CMST To Be Minted</div>
                                    <div className="value"><NextImage src={ATOM} height={35} width={35} /> 20 CMST</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="locker_deposit_btn_container">
                        <Button type='primary' className='btn-filled'>
                            Withdraw
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Withdraw;