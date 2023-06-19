import React from "react";
import { List } from "antd";
import { SvgIcon } from "@/components/common";

const PersonalTab = () => {
  const data = [
    {
      assetName: 'atom-icon',
      title: 'AXL-USDC ',
      description: 'New vault added.',
      time: '1m ago'
    },
    {
      assetName: 'osmosis-icon',
      title: 'OSMO ',
      description: 'New vault added.',
      time: '12m ago'
    },
    {
      assetName: 'juno-icon',
      title: 'JUNO ',
      description: 'New vault added.',
      time: '1h ago'
    }
  ];
  const data2 = [
    {
      assetName: 'atom-icon',
      title: 'ATOM-A',
      description: 'Your Vault will liquidate.',
      time: '16h ago'
    }
  ];
  return (
    <>
      <div className="tabs-data">
        <div className="heading-title">Today</div>
        <List
          itemLayout="horizontal"
          dataSource={data}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={<SvgIcon name={item.assetName} />}
                title={item.title}
                description={item.description}
              />
              <div className="right-time">{item.time}</div>
            </List.Item>
          )}
        />
        <div className="heading-title">Today</div>
        <List
          itemLayout="horizontal"
          dataSource={data2}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={<SvgIcon name={item.assetName} />}
                title={item.title}
                description={item.description}
              />
              <div className="right-time">{item.time}</div>
            </List.Item>
          )}
        />
      </div>
    </>
  );
};

export default PersonalTab;
