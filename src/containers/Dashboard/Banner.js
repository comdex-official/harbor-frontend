import { Button } from "antd";
import * as PropTypes from "prop-types";
import { Link } from "react-router-dom";

const Banner = ({ lang }) => {
  return (
    <Link to="/more/airdrop">
      <div className="dashboard-banner earn-deposite-card">
        <div className="banner-left">
        </div>
      </div>
    </Link>
  );
};

Banner.propTypes = {
  lang: PropTypes.string.isRequired,
};

export default Banner;
