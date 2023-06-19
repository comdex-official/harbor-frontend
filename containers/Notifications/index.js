import React, { useState } from "react";
import { Drawer, Button, Tabs } from "antd";
import { SvgIcon } from "@/components/common";
import AllTabs from './AllTab';
import GeneralTab from './GeneralTab';
import PersonalTab from './PersonalTab';
import "../../styles/containers/Notifications/Notifications.module.scss";

const Notifications = () => {
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const items = [
    {
      key: '1',
      label: <>All <span className="tab-count">10</span></>,
      children: <AllTabs />,
    },
    {
      key: '2',
      label: <>General <span className="tab-count">10</span></>,
      children: <GeneralTab />,
    },
    {
      key: '3',
      label: <>Personal <span className="tab-count">2</span></>,
      children: <PersonalTab />,
    },
  ];

  return (
    <>
      <Button onClick={showDrawer}>
        <div className="red-dot"></div>
        <SvgIcon name='bell' viewbox='0 0 15.171 19.5' />
      </Button>
      <Drawer className='notification_drawer' title={null} width={420} closable={false} onClose={onClose} open={open}>
        <div className="header">
          <h3>Notifications</h3>
          <Button>Mark as read</Button>
        </div>
        <Tabs defaultActiveKey="1" items={items} />
      </Drawer>
    </>
  );
};

export default Notifications;
