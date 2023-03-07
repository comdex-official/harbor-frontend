import Auctions from "./containers/Auctions";
import Dashboard from "./containers/Dashboard";
import Earn from "./containers/Earn";
import BorrowTab from "./containers/Mint";
import Vault from "./containers/Mint/Vault";
import StableMint from "./containers/StableMint/stablemint";
import MyPositions from "./containers/MyPosition";
import Assets from "./containers/Assets";
import More from './containers/More'
import Govern from './containers/More/Govern'
import GovernDetails from './containers/More/Govern/Details'
import Airdrop from "./containers/More/Airdrop";
import CompleteMission from './containers/More/Airdrop/CompleteMission';
import Vesting from "./containers/More/Locker";
import Vote from "./containers/More/Vote";
import StableMintVault from "./containers/StableMint/vault";

const routes = [
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/my-positions",
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
    path: "mint/vault/:pathVaultId",
    element: <Vault />,
  },
  {
    path: "/stableMint",
    element: <StableMint />,
  },
  {
    path: "/stableMint/:pathVaultId",
    element: <StableMintVault />,
  },
  {
    path: "/more/earn",
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
    path: "/govern/govern-details/:proposalId",
    element: <GovernDetails />,
  },
  {
    path: "/more/vesting",
    element: <Vesting />,
  },
  {
    path: "/more/vote",
    element: <Vote />,
  },
  // {
  //   path: "/more/airdrop",
  //   element: <Airdrop />,
  // },
  // {
  //   path: "/more/airdrop/complete-mission/:chainId",
  //   element: <CompleteMission />,
  // },
];

export default routes;
