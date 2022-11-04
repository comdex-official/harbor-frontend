import "./index.scss";
import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import ConnectButton from "./ConnectButton";
import React, { useState, useEffect } from "react";
import ThemeToggle from "../../components/Theme/themeToggle";
import { SvgIcon } from "../../components/common";
import { useNavigate } from "react-router";

const NavigationBar = ({ isDarkMode }) => {
  const [isSetOnScroll, setOnScroll] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setOnScroll(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className={isSetOnScroll ? " top_bar fixedHeaderOnScroll navbar-main-container" : "top_bar navbar-main-container"}>
        <div
          className="logo"
          onClick={() =>
            navigate({
              pathname: "/",
            })
          }
        >
          {isDarkMode ? (
            <SvgIcon name="harbor-logo" />
          ) : (
            <SvgIcon name="harbor-logo-light" />
          )}
        </div>
        {/* <nav className={isSetOnScroll ? "top_bar fixedHeaderOnScroll" : "top_bar"}> */}
        <nav className="top_bar">
          <ThemeToggle />

          <div className="connect-button">
            <ConnectButton />
          </div>
        </nav>
      </div>
    </>
  );
};


NavigationBar.propTypes = {
  isDarkMode: PropTypes.bool.isRequired,
};
const stateToProps = (state) => {
  return {
    isDarkMode: state.theme.theme.darkThemeEnabled,
  };
};

const actionsToProps = {};

export default connect(stateToProps, actionsToProps)(NavigationBar);

