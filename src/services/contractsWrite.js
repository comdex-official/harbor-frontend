import { SigningCosmWasmClient } from "cosmwasm";
import { decode } from "js-base64";
import { comdex } from '../config/network'
import { KeplrWallet, contractAddress } from "./keplr";

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
        gas: "500000",
    },
    send: {
        amount: [{ amount: "80000", denom: "ucmdx" }],
        gas: "80000",
    },
}

export const transactionForVote = async (proposalId, vote, callback) => {

    const httpUrl = comdex?.rpc;
    let walletAddress = localStorage.getItem("ac");
    walletAddress=decode(walletAddress);
    const handleMsg = {
        "vote":
        {
            "proposal_id": proposalId,
            "vote": vote,

        }
    };

    const [offlineSigner, accounts] = await KeplrWallet(comdex?.chainId);

    const accountFromSigner = (await offlineSigner.getAccounts()).find(
        (account) => account.address === walletAddress,
    );

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
                        msg: new TextEncoder().encode(JSON.stringify(handleMsg))
                    }
                }],
                customFees.exec
            ).then((response) => {
                callback(null, response)

            }).catch((err) => {
                callback(err)
            })
        }).catch((error) => {
            callback(error)
        });

}