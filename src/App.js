import Router from "./Router";
import "./App.scss";
import NavigationBar from "./containers/NavigationBar";
import SvgSprite from "./utils/SvgSpriteLoader";
import svgFile from "./assets/images/svg/svg-sprite.svg";
import SideBar from "./containers/SideBar";
import { useEffect } from "react";
import { message } from 'antd';

message.config({
  maxCount: 2,
});

function App() {



  return (
    <>
      <SvgSprite url={svgFile} />
      <div className="main_wrapper">
        <SideBar />
        <div className="main-container">
          <NavigationBar />
          <Router />
        </div>
      </div>
    </>
  );
}

export default App;
