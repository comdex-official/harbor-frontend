import TooltipIcon from "../../../../../components/TooltipIcon";
import { Col, Row, SvgIcon } from "../../../../../components/common";
import variables from "../../../../../utils/variables";
import {
  iconNameFromDenom,
  showTotalAssetCount,
} from "../../../../../utils/string";
import { denomConversion } from "../../../../../utils/coin";
import { calculatePoolLiquidity } from "../../../../../utils/calculations";
import { List } from "antd";

const PricePool = ({ lang, poolBalance, markets }) => {
  const data = [
    {
      title: "Liquidation Price",
      counts: "$1,234.20",
    },
    {
      title: "Collateral Deposited",
      counts: "$1,234.20",
    },
    {
      title: "Oracle Price",
      counts: "30.45%",
    },
    {
      title: "Withdrawn",
      counts: "$30.45",
    },
  ];
  return (
    <>
      <div className="composite-card farm-content-card earn-deposite-card ">
        <div className="card-head"></div>
        <List
          grid={{
            gutter: 16,
            xs: 2,
            sm: 2,
            md: 3,
            lg: 2,
            xl: 2,
            xxl: 2,
          }}
          dataSource={data}
          renderItem={(item) => (
            <List.Item>
              <div>
                <p>{item.title}</p>
                <h3>{item.counts}</h3>
              </div>
            </List.Item>
          )}
        />
      </div>
    </>
  );
};

export default PricePool;
