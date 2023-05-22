import { Provider } from "react-redux";
import SideBar from "../SideBar";
import NavigationBar from "../NavigationBar";

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import thunk from "redux-thunk";
import reducer from "../../reducers/index";
// import Router from "@/Router";
// import Router from "../../Router";
import Dashbard from "../Dashboard";
import SvgSprite from "../../utils/SvgSpriteLoader";
// import svgFile from "../../assets/images/svg/svg-sprite.svg";
// import reportWebVitals from "./reportWebVitals";


const store = createStore(
    reducer,
    composeWithDevTools({
        trace: true,
    })(applyMiddleware(thunk))
);

const Layout = ({ children }) => {
    return (
        <>
            <Provider store={store}>
                {/* <BrowserRouter> */}
                {/* <SvgSprite url={"/public/images/svg/svg-sprite.svg"} /> */}
                <div className="main_wrapper">
                    <SideBar />
                    <div className="main-container">
                        <NavigationBar />
                        {/* <Router />  */}
                        {/* <Dashbard /> */}
                        {children}
                    </div>
                </div>

                {/* </BrowserRouter> */}
            </Provider>
        </>
    );
};

export default Layout;
