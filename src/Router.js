import { Route, Routes } from "react-router-dom";
import React from "react";
import routes from "./routes";
import Dashboard from "./containers/Dashboard";
import Airdrop from "./containers/More/Airdrop";

const Router = () => {
  return (
    <div className="content scroll_bar">
      <Routes>
        {routes.map((route) => (
          <Route
            key={route.path}
            exact
            element={route.element}
            path={route.path}
          />
        ))}
        {/* <Route exact element={<Dashboard />} path="*" /> */}
        <Route exact element={<Airdrop />} path="*" />
      </Routes>
    </div>
  );
};

export default Router;
