import CustomInput from '@/components/CustomInput'
import { ATOM } from '@/components/image'
import { Icon } from '@/components/image/Icon'
import { NextImage } from '@/components/image/NextImage'
import { Button, Slider, Modal } from 'antd'
import Link from 'next/link'
import React, { useState } from 'react'

const Vault = () => {

    const [isAdjustCollateralModalOpen, setIsAdjustCollateralModalOpen] = useState(false);
    const [isAdjustLoanModalOpen, setIsAdjustLoanModalOpen] = useState(false);
    const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);

    const showAdjustCollateralModal = () => {
        setIsAdjustCollateralModalOpen(true);
    };
    const handleAdjustCollateralOk = () => {
        setIsAdjustCollateralModalOpen(false);
    };
    const handleAdjustCollateralCancel = () => {
        setIsAdjustCollateralModalOpen(false);
    };

    const showAdjustLoanModal = () => {
        setIsAdjustLoanModalOpen(true);
    };
    const handleAdjustLoanOk = () => {
        setIsAdjustLoanModalOpen(false);
    };
    const handleAdjustLoanCancel = () => {
        setIsAdjustLoanModalOpen(false);
    };

    const showCloseModal = () => {
        setIsCloseModalOpen(true);
    };
    const handleCloseOk = () => {
        setIsCloseModalOpen(false);
    };
    const handleCloseCancel = () => {
        setIsCloseModalOpen(false);
    };

    const marks = {
        [0]: `Min`,
        [150]: `Risky`,
        [250]: `Safe`,
        [500]: "Max"
    };

    return (
        <>
            <div className="mint_vault_main_container">
                <div className="mint_feature_button_main_container">
                    <div className="mint_feature_button_container">
                        <div className="button_container">
                            <Button type='primary' className='btn-filled' onClick={showAdjustCollateralModal}>Adjust Collateral</Button>
                        </div>
                        <div className="button_container">
                            <Button type='primary' className='btn-filled' onClick={showAdjustLoanModal}>Adjust Loan</Button>
                        </div>
                        <div className="button_container">
                            <Button type='primary' className='btn-filled' onClick={showCloseModal}>Close</Button>
                        </div>
                        <div className="button_container">
                            <Link href="/mint"> <Button type='primary' className=''>Back</Button></Link>
                        </div>
                    </div>
                </div>

                {/* Mint Up Container  */}
                <div className="mint_vault_up_container">
                    <div className="locker_deposit_main_container">
                        <div className="locker_deposit_container card_container">
                            <div className="locker_deposit_data_container">

                                <div className="locker_deposit_data">
                                    <div className="deposit_amount_container">
                                        <div className="title_container">
                                            <div className="number">01</div>
                                            <div className="text">Input Collateral Amount</div>
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

                                    <div className="reward_rate_container">
                                        <div className="title_container">
                                            <div className="number">02</div>
                                            <div className="text">Set Collateral Ratio</div>
                                        </div>
                                        <div className="value_container">
                                            <div className="slider_main_container">
                                                <Slider
                                                    className={
                                                        "comdex-slider mint_slider "
                                                        // +
                                                        // (collateralRatio <= minCrRatio
                                                        //     ? " red-track"
                                                        //     : collateralRatio < moderateSafe
                                                        //         ? " red-track"
                                                        //         : collateralRatio < safeCrRatio
                                                        //             ? " orange-track"
                                                        //             : collateralRatio >= safeCrRatio
                                                        //                 ? " green-track"
                                                        //                 : " ")
                                                    }
                                                    defaultValue={170}
                                                    marks={marks}
                                                    max={500}
                                                    tooltip={{ open: false }}
                                                />
                                            </div>
                                            <div className="input_box_container">
                                                <CustomInput
                                                    defaultValue={50}
                                                    placeholder="0"
                                                    value={185}
                                                />
                                                <span className="collateral_percentage">%</span>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="earn_reward_container">
                                        <div className="deposit_amount_container">
                                            <div className="title_container">
                                                <div className="number">03</div>
                                                <div className="text">Mint CMST</div>
                                            </div>
                                            <div className="input_container_box">
                                                <div className="amount_container title_comtainer_box">
                                                    {/* <Button className='maxhalf'> MAX</Button> */}
                                                    <span className='title'>You will Receive</span>
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
                                    </div>
                                </div>
                            </div>
                            <div className="locker_deposit_btn_container">
                                <Button type='primary' className='btn-filled'>
                                    Mint
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mint Middle Container  */}
                <div className="mint_vault_user_details_main_container mt-4">
                    <div className="mint_vault_user_details_container card_container">
                        <div className="details_title_container">
                            <div className="details_title">Your Vault Details</div>
                            <div className="details_id">#45</div>
                        </div>
                        <div className="user_detail_main_box">

                            <div className="user_details_box">
                                <div className="detail_name">Liquidation Price</div>
                                <div className="detail_value">$40.00</div>
                            </div>
                            <div className="user_details_box">
                                <div className="detail_name">Collateral Ratio</div>
                                <div className="detail_value">10.81%</div>
                            </div>
                            <div className="user_details_box">
                                <div className="detail_name">Stability Fees due</div>
                                <div className="detail_value">10.00 CMST</div>
                            </div>
                            <div className="user_details_box">
                                <div className="detail_name">CMST Withdrawn</div>
                                <div className="detail_value">10.00 CMST</div>
                            </div>
                            <div className="user_details_box">
                                <div className="detail_name">Collateral Deposited</div>
                                <div className="detail_value">20.00 ATOM</div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Mint Bottom Container  */}

                <div className="mint_vault_details_main_container mt-4">
                    <div className="mint_vault_details_container card_container">
                        <div className="details_title_container">
                            <div className="details_title">Vault Details</div>
                        </div>
                        <div className="user_detail_main_box">

                            <div className="user_details_box">
                                <div className="detail_name">Stability Fee</div>
                                <div className="detail_value">1.00%</div>
                            </div>
                            <div className="user_details_box">
                                <div className="detail_name">Min. Collateralization Ratio</div>
                                <div className="detail_value">140.00%</div>
                            </div>
                            <div className="user_details_box">
                                <div className="detail_name">Total CMST Minted</div>
                                <div className="detail_value">13.56k CMST</div>
                            </div>
                            <div className="user_details_box">
                                <div className="detail_name">Oracle price</div>
                                <div className="detail_value">$0.00</div>
                            </div>
                            <div className="user_details_box">
                                <div className="detail_name">Drawdown Fee</div>
                                <div className="detail_value">0.5%</div>
                            </div>
                            <div className="user_details_box">
                                <div className="detail_name">Min. Borrow Amount</div>
                                <div className="detail_value">50 CMST</div>
                            </div>
                            <div className="user_details_box">
                                <div className="detail_name">Debt Celing</div>
                                <div className="detail_value">35,000 CMST</div>
                            </div>

                        </div>
                    </div>
                </div>


                {/* Modals  */}
                {/* Adjust Collateral Modal  */}

                <Modal title="Adjust Collateral"
                    open={isAdjustCollateralModalOpen}
                    onOk={handleAdjustCollateralOk}
                    onCancel={handleAdjustCollateralCancel}
                    centered={true}
                    footer={false}
                    className='mint_modal adjust_collateral_modal'
                >
                    <>
                        <div className="adjust_collateral_modal_main_container">
                            <div className="adjust_collateral_modal_container">
                                <div className="adjust_collateral_title">Adjust Collateral Ratio</div>
                                <div className="adjust_collateral_slider_container">
                                    <div className="slider_and_input_container">
                                        <div className="slider_main_container">
                                            <Slider
                                                className={
                                                    "comdex-slider mint_slider "
                                                }
                                                defaultValue={170}
                                                marks={marks}
                                                max={500}
                                                tooltip={{ open: false }}
                                            />
                                        </div>
                                        <div className="input_box_container">
                                            <CustomInput
                                                defaultValue={50}
                                                placeholder="0"
                                                value={185}
                                            />
                                            <span className="collateral_percentage">%</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="input_icon_container">
                                    <div className="input_container_box">
                                        <div className="amount_container">
                                            <div className="title_container">Deposit</div>
                                            <div className="btn_container">

                                                <Button className='maxhalf'> MAX</Button>
                                                <span className='amount'>7 Atom</span>
                                            </div>
                                        </div>
                                        <div className="input_container">
                                            <div className="icon_container">
                                                <div className="assets-withicon">
                                                    <div className="assets-icons">
                                                        <NextImage src={ATOM} height={35} width={35} />
                                                    </div>
                                                    <div className="name">
                                                        Atom
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

                                <div className="input_icon_container">
                                    <div className="input_container_box">
                                        <div className="amount_container">
                                            <div className="title_container">Withdraw</div>
                                            <div className="btn_container">

                                                <Button className='maxhalf'> MAX</Button>
                                                <span className='amount'>3 CMST</span>
                                            </div>
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

                                <div className="vault_debt_details_main_container">
                                    <div className="vault_debt_details_container">
                                        <div className="details_row">
                                            <div className="details_title">Vault CMST Debt</div>
                                            <div className="details_value"> 23 CMST <span className='arrow'>&#8702;</span>  123 CMST</div>
                                        </div>
                                        <div className="details_row">
                                            <div className="details_title">Total Collateral in Vault</div>
                                            <div className="details_value"> 123 Atom <span className='arrow'>&#8702;</span>  23 atom</div>
                                        </div>
                                        <div className="details_row">
                                            <div className="details_title">Expected Liquidation Price</div>
                                            <div className="details_value"> $12.86 <span className='arrow'>&#8702;</span>  $24.86</div>
                                        </div>
                                        <div className="details_row">
                                            <div className="details_title">Expected Collatralization Ratio</div>
                                            <div className="details_value"> 180% <span className='arrow'>&#8702;</span>  140%</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="deposit_btn_container">
                                    <Button type='primary' className='btn-filled'> Deposit</Button>
                                </div>

                            </div>
                        </div>
                    </>
                </Modal>


                {/* Adjust Loan Modal  */}


                <Modal title="Adjust Loan"
                    open={isAdjustLoanModalOpen}
                    onOk={handleAdjustLoanOk}
                    onCancel={handleAdjustLoanCancel}
                    centered={true}
                    footer={false}
                    className='mint_modal'
                >
                    <>
                        <div className="adjust_collateral_modal_main_container">
                            <div className="adjust_collateral_modal_container">
                                <div className="adjust_collateral_title">Adjust Collateral Ratio</div>
                                <div className="adjust_collateral_slider_container">
                                    <div className="slider_and_input_container">
                                        <div className="slider_main_container">
                                            <Slider
                                                className={
                                                    "comdex-slider mint_slider "
                                                }
                                                defaultValue={170}
                                                marks={marks}
                                                max={500}
                                                tooltip={{ open: false }}
                                            />
                                        </div>
                                        <div className="input_box_container">
                                            <CustomInput
                                                defaultValue={50}
                                                placeholder="0"
                                                value={185}
                                            />
                                            <span className="collateral_percentage">%</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="input_icon_container">
                                    <div className="input_container_box">
                                        <div className="amount_container">
                                            <div className="title_container">Deposit</div>
                                            <div className="btn_container">

                                                <Button className='maxhalf'> MAX</Button>
                                                <span className='amount'>7 cmst</span>
                                            </div>
                                        </div>
                                        <div className="input_container">
                                            <div className="icon_container">
                                                <div className="assets-withicon">
                                                    <div className="assets-icons">
                                                        <NextImage src={ATOM} height={35} width={35} />
                                                    </div>
                                                    <div className="name">
                                                        cmst
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

                                <div className="input_icon_container">
                                    <div className="input_container_box">
                                        <div className="amount_container">
                                            <div className="title_container">Withdraw</div>
                                            <div className="btn_container">

                                                <Button className='maxhalf'> MAX</Button>
                                                <span className='amount'>3 CMST</span>
                                            </div>
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

                                <div className="vault_debt_details_main_container">
                                    <div className="vault_debt_details_container">
                                        <div className="details_row">
                                            <div className="details_title">Vault CMST Debt</div>
                                            <div className="details_value"> 23 CMST <span className='arrow'>&#8702;</span>  123 CMST</div>
                                        </div>
                                        <div className="details_row">
                                            <div className="details_title">Total Collateral in Vault</div>
                                            <div className="details_value"> 123 Atom <span className='arrow'>&#8702;</span>  23 atom</div>
                                        </div>
                                        <div className="details_row">
                                            <div className="details_title">Expected Liquidation Price</div>
                                            <div className="details_value"> $12.86 <span className='arrow'>&#8702;</span>  $24.86</div>
                                        </div>
                                        <div className="details_row">
                                            <div className="details_title">Expected Collatralization Ratio</div>
                                            <div className="details_value"> 180% <span className='arrow'>&#8702;</span>  140%</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="deposit_btn_container">
                                    <Button type='primary' className='btn-filled'> Repay</Button>
                                </div>

                            </div>
                        </div>
                    </>
                </Modal>

                {/* Close Modal  */}

                <Modal title="Close your Vault "
                    open={isCloseModalOpen}
                    onOk={handleCloseOk}
                    onCancel={handleCloseCancel}
                    centered={true}
                    footer={false}
                    className='mint_modal'
                >
                    <div className="mint_close_modal_main_container">
                        <div className="mint_close_modal_container">
                            <div className="details_main_container">
                                <div className="details_title">Total CMST Debt</div>
                                <div className="icon_with_number_container">
                                    <div className="asset_and_icon">
                                        <div className="assets-icons">
                                            <NextImage src={ATOM} height={35} width={35} />
                                        </div>
                                        <div className="name">
                                            CMST
                                        </div>
                                    </div>
                                    <div className="asset_value">
                                        713
                                    </div>
                                </div>
                            </div>

                            <div className="details_main_container">
                                <div className="details_title">ATOM to be Received</div>
                                <div className="icon_with_number_container">
                                    <div className="asset_and_icon">
                                        <div className="assets-icons">
                                            <NextImage src={ATOM} height={35} width={35} />
                                        </div>
                                        <div className="name">
                                            Atom
                                        </div>
                                    </div>
                                    <div className="asset_value">
                                        3456
                                    </div>
                                </div>
                            </div>
                            <div className="deposit_btn_container">
                                <Button type='primary' className='btn-filled'> Close</Button>
                            </div>

                        </div>
                    </div>


                </Modal>

            </div>

        </>
    )
}

export default Vault