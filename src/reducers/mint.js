import { combineReducers } from "redux";
import { SET_USER_LOCKED_VAULT_DATA } from "../constants/mint";

const userLockedVaultData = (state = [], action) => {
    if (action.type === SET_USER_LOCKED_VAULT_DATA) {
        return [action.value]
    }
    return state;
};

export default combineReducers({
    userLockedVaultData,
});