import { combineReducers } from "redux";
import { MARKET_LIST_SET, SET_COINGEKO_PRICE, SET_CSWAP_API_PRICE } from "../constants/oracle";

const market = (
  state = {
    map: {},
    pagination: {},
  },
  action
) => {
  if (action.type === MARKET_LIST_SET) {
    return {
      ...state,
      map: action.map,
      pagination: action.pagination,
    };
  }

  return state;
};
const coingekoPrice = (
  state = {},
  action
) => {
  if (action.type === SET_COINGEKO_PRICE) {
    return (
      action.value
    );
  }

  return state;
};

const cswapApiPrice = (
  state = [],
  action
) => {
  if (action.type === SET_CSWAP_API_PRICE) {
    return (
      action.value
    );
  }

  return state;
};

export default combineReducers({
  market,
  coingekoPrice,
  cswapApiPrice
});
