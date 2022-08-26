import { SET_VESTING_RADIO_VALUE } from "../constants/vesting";

export const setVestingRadioInput = (data) => {
    return {
        type: SET_VESTING_RADIO_VALUE,
        data,
    };
};