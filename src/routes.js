import Auctions from "./containers/Auctions";
import Borrow from "./containers/Borrow";
import Dashboard from "./containers/Dashboard";
import Earn from "./containers/Earn";
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
    path: "/borrow",
    element: <Borrow />,
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
