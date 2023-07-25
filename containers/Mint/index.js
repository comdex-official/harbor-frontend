import React from 'react'
import { NextImage } from '../../components/image/NextImage'
import { ATOM, HotIcon } from '../../components/image'
import '../../styles/containers/Mint/mint.module.scss'
import Carousel from 'react-elastic-carousel';
import { data } from './data';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Row, Col, SvgIcon } from "../../components/common/index"
import { Input } from 'antd';
import { Select } from 'antd';
import { Pagination } from 'antd';
import Link from 'next/link';

const Mint = () => {

    var settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 7,
        slidesToScroll: 1
    };

    const handleButtonClick = (key) => {
        console.log(key, "key");
    }

    const handleSelectChange = (value) => {
        console.log(value); // { value: "lucy", key: "lucy", label: "Lucy (101)" }
    };

    const onShowSizeChange = (current, pageSize) => {
        console.log(current, pageSize);
    };

    return (
        <>
            <div className="mint_main_container">
                <div className="mint_container">
                    <div className="mint_carousel_main_container">
                        <div className="mint_carousel_container">
                            <div className="button_main_container">
                                <Slider {...settings}>
                                    {
                                        data?.map((item) => {
                                            return (
                                                <div className="button_content active_button_content" key={item?.key} onClick={() => handleButtonClick(item?.key)}>
                                                    <div className="icon_container"><NextImage src={ATOM} alt="" /></div>
                                                    <div className="text_container">{item?.name}</div>
                                                </div>
                                            )
                                        })
                                    }
                                </Slider>
                            </div>
                        </div>
                    </div>

                    {/* Selected Vaults  */}

                    <div className="selected_vault_main_container">
                        <div className="selected_valut_container">
                            <div className="select_vault_title">Selected Valut</div>
                            <div className="vault_container_wrapper">

                                <Link href='/mint/vault/1'>
                                    <div className="vault_container">
                                        <div className="hot-tag hot-tag1">
                                            Hot <NextImage src={HotIcon} alt="" />
                                        </div>
                                        <div className="icon_name_row">
                                            <div className="pair_icon"><NextImage src={ATOM} alt="" /></div>
                                            <div className="name">Atom-A</div>
                                        </div>
                                        <div className="emossion_apr_row">
                                            <div className="emission_container">
                                                <div className="emission_title">Weekly Emission</div>
                                                <div className="emission_value">2,134,545 <span>HARBOR</span></div>
                                            </div>
                                            <div className="apr_container">
                                                <div className="apr_title">APR</div>
                                                <div className="apr_value">23.13%</div>
                                            </div>
                                        </div>
                                        <div className="contenet_container">
                                            <div className="content_title">Min. Collareralization ratio</div>
                                            <div className="content_value">140.00%</div>
                                        </div>
                                        <div className="contenet_container">
                                            <div className="content_title">Stability Fee</div>
                                            <div className="content_value">1.00%</div>
                                        </div>
                                        <div className="contenet_container">
                                            <div className="content_title">Total CMST Minted</div>
                                            <div className="content_value">1,052,528.93 CMST</div>
                                        </div>
                                    </div>
                                </Link>

                                <div className="vault_container">
                                    <div className="hot-tag hot-tag1">
                                        Hot <NextImage src={HotIcon} alt="" />
                                    </div>
                                    <div className="icon_name_row">
                                        <div className="pair_icon"><NextImage src={ATOM} alt="" /></div>
                                        <div className="name">Atom-A</div>
                                    </div>
                                    <div className="emossion_apr_row">
                                        <div className="emission_container">
                                            <div className="emission_title">Weekly Emission</div>
                                            <div className="emission_value">2,134,545 <span>HARBOR</span></div>
                                        </div>
                                        <div className="apr_container">
                                            <div className="apr_title">APR</div>
                                            <div className="apr_value">23.13%</div>
                                        </div>
                                    </div>
                                    <div className="contenet_container">
                                        <div className="content_title">Min. Collareralization ratio</div>
                                        <div className="content_value">140.00%</div>
                                    </div>
                                    <div className="contenet_container">
                                        <div className="content_title">Stability Fee</div>
                                        <div className="content_value">1.00%</div>
                                    </div>
                                    <div className="contenet_container">
                                        <div className="content_title">Total CMST Minted</div>
                                        <div className="content_value">1,052,528.93 CMST</div>
                                    </div>
                                </div>

                                <div className="vault_container">
                                    <div className="hot-tag hot-tag1">
                                        Hot <NextImage src={HotIcon} alt="" />
                                    </div>
                                    <div className="icon_name_row">
                                        <div className="pair_icon"><NextImage src={ATOM} alt="" /></div>
                                        <div className="name">Atom-A</div>
                                    </div>
                                    <div className="emossion_apr_row">
                                        <div className="emission_container">
                                            <div className="emission_title">Weekly Emission</div>
                                            <div className="emission_value">2,134,545 <span>HARBOR</span></div>
                                        </div>
                                        <div className="apr_container">
                                            <div className="apr_title">APR</div>
                                            <div className="apr_value">23.13%</div>
                                        </div>
                                    </div>
                                    <div className="contenet_container">
                                        <div className="content_title">Min. Collareralization ratio</div>
                                        <div className="content_value">140.00%</div>
                                    </div>
                                    <div className="contenet_container">
                                        <div className="content_title">Stability Fee</div>
                                        <div className="content_value">1.00%</div>
                                    </div>
                                    <div className="contenet_container">
                                        <div className="content_title">Total CMST Minted</div>
                                        <div className="content_value">1,052,528.93 CMST</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stable Vaults  */}
                    <div className="selected_vault_main_container">
                        <div className="selected_valut_container">
                            <div className="select_vault_title">Stable Valut</div>
                            <div className="vault_container_wrapper">

                                <Link href='/mint/stableVault/1'>
                                    <div className="vault_container">
                                        <div className="icon_name_row">
                                            <div className="pair_icon"><NextImage src={ATOM} alt="" /></div>
                                            <div className="name">AXL-USDC-CMST</div>
                                        </div>

                                        <div className="contenet_container">
                                            <div className="content_title">Drawdown Fee</div>
                                            <div className="content_value">0.1%</div>
                                        </div>
                                        <div className="contenet_container">
                                            <div className="content_title">Debt Ceiling</div>
                                            <div className="content_value">45,675,84 CMST</div>
                                        </div>
                                        <div className="contenet_container">
                                            <div className="content_title">Total CMST Minted</div>
                                            <div className="content_value">1,052,528.93 CMST</div>
                                        </div>
                                    </div>
                                </Link>

                                <div className="vault_container">
                                    <div className="icon_name_row">
                                        <div className="pair_icon"><NextImage src={ATOM} alt="" /></div>
                                        <div className="name">AXL-USDC-CMST</div>
                                    </div>

                                    <div className="contenet_container">
                                        <div className="content_title">Drawdown Fee</div>
                                        <div className="content_value">0.1%</div>
                                    </div>
                                    <div className="contenet_container">
                                        <div className="content_title">Debt Ceiling</div>
                                        <div className="content_value">45,675,84 CMST</div>
                                    </div>
                                    <div className="contenet_container">
                                        <div className="content_title">Total CMST Minted</div>
                                        <div className="content_value">1,052,528.93 CMST</div>
                                    </div>
                                </div>

                                <div className="vault_container">
                                    <div className="icon_name_row">
                                        <div className="pair_icon"><NextImage src={ATOM} alt="" /></div>
                                        <div className="name">AXL-USDC-CMST</div>
                                    </div>

                                    <div className="contenet_container">
                                        <div className="content_title">Drawdown Fee</div>
                                        <div className="content_value">0.1%</div>
                                    </div>
                                    <div className="contenet_container">
                                        <div className="content_title">Debt Ceiling</div>
                                        <div className="content_value">45,675,84 CMST</div>
                                    </div>
                                    <div className="contenet_container">
                                        <div className="content_title">Total CMST Minted</div>
                                        <div className="content_value">1,052,528.93 CMST</div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>


                    {/* All Vaults  */}

                    <div className="selected_vault_main_container">
                        <div className="selected_valut_container">
                            <div className='title_and_search_container'>
                                <div className="select_vault_title">All Valuts</div>

                                <div className='short_search_container'>
                                    <div className="short_container">
                                        <Select
                                            labelInValue
                                            defaultValue={{
                                                value: 'sort',
                                                label: 'Sort By',
                                            }}
                                            style={{
                                                width: 120,
                                            }}
                                            onChange={handleSelectChange}
                                            className="sort_dropdown"
                                            popupClassName="sort_dropdown_overlay "
                                            options={[
                                                {
                                                    value: 'apr',
                                                    label: 'APR',
                                                },
                                                {
                                                    value: 'cmstMinted',
                                                    label: 'CMST Minted',
                                                },
                                                {
                                                    value: 'asset',
                                                    label: 'Asset',
                                                },
                                            ]}
                                        />
                                    </div>
                                    <div className="mint-search-section">
                                        <Input
                                            placeholder="Search Asset.."
                                            suffix={<SvgIcon name="search" viewbox="0 0 18 18" />}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="vault_container_wrapper">

                                <Link href='/mint/vault/1'>
                                    <div className="vault_container">
                                        <div className="hot-tag hot-tag1">
                                            Hot <NextImage src={HotIcon} alt="" />
                                        </div>
                                        <div className="icon_name_row">
                                            <div className="pair_icon"><NextImage src={ATOM} alt="" /></div>
                                            <div className="name">Atom-A</div>
                                        </div>
                                        <div className="emossion_apr_row">
                                            <div className="emission_container">
                                                <div className="emission_title">Weekly Emission</div>
                                                <div className=" dash_line"></div>
                                            </div>
                                            <div className="apr_container">
                                                <div className="apr_title">APR</div>
                                                <div className="dash_line"></div>
                                            </div>
                                        </div>
                                        <div className="contenet_container">
                                            <div className="content_title">Min. Collareralization ratio</div>
                                            <div className="content_value">140.00%</div>
                                        </div>
                                        <div className="contenet_container">
                                            <div className="content_title">Stability Fee</div>
                                            <div className="content_value">1.00%</div>
                                        </div>
                                        <div className="contenet_container">
                                            <div className="content_title">Total CMST Minted</div>
                                            <div className="content_value">1,052,528.93 CMST</div>
                                        </div>
                                    </div>
                                </Link>

                                <Link href='/mint/vault/2'>
                                    <div className="vault_container">
                                        <div className="hot-tag hot-tag1">
                                            Hot <NextImage src={HotIcon} alt="" />
                                        </div>
                                        <div className="icon_name_row">
                                            <div className="pair_icon"><NextImage src={ATOM} alt="" /></div>
                                            <div className="name">Atom-A</div>
                                        </div>
                                        <div className="emossion_apr_row">
                                            <div className="emission_container">
                                                <div className="emission_title">Weekly Emission</div>
                                                <div className="emission_value">2,134,545 <span>HARBOR</span></div>
                                            </div>
                                            <div className="apr_container">
                                                <div className="apr_title">APR</div>
                                                <div className="apr_value">23.13%</div>
                                            </div>
                                        </div>
                                        <div className="contenet_container">
                                            <div className="content_title">Min. Collareralization ratio</div>
                                            <div className="content_value">140.00%</div>
                                        </div>
                                        <div className="contenet_container">
                                            <div className="content_title">Stability Fee</div>
                                            <div className="content_value">1.00%</div>
                                        </div>
                                        <div className="contenet_container">
                                            <div className="content_title">Total CMST Minted</div>
                                            <div className="content_value">1,052,528.93 CMST</div>
                                        </div>
                                    </div>
                                </Link>

                                <div className="vault_container">
                                    <div className="hot-tag hot-tag1">
                                        Hot <NextImage src={HotIcon} alt="" />
                                    </div>
                                    <div className="icon_name_row">
                                        <div className="pair_icon"><NextImage src={ATOM} alt="" /></div>
                                        <div className="name">Atom-A</div>
                                    </div>
                                    <div className="emossion_apr_row">
                                        <div className="emission_container">
                                            <div className="emission_title">Weekly Emission</div>
                                            <div className="emission_value">2,134,545 <span>HARBOR</span></div>
                                        </div>
                                        <div className="apr_container">
                                            <div className="apr_title">APR</div>
                                            <div className="apr_value">23.13%</div>
                                        </div>
                                    </div>
                                    <div className="contenet_container">
                                        <div className="content_title">Min. Collareralization ratio</div>
                                        <div className="content_value">140.00%</div>
                                    </div>
                                    <div className="contenet_container">
                                        <div className="content_title">Stability Fee</div>
                                        <div className="content_value">1.00%</div>
                                    </div>
                                    <div className="contenet_container">
                                        <div className="content_title">Total CMST Minted</div>
                                        <div className="content_value">1,052,528.93 CMST</div>
                                    </div>
                                </div>

                                <div className="vault_container">
                                    <div className="hot-tag hot-tag1">
                                        Hot <NextImage src={HotIcon} alt="" />
                                    </div>
                                    <div className="icon_name_row">
                                        <div className="pair_icon"><NextImage src={ATOM} alt="" /></div>
                                        <div className="name">Atom-A</div>
                                    </div>
                                    <div className="emossion_apr_row">
                                        <div className="emission_container">
                                            <div className="emission_title">Weekly Emission</div>
                                            <div className="emission_value">2,134,545 <span>HARBOR</span></div>
                                        </div>
                                        <div className="apr_container">
                                            <div className="apr_title">APR</div>
                                            <div className="apr_value">23.13%</div>
                                        </div>
                                    </div>
                                    <div className="contenet_container">
                                        <div className="content_title">Min. Collareralization ratio</div>
                                        <div className="content_value">140.00%</div>
                                    </div>
                                    <div className="contenet_container">
                                        <div className="content_title">Stability Fee</div>
                                        <div className="content_value">1.00%</div>
                                    </div>
                                    <div className="contenet_container">
                                        <div className="content_title">Total CMST Minted</div>
                                        <div className="content_value">1,052,528.93 CMST</div>
                                    </div>
                                </div>

                                <div className="vault_container">
                                    <div className="hot-tag hot-tag1">
                                        Hot <NextImage src={HotIcon} alt="" />
                                    </div>
                                    <div className="icon_name_row">
                                        <div className="pair_icon"><NextImage src={ATOM} alt="" /></div>
                                        <div className="name">Atom-A</div>
                                    </div>
                                    <div className="emossion_apr_row">
                                        <div className="emission_container">
                                            <div className="emission_title">Weekly Emission</div>
                                            <div className="emission_value">2,134,545 <span>HARBOR</span></div>
                                        </div>
                                        <div className="apr_container">
                                            <div className="apr_title">APR</div>
                                            <div className="apr_value">23.13%</div>
                                        </div>
                                    </div>
                                    <div className="contenet_container">
                                        <div className="content_title">Min. Collareralization ratio</div>
                                        <div className="content_value">140.00%</div>
                                    </div>
                                    <div className="contenet_container">
                                        <div className="content_title">Stability Fee</div>
                                        <div className="content_value">1.00%</div>
                                    </div>
                                    <div className="contenet_container">
                                        <div className="content_title">Total CMST Minted</div>
                                        <div className="content_value">1,052,528.93 CMST</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pagination  */}
                    <div className="pagination_container">
                        <Pagination
                            showSizeChanger
                            onShowSizeChange={onShowSizeChange}
                            defaultCurrent={3}
                            total={500}
                        />
                    </div>

                </div>
            </div>
        </>
    )
}

export default Mint