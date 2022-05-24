import { SET_USER_LOCKED_VAULT_DATA } from "../constants/mint";

export const setUserLockedVaultData = (value) => {

    return {
        type: SET_USER_LOCKED_VAULT_DATA,
        value,
    };
};