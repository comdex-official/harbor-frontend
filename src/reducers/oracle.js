import { combineReducers } from "redux";
import { MARKET_LIST_SET } from "../constants/oracle";

const markets = [
  {
    rates: "300000",
    script_id: "112",
    symbol: "CMDX",
  },
  {
    rates: "1000000",
    script_id: "112",
    symbol: "CMST",
  },
];

const market = (
  state = {
    list: markets,
    pagination: {},
  },
  action
) => {
  if (action.type === MARKET_LIST_SET) {
    return {
      ...state,
      list: action.list,
      pagination: action.pagination,
    };
  }

  return state;
};

export default combineReducers({
  market,
});
