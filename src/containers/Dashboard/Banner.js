import { Button } from "antd";
import * as PropTypes from "prop-types";
import { Link } from "react-router-dom";
import variables from "../../utils/variables";

const Banner = ({ lang }) => {
  return (
    <div className="dashboard-banner earn-deposite-card">
      <div className="banner-left">
        <h2>
          Borrow by <span>Composite</span>  depositing<br /> your IBC enabled assets
        </h2>
        <Link to='/mint'>
          <Button type="primary">
            Take me there!
          </Button>
        </Link>
      </div>
    </div>
  );
};

Banner.propTypes = {
  lang: PropTypes.string.isRequired,
};

export default Banner;
