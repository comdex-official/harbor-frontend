import { Button, Table } from 'antd';
import React from 'react'

const Stake = () => {

    const dataSource = [
        {
            key: '1',
            name: 'Mike',
            age: 32,
            address: '10 Downing Street',
            unlocakDate: "Apr 20,2023"
        },
        {
            key: '2',
            name: 'John',
            age: 42,
            address: '10 Downing Street',
            unlocakDate: "Apr 20,2023"
        },
    ];

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: 200
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
            align: "left",
            width: 200
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
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

    return (
        <>
            <div className="stake_main_container">
                <div className="stake_container">
                    <div className="stake_position_main_container card_container">
                        <div className="title">Stake Position</div>
                        <div className="stake_position_container">
                            <div className="column_1">
                                <div className="upper_column">
                                    <div className="text primary_heading">NFT ID</div>
                                    <div className="value primary_values">1894</div>
                                </div>
                                <div className="lower_column">
                                    <div className="text primary_heading">Claimed HARBOR</div>
                                    <div className="value primary_values">1894</div>
                                </div>

                            </div>
                            <div className="column_2">
                                <div className="upper_column">
                                    <div className="text primary_heading">My HARBOR</div>
                                    <div className="value primary_values">05 HARBOR</div>
                                </div>
                                <div className="lower_column">
                                    <div className="text primary_heading">My veHARBOR</div>
                                    <div className="value primary_values">05 veHARBOR</div>
                                </div>
                            </div>
                            <div className="column_3">
                                <div className="button">
                                    <Button type='primary' className='btn-filled'>Stake</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="stake_harbor_container">
                        <div className="text">Staked Harbor</div>
                        <div className="button">
                            <Button type='primary'>Claim</Button>
                        </div>
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
                </div>
            </div>
        </>
    )
}

export default Stake;