import React from 'react'
import { NextImage } from '../../components/image/NextImage'
import { ATOM } from '../../components/image'
import '../../styles/containers/Mint/mint.module.scss'

const Mint = () => {
    return (
        <>
            <div className="mint_main_container">
                <div className="mint_container">
                    <div className="mint_carousel_main_container">
                        <div className="mint_carousel_container">
                            <div className="button_main_container">
                                <div className="button_content">
                                    <div className="icon_container"><NextImage src={ATOM} /></div>
                                    <div className="text_container">ATOM</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Mint