import { Button } from "antd";
import * as PropTypes from "prop-types";
import { Link } from "react-router-dom";

const Banner = ({ lang }) => {
  return (
    <div className="dashboard-banner earn-deposite-card">
      <div className="banner-left">
        <h2>
          Try out <span>STABLE MINT</span>  now! <br />
          Other features are coming soon…
        </h2>
        <Link to='/stableMint'>
          <Button type="primary " className=" btn-filled ">
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
