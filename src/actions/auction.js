import {
  AUCTION_LIST_SET,
  BIDDING_LIST_SET,
  BID_AMOUNT_SET,
  CURRENT_AUCTION_SET,
  SET_SELECTED_AUCTIONED_ASSET,
} from "../constants/auction";

export const setAuctions = (list) => {
  return {
    type: AUCTION_LIST_SET,
    list,
  };
};

export const setBiddings = (list, pagination, bidder) => {
  return {
    type: BIDDING_LIST_SET,
    list,
    pagination,
    bidder,
  };
};

export const setCurrentAuction = (value) => {
  return {
    type: CURRENT_AUCTION_SET,
    value,
  };
};

export const setBidAmount = (value) => {
  return {
    type: BID_AMOUNT_SET,
    value,
  };
};
export const setSelectedFilterAuctionAsset = (value) => {
  return {
    type: SET_SELECTED_AUCTIONED_ASSET,
    value,
  };
};
