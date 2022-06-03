import { SET_ALL_PROPOSAL, SET_CURRENT_PROPOSAL, SET_PROPOSAL_UP_DATA } from "../constants/govern";
import { combineReducers } from "redux";

const allProposal = (state = "", action) => {
    if (action.type === SET_ALL_PROPOSAL) {
        return action.value;
    }
    return state;
};
const currentProposal = (state = "", action) => {
    if (action.type === SET_CURRENT_PROPOSAL) {
        return action.value;
    }
    return state;
};
const proposalUpData = (state = "", action) => {
    if (action.type === SET_PROPOSAL_UP_DATA) {
        return action.value;
    }
    return state;
};

export default combineReducers({
    allProposal,
    currentProposal,
    proposalUpData,
});