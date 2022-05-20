import { SET_ALL_WHITELISTED_ASSET, SET_ISLOCKER_EXIST, SET_WHITELISTED_ASSET } from "../constants/locker";
import { combineReducers } from "redux";

const _ = (
    state = {
        list: [],
        inProgress: false,
    },
    action
) => {
    if (action.type === SET_ALL_WHITELISTED_ASSET) {
        return {
            ...state,
            list: action.list,
        };
    }

    return state;
};
const whiteListedAssetById = (
    state = {
        list: [],
        inProgress: false,
    },
    action
) => {
    if (action.type === SET_WHITELISTED_ASSET) {
        return {
            ...state,
            list: action.list,
        };
    }

    return state;
};
const isLockerExist = (state = "false", action) => {
    if (action.type === SET_ISLOCKER_EXIST) {
        return action.value;
    }
    return state;
};
export default combineReducers({
    _,
    whiteListedAssetById,
    isLockerExist,
});