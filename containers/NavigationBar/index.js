import "../../styles/containers/NavigationBar/NavigationBar.module.scss";
import ConnectButton from "./ConnectButton";
import React, { useState, useEffect } from "react";
import ThemeToggle from "../../components/Theme/themeToggle";
import { Button } from "antd";
import { Select, Space } from 'antd';
import { NextImage } from '../../components/image/NextImage';
import ButterflyIcon from '../../public/images/butterfly_switch.svg'
import HarborLightIcon from '../../public/images/harbor_light_logo.svg'
import Notifications from "../Notifications";

const NavigationBar = () => {

  const [isSetOnScroll, setOnScroll] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setOnScroll(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  return (
    <nav className={isSetOnScroll ? "top_bar fixedHeaderOnScroll" : "top_bar"}>
      <div className="notification">
        <Notifications />
      </div>
      <div className="faucet">
        <Button type="secondary">
          <img src="/images/faucet-drop.svg" alt="" />  Faucet
        </Button>
      </div>
      <div className="app_switch">
        <Space wrap>
          <Select
            defaultValue={
              <>
                <div className="logo">
                  <img src="/images/butterfly_switch.svg" alt="" />

                </div>
                <div className="icon">
                  <img src="/images/harbor_light_logo.svg" alt="" />
                </div>
              </>
            }
            style={{
              width: 125,
            }}
            popupClassName="app_switch_dropdown "
            placeholder={
              <>
                <div className="logo">
                  <img src="/images/butterfly_switch.svg" alt="" />

                </div>
                <div className="icon">
                  <img src="/images/harbor_light_logo.svg" alt="" />
                </div>
              </>
            }
            onChange={handleChange}
            options={[
              {
                label: <div className="logo">
                  <img src="/images/commodo_logo.svg" alt="" />
                </div>,
              },
              {
                label: <div className="logo">
                  <img src="/images/cswap_logo.svg" alt="" />

                </div>,
              },

            ]}
          />
        </Space>
      </div>

      {/* <ThemeToggle /> */}

      <div className="connect-button">
        <ConnectButton />
      </div>
    </nav>
  );
};

export default NavigationBar;
