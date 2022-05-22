import Auctions from "./containers/Auctions";
import Dashboard from "./containers/Dashboard";
import Earn from "./containers/Earn";
import BorrowTab from "./containers/Mint";
import Vault from "./containers/Mint/Vault";
import MyPositions from "./containers/MyPosition";
// import MyPositions from "./containers/MyHome";
import Assets from "./containers/Assets";
import More from './containers/More'
import Govern from './containers/More/Govern'
import GovernDetails from './containers/More/Govern/Details'
import Airdrop from "./containers/More/Airdrop";
// import Balances from "./containers/MyPositions";

const routes = [
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/myPositions",
    element: <MyPositions />,
  },
  {
    path: "/assets",
    element: <Assets />,
  },
  {
    path: "/mint",
    element: <BorrowTab />,
  },
  {
    path: "/vault",
    element: <Vault />,
  },
  {
    path: "/earn",
    element: <Earn />,
  },
  {
    path: "/auctions",
    element: <Auctions />,
  },
  {
    path: "/more",
    element: <More />,
  },
  {
    path: "/govern",
    element: <Govern />,
  },
  {
    path: "/govern-details",
    element: <GovernDetails />,
  },
  {
    path: "/airdrop",
    element: <Airdrop />,
  },
];

export default routes;
