import "../../styles/containers/Footer/Footer.module.scss";
import React from "react";
import { SvgIcon } from "../../components/common";
import { HOSTED_ON_TEXT } from "../../constants/common";

const Footer = () => {


  return (
    <div className="footer">
      {HOSTED_ON_TEXT ? (
        <div className="footer-text">{HOSTED_ON_TEXT}</div>
      ) : null}
      <div className="social-icons">
        <a
          aria-label="Discord"
          target="_blank"
          rel="noreferrer"
          href="https://bit.ly/ComdexOfficialDiscord"
        >
          <SvgIcon name="discord" viewbox="0 0 29.539 22.155" />
        </a>

        <a
          aria-label="Github"
          target="_blank"
          rel="noreferrer"
          href="https://github.com/comdex-official"
        >
          <SvgIcon name="github" viewbox="0 0 25.825 20.66" />
        </a>

        <a
          aria-label="Telegram"
          target="_blank"
          rel="noreferrer"
          href="https://t.me/Composite_Money"
        >
          <SvgIcon name="telegram" viewbox="0 0 24.635 20.66" />
        </a>

        <a
          aria-label="Twitter"
          target="_blank"
          rel="noreferrer"
          href="https://twitter.com/Harbor_Protocol"
        >
          <SvgIcon name="twitter" viewbox="0 0 25.617 20.825" />
        </a>

        <a
          aria-label="Medium"
          target="_blank"
          rel="noreferrer"
          href="https://medium.com/@Harbor_Protocol"
        >
          <SvgIcon name="medium" viewbox="0 0 25.825 20.66" />
        </a>

      </div>
    </div>
  );
};

export default Footer;
