import { Button } from "antd";
import * as PropTypes from "prop-types";
import variables from "../../utils/variables";

const Banner = ({ lang }) => {
  return (
    <div className="dashboard-banner earn-deposite-card">
      <div className="banner-left">
        <h2>
          Earn <span>stable income</span> on CMST <br /> at the Interest rate of{" "}
          <span>4%</span> {variables[lang].platform}{" "}
        </h2>
        <Button type="primary">
          <a
            href="https://comdex.one"
            aria-label="Website"
            rel="noreferrer"
            target="_blank"
          >
            Take me there!
          </a>
        </Button>
      </div>
    </div>
  );
};

Banner.propTypes = {
  lang: PropTypes.string.isRequired,
};

export default Banner;
