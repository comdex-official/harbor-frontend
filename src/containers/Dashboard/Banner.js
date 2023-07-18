import { Button } from "antd";
import * as PropTypes from "prop-types";
import { Link } from "react-router-dom";

const Banner = ({ lang }) => {
  return (
    <div className="dashboard-banner earn-deposite-card">
      <div className="banner-left">
        {/* <h2>
          Borrow <span>Composite</span>  by depositing <br /> your IBC assets
        </h2>
        <Link to='/mint'>
          <Button type="primary " className=" btn-filled ">
            Take me there!
          </Button>
        </Link> */}
        <h2>
          Weekly Emissions are Live!
        </h2>
        <p>
          Lock your HARBOR, Vote on Emissions and Claim your Rewards.
        </p>
        <div className="btn_container">
        <Link to='/more/vote'>
          <Button type="primary " className=" btn-filled ">
            Vote Now
          </Button>
        </Link>
        </div>
      </div>
    </div>
  );
};

Banner.propTypes = {
  lang: PropTypes.string.isRequired,
};

export default Banner;
