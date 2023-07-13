import { Button, Modal, Radio, Table } from 'antd';
import React, { useState } from 'react'
import CustomInput from '../../components/CustomInput';

const Stake = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const dataSource = [
        {
            key: '1',
            lockedHarbor: 0.50,
            issuedveHarbor: 32,
            lockedDate: 'Apr 12, 2023',
            unlocakDate: "Apr 20,2023"
        },
        {
            key: '2',
            lockedHarbor: 10.50,
            issuedveHarbor: 42,
            lockedDate: 'Apr 12, 2023',
            unlocakDate: "Apr 20,2023"
        },
    ];

    const columns = [
        {
            title: 'Locked HARBOR',
            dataIndex: 'lockedHarbor',
            key: 'lockedHarbor',
            width: 200
        },
        {
            title: 'Issued veHARBOR',
            dataIndex: 'issuedveHarbor',
            key: 'issuedveHarbor',
            align: "left",
            width: 200
        },
        {
            title: 'Locked Data',
            dataIndex: 'lockedDate',
            key: 'lockedDate',
            align: "left",
            width: 200
        },
        {
            title: 'Unlock Date',
            dataIndex: 'unlocakDate',
            key: 'unlocakDate',
            width: 200
        },
    ];

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <div className="stake_main_container">
                <div className="stake_container">
                    <div className="stake_position_main_container ">
                        <div className="stake_position_container">
                            <div className="box_1 card_container" >

                                <div className="box_1_title_container">
                                    <div className="title">Stake Position</div>
                                    <div className="id">NFT ID <span> 1783</span></div>
                                </div>

                                <div className="data_container">
                                    <div className="data_1">
                                        <div className="text">My HARBOR</div>
                                        <div className="value">189,805</div>
                                    </div>
                                    <div className="data_2">
                                        <div className="text">My veHARBOR</div>
                                        <div className="value">205,890</div>
                                    </div>
                                </div>
                                <div className="btn_container">
                                    <Button type='primary' className='btn-filled' onClick={showModal}>Stake</Button>
                                </div>
                            </div>
                            <div className="box_2 card_container">

                                <div className="box_1_title_container">
                                    <div className="title">Claim HARBOR</div>
                                </div>

                                <div className="data_container">
                                    <div className="data_1">
                                        <div className="text">Unlocked Harbor</div>
                                        <div className="value">25</div>
                                    </div>
                                    <div className="data_2">
                                        <div className="text">Claimed HARBOR</div>
                                        <div className="value">05</div>
                                    </div>
                                </div>
                                <div className="btn_container">
                                    <Button type='primary' className='btn-filled'>Claim</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="stake_harbor_container">
                        <div className="text">Staked Harbor</div>
                        {/* <div className="button">
                            <Button type='primary'>Claim</Button>
                        </div> */}
                    </div>
                    <div className="stake_harbor_table_container">
                        <div className="stakeHarbor_table">
                            <Table
                                dataSource={dataSource}
                                columns={columns}
                                pagination={false}
                                className='custom-table'
                            />
                        </div>
                    </div>

                    {/* Stake Modal  */}
                    <Modal title="Create Stake Position"
                        open={isModalOpen}
                        onOk={handleOk}
                        onCancel={handleCancel}
                        centered={true}
                        footer={false}
                        className='stake_modal'
                    >
                        <div className="stake_modal_main_container">
                            <div className="stake_modal_container">
                                <div className="max_amount_container">
                                    <div className="amount">Amount</div>
                                    <div className="max_container">
                                        <div className="btn_container">
                                            <Button className='maxhalf'>Max</Button>
                                        </div>
                                        <div className="value">123 HARBOR </div>
                                    </div>
                                </div>
                                <div className="input_container">
                                    <CustomInput className='stake_input_box' value={123.00} />
                                </div>

                                <div className="expires_container">
                                    <div className="title">Expires</div>
                                    <div className="input_select_radio">
                                        <Radio.Group>
                                            <Radio value="t1" >1 Month </Radio>
                                            <Radio value="t2" >4 Month </Radio>
                                        </Radio.Group>
                                    </div>
                                    <div className="paragraph_container">
                                        1 HARBOR locked for 1 month = 0.25 veHARBOR
                                    </div>
                                </div>

                                <div className="unlock_data_container">
                                    <div className="title">Unlock Date </div>
                                    <div className="value"> 17-August-2023</div>
                                </div>

                                <div className="voting_power_container">
                                    <div className="title">Your voting power will be</div>
                                    <div className="value">0 veHARBOR</div>
                                </div>

                                <div className="btn_container_stake">
                                    <Button type='primary' className='btn-filled'>Stake</Button>
                                </div>
                            </div>
                        </div>
                    </Modal>

                </div>
            </div>
        </>
    )
}

export default Stake;