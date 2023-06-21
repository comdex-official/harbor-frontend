import * as PropTypes from "prop-types";
import { SvgIcon } from "../../components/common";
import { connect } from "react-redux";
import { tabsList } from "./TabsList";
import React, { useState } from "react";
import variables from "../../utils/variables";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router";
import { initializeChain } from "../../services/keplr";
import { message } from "antd";
import { setAccountAddress, setAccountName } from "../../actions/account";
import { encode } from "js-base64";
import { fetchKeplrAccountName } from "../../services/keplr";
import { useRouter } from "next/router";
import { Modal, Button } from 'antd';
import { Select } from 'antd';
import { iconNameFromDenom } from "@/utils/string";
import { denomConversion } from "@/utils/coin";
import { ATOM } from "../../components/image";
import { NextImage } from "../../components/image/NextImage";

const NavTabs = ({ setAccountAddress, lang, setAccountName, onClick }) => {
  const Option = Select.Option;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useRouter();
  let route = useRouter().pathname;
  route = route === "/" ? "/" : route?.split("/")[1];


  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onChange = (value) => {
    console.log(`selected ${value}`);
  };

  const onSearch = (value) => {
    console.log('search:', value);
  };


  if (typeof window !== "undefined") {
    window.addEventListener("keplr_keystorechange", () => {
      handleConnectToWallet();
    });

    window.addEventListener("leap_keystorechange", () => {
      handleConnectToWallet();
    });
  }

  const handleConnectToWallet = () => {
    let walletType = localStorage.getItem("loginType");

    initializeChain(walletType, (error, account) => {
      if (error) {
        message.error(error);
        return;
      }

      fetchKeplrAccountName().then((name) => {
        setAccountName(name);
      });

      setAccountAddress(account.address);
      localStorage.setItem("ac", encode(account.address));
      localStorage.setItem("loginType", walletType || "keplr")
    });
  };

  const a11yProps = (index) => {
    return {
      id: `simple-tab-${index}`,
    };
  };

  return (
    <div className="vertical_tabs">
      <ul className="tabs_content">
        {tabsList.map((item) => {
          return (
            <li
              key={item.index}
              className={
                "tab " +
                (item.path === "dashboard" && route === '/'
                  ? "active_tab"
                  : item.active === route
                    ? "active_tab"
                    : "")
              }
              value={item.value}
              onClick={() => {
                console.log("clicked on link");
                if (item?.path === "mint") {
                  return showModal()
                }
                navigate.push("/" + item.path)
                onClick();
              }}
              {...a11yProps(0)}
            >
              <div className="tab-inner ">
                <SvgIcon name={item.value} />
                {item?.name}
              </div>
            </li>
          );
        })}
      </ul>

      <Modal
        centered={true}
        className="mint_outside_modal"
        footer={null}
        header={null}
        open={isModalOpen}
        width={500}
        // closable={(width < 650) ? true : null}
        onOk={handleOk}
        onCancel={handleCancel}
        closeIcon={null}
      >
        <>
          <div className="mint_modal_main_container">
            <div className="mint_modal_container">
              <div className="title">Select Collateral Asset</div>
              <div className="text">Select the asset to see vaults associated with it.</div>
              <div className="dropdown_main_container">
                <div className="dropdown_container">
                  {/* <Select
                    showSearch
                    placeholder="Asset"
                    optionFilterProp="children"
                    onChange={onChange}
                    style={{
                      width: "100%",
                      marginTop: "20px"
                    }}
                    onSearch={onSearch}
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    options={[
                      {
                        value: 'jack',
                        label:
                          <>

                          </>,
                      },
                      {
                        value: 'lucy',
                        label: 'Lucy',
                      },
                      {
                        value: 'tom',
                        label: 'Tom',
                      },
                    ]}
                  /> */}

                  <Select
                    // className="assets-select"
                    popupClassName="asset-select-dropdown"
                    // value={value}
                    style={{
                      width: "100%",
                      marginTop: "20px"
                    }}
                    placeholder={
                      <div className="select-placeholder">
                        <div className="circle-icon">
                          <div className="circle-icon-inner" />
                        </div>
                        Select
                      </div>
                    }
                    onChange={onChange}
                    defaultActiveFirstOption={true}
                    suffixIcon={<SvgIcon name="arrow-down" viewbox="0 0 19.244 10.483" />}
                  >
                    {/* {list &&
                      list.map((record) => {
                        const item = record?.denom ? record?.denom : record;

                        return ( */}
                    <Option key={1} value={1}>
                      <div className="select-inner">
                        <div className="svg-icon">
                          <div className="svg-icon-inner">
                            {/* <SvgIcon name={iconNameFromDenom("uatom")} /> */}
                            <NextImage src={ATOM} height={35} width={35} />
                          </div>
                        </div>
                        <div className="name">{denomConversion("uatom")}</div>
                      </div>
                    </Option>
                    );
                    {/* })} */}
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </>

      </Modal>

    </div>
  );
};

NavTabs.propTypes = {
  lang: PropTypes.string.isRequired,
  setAccountAddress: PropTypes.func.isRequired,
  setAccountName: PropTypes.func.isRequired,
};

const stateToProps = (state) => {
  return {
    lang: state.language,
  };
};

const actionToProps = {
  setAccountAddress,
  setAccountName,
};

export default connect(stateToProps, actionToProps)(NavTabs);
