import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { decode } from "js-base64";
import { comdex } from '../config/network'
import { contractAddress } from "./keplr";
import { KeplrWallet } from "./helper";

const customFees = {
    upload: {
        amount: [{ amount: "2000000", denom: "ucmdx" }],
        gas: "2000000",
    },
    init: {
        amount: [{ amount: "500000", denom: "ucmdx" }],
        gas: "500000",
    },
    exec: {
        amount: [{ amount: "500000", denom: "ucmdx" }],
        gas: "300000",
    },
    send: {
        amount: [{ amount: "80000", denom: "ucmdx" }],
        gas: "80000",
    },
}

export const transactionForVote = async (address, proposalId, vote, callback) => {

    const httpUrl = comdex?.rpc;
    let walletAddress = address;
    const handleMsg = {
        "vote":
        {
            "proposal_id": proposalId,
            "vote": vote,

        }
    };

    const [offlineSigner] = await KeplrWallet(comdex?.chainId);

    await SigningCosmWasmClient.connectWithSigner(
        httpUrl,
        offlineSigner)
        .then((client) => {
            client.signAndBroadcast(
                walletAddress,
                [{
                    typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
                    value: {
                        sender: walletAddress,
                        contract: contractAddress,
                        msg: new TextEncoder().encode(JSON.stringify(handleMsg)),
                        funds: []
                    }
                }],
                customFees.exec
            ).then((response) => {
                if (!response?.code) {
                    callback(null, response)
                }
                else {
                    console.log(response);
                    callback(response)
                }

            }).catch((err) => {
                console.log(err);
                callback(err)
            })
        }).catch((error) => {
            console.log(error);
            callback(error)
        });

}