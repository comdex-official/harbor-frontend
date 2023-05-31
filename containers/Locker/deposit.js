import CustomInput from '@/components/CustomInput'
import { Button } from 'antd'
import React from 'react'

const Deposit = () => {
    return (
        <>
            <div className="locker_deposit_main_container">
                <div className="locker_deposit_container card_container">
                    <div className="locker_deposit_data_container">

                        <div className="locker_deposit_data">
                            <div className="deposit_amount_container">
                                <div className="title_container">
                                    <div className="number">01</div>
                                    <div className="text">Input Deposit Amount</div>
                                </div>
                                <div className="input_container">
                                    <div className="amount_container">
                                        <Button> MAX</Button>
                                        <span>7 CMST</span>
                                    </div>
                                    <div className="input_container">
                                        <CustomInput />
                                    </div>
                                </div>
                            </div>

                            <div className="reward_rate_container">
                                <div className="title_container">
                                    <div className="number">02</div>
                                    <div className="text">Reward Rate</div>
                                </div>
                            </div>
                            <div className="earn_reward_container">
                                <div className="title_container">
                                    <div className="number">03</div>
                                    <div className="text">Earn Rewards</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="locker_deposit_btn_container">

                    </div>
                </div>
            </div>
        </>
    )
}

export default Deposit