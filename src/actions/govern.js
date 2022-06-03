import { SET_ALL_PROPOSAL, SET_CURRENT_PROPOSAL, SET_PROPOSAL_UP_DATA } from "../constants/govern";

export const setAllProposal = (value) => {
    return {
        type: SET_ALL_PROPOSAL,
        value,
    };
};
export const setCurrentProposal = (value) => {
    return {
        type: SET_CURRENT_PROPOSAL,
        value,
    };
};
export const setProposalUpData = (value) => {
    return {
        type: SET_PROPOSAL_UP_DATA,
        value,
    };
};