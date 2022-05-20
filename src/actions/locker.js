import { SET_ALL_WHITELISTED_ASSET, SET_WHITELISTED_ASSET } from "../constants/locker";

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