import "../../styles/containers/NavigationBar/NavigationBar.module.scss";
import ConnectButton from "./ConnectButton";
import React, { useState, useEffect } from "react";
import ThemeToggle from "../../components/Theme/themeToggle";
import { Button } from "antd";
import { Select, Space } from 'antd';
import { NextImage } from '../../components/image/NextImage';
import ButterflyIcon from '../../public/images/butterfly_switch.svg'
import HarborLightIcon from '../../public/images/harbor_light_logo.svg'

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
        <div className="icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bell-fill" viewBox="0 0 16 16">
            <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zm.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z" />
          </svg>
        </div>
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
            dropdownClassName="app_switch_dropdown "
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
