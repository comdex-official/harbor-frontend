import * as PropTypes from "prop-types";
import { SvgIcon } from "../../components/common";
import { connect } from "react-redux";
import { tabsList } from "./TabsList";
import React from "react";
import variables from "../../utils/variables";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router";
import { initializeChain } from "../../services/keplr";
import { message } from "antd";
import { setAccountAddress, setAccountName } from "../../actions/account";
import { encode } from "js-base64";
import { fetchKeplrAccountName } from "../../services/keplr";
import { useRouter } from "next/router";

const NavTabs = ({ setAccountAddress, lang, setAccountName, onClick }) => {

  const navigate = useRouter();
  let route = useRouter().pathname;
  route = route === "/" ? "/" : route?.split("/")[1];




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
                // navigate("/" + item.path);
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
