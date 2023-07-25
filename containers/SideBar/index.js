import * as PropTypes from "prop-types";
import "../../styles/containers/SideBar/SideBar.module.scss";
import { Layout } from "antd";
import { SvgIcon } from "../../components/common";
import { useMediaQuery } from "react-responsive";
import Footer from "../Footer";
import React, { useState } from "react";
import Tabs from "./Tabs";
import { Scrollbars } from "react-custom-scrollbars";
import { connect } from "react-redux";
// import { useNavigate } from "react-router";
import { useRouter } from "next/router";
import { Icon } from "@/components/image/Icon";
import { tabsList } from "./TabsList";
import { denomConversion } from "@/utils/coin";
import { Modal } from 'antd';
import { Select } from 'antd';
import { NextImage } from "../../components/image/NextImage";
import { ATOM } from "../../components/image";

const { Sider } = Layout;

const SideBar = ({ lang, isDarkMode }) => {

  const isMobile = useMediaQuery({ query: "(max-width: 991px)" });
  const navigate = useRouter();
  let route = useRouter().pathname;
  route = route === "/" ? "/" : route?.split("/")[1];
  const Option = Select.Option;

  const [isOpen, setIsOpen] = useState(!!isMobile);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
    if (isOpen && isMobile) {
      document.body.classList.add("sidebar-open");
    } else {
      document.body.classList.remove("sidebar-open");
    }
  };

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
    handleOk()
    navigate.push('/mint')

  };

  console.log(isMobile, "isMobile");
  return (
    <>
      {!isMobile ?

        <div className="web_sidebar_main_container">
          <div className="web_sidebar_container">
            <div
              className="logo"
              onClick={() =>
                navigate.push("/")
              }
            >
              <img src='/images/logo.svg' alt="logo" />
            </div>
            <div className="links_main_container">
              <ul>
                {tabsList?.map((item) => {
                  return (
                    <li className={
                      item.path === "dashboard" && route === '/'
                        ? "active"
                        : item.active === route
                          ? "active"
                          : ""
                    }>
                      <div className="links"
                        onClick={() => {
                          if (item?.path === "mint") {
                            return showModal()
                          }
                          navigate.push("/" + item.path)
                          // onClick();
                        }}
                      >
                        <SvgIcon name={item.value} />
                        {item?.name}
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
            <div className="social_icons_main_container">
              {/* <SvgIcon name="home" />
            <SvgIcon name="home" />
            <SvgIcon name="home" />
            <SvgIcon name="home" /> */}
              <Footer />
            </div>
          </div>
        </div>
        :

        <div>
          <Layout
            className={isOpen ? "sidebar-wrapper" : "sidebar-open sidebar-wrapper"}
          >
            <button
              className="sidebar-toggle"
              title="sidebar-toggle"
              onClick={toggle}
            >
              {isMobile ? (
                <SvgIcon
                  className={isOpen ? "open" : ""}
                  name={isOpen ? "sidebar-menu" : "sidebar-close"}
                />
              ) : (
                <SvgIcon
                  className={isOpen ? "open" : ""}
                  name={isOpen ? "sidebar-open" : "sidebar-close"}
                />
              )}
            </button>

            <Sider
              collapsible
              breakpoint="lg"
              collapsed={isOpen}
              collapsedWidth="0"
              trigger={null}
            >
              <div className="side_bar">
                <div
                  className="logo"
                  onClick={() =>
                    navigate.push("/")
                  }
                >
                  <img src='/images/logo.svg' alt="logo" />
                </div>
                <Scrollbars autoHide={true} className="menuScroll" style={{ maxHeight: '100%' }}>
                  <div className="side_bar_inner">
                    <Tabs onClick={toggle} />
                  </div>
                </Scrollbars>
                <Footer />
              </div>
            </Sider>

          </Layout>
          <div onClick={toggle}>
            {isMobile && !isOpen && <div className="sidebar-overlay" />}
          </div>
        </div>

      }

      {/* {!isMobile && ( */}
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

                  <Select
                    // className="assets-select"
                    popupClassName="asset-select-dropdown mint-select-dropdown"
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
                        Asset
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
                            <NextImage src={ATOM} height={35} width={35} alt="logo" />
                          </div>
                        </div>
                        <div className="name">{denomConversion("uatom")}</div>
                      </div>
                    </Option>
                    <Option key={2} value={2}>
                      <div className="select-inner">
                        <div className="svg-icon">
                          <div className="svg-icon-inner">
                            {/* <SvgIcon name={iconNameFromDenom("uatom")} /> */}
                            <NextImage src={ATOM} height={35} width={35} alt="logo" />
                          </div>
                        </div>
                        <div className="name">{denomConversion("ucmst")}</div>
                      </div>
                    </Option>
                    {/* ); */}
                    {/* })} */}
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </>

      </Modal>
      {/* )} */}

    </>
  );
};
SideBar.propTypes = {
  isDarkMode: PropTypes.bool.isRequired,

  // lang: PropTypes.string.isRequired,
};
const stateToProps = (state) => {
  return {
    // lang: state.language,
    isDarkMode: state.theme.theme.darkThemeEnabled,
  };
};

const actionsToProps = {};

export default connect(stateToProps, actionsToProps)(SideBar);
