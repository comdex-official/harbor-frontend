import "./index.scss";
import React from "react";
import { SvgIcon } from "../../components/common";

const Footer = () => {
  return (
    <div className="footer">
      <div className="social-icons">
        <a
          aria-label="Discord"
          target="_blank"
          rel="noreferrer"
          href="https://discord.com/invite/7vjPvWKKMT"
        >
          <SvgIcon name="discord" viewbox="0 0 29.539 22.155" />
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
      
        <a
          aria-label="Linkedin"
          target="_blank"
          rel="noreferrer"
          href="https://www.linkedin.com/showcase/compositemoney/"
        >
          <SvgIcon name="linkedin" viewbox="0 0 25.825 20.66" />
        </a>
        <a
          aria-label="Forum"
          target="_blank"
          rel="noreferrer"
          href="https://forum.comdex.one/"
        >
          <SvgIcon name="forum" viewbox="0 0 25.825 20.66" />
        </a>
      </div>
    </div>
  );
};

export default Footer;
