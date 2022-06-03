import { CosmWasmClient } from "cosmwasm";
import { comdex } from '../config/network'
import { contractAddr } from "./keplr";

const configin = {
    chainId: comdex?.chainId,
    rpcEndpoint: comdex?.rpc,
    prefix: comdex?.prefix,
};

export const totalProposal = async (productId) => {
    const client = await CosmWasmClient.connect(configin.rpcEndpoint);
    const config = await client.queryContractSmart(contractAddr, { "list_app_proposal": { "app_id": productId } });
    return await config;
}

export const fetchAllProposalList = async () => {
    const client = await CosmWasmClient.connect(configin.rpcEndpoint);
    const config = await client.queryContractSmart(contractAddr, { "list_proposals": {} });
    return await config;
}

export const fetchSpecificProposalData = async (proposalId) => {
    const client = await CosmWasmClient.connect(configin.rpcEndpoint);
    const config = await client.queryContractSmart(contractAddr, { "proposal": { "proposal_id": proposalId } });
    return await config;
}
export const fetchProposalUpData = async (proposalId) => {
    const client = await CosmWasmClient.connect(configin.rpcEndpoint);
    const config = await client.queryContractSmart(contractAddr, { "app_all_up_data": { "app_id": proposalId } });
    return await config;
}