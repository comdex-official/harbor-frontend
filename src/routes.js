import Auctions from "./containers/Auctions";
import Dashboard from "./containers/Dashboard";
import Earn from "./containers/Earn";
import BorrowTab from "./containers/Mint";
import Vault from "./containers/Mint/Vault";
import MyPosition from "./containers/MyPosition";

const routes = [
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/myPositions",
    element: <MyPosition />,
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
];

export default routes;
