import { combineReducers } from "redux";
import { SET_USER_ELIGIBILITY_DATA } from "../constants/airdrop";

const userEligibilityData = (state = {}, action) => {
    if (action.type === SET_USER_ELIGIBILITY_DATA) {
        return action.value
    }

    return state;
};

export default combineReducers({
    userEligibilityData,
});