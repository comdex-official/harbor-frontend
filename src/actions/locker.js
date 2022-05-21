import { SET_ALL_WHITELISTED_ASSET, SET_ISLOCKER_EXIST, SET_USER_LOCKED_VALUE, SET_WHITELISTED_ASSET } from "../constants/locker";

export const setAllWhiteListedAssets = (list) => {

    return {
        type: SET_ALL_WHITELISTED_ASSET,
        list,
    };
};
export const setWhiteListedAssets = (list) => {

    return {
        type: SET_WHITELISTED_ASSET,
        list,
    };
};
export const setIsLockerExist = (value) => {
  return {
        type: SET_ISLOCKER_EXIST,
        value,
    };
};
export const setUserLockedValue = (value) => {
  return {
      type: SET_USER_LOCKED_VALUE,
        value,
    };
};