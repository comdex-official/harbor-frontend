// import { SigningCosmWasmClient } from "cosmwasm";
import { decode } from "js-base64";
import { comdex } from '../config/network'
import { getAmount } from "../utils/coin";
import { lockingContractAddress } from "./keplr";
import { KeplrWallet } from "./helper";

import { coins, DirectSecp256k1HdWallet, SigningCosmWasmClient } from "cosmwasm";
import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx";

import { SigningStargateClient } from '@cosmjs/stargate';
// import { MsgExecuteContract } from 'cosmjs-types/cosmwasm/wasm/v1beta1/tx';
import { MsgExecuteContract } from "cosmjs-types/cosmwasm/wasm/v1/tx";
// import { SigningStargateClient } from "@cosmjs/stargate";

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

export const transactionForCreateVestingOld = async (address, productId, lockingPeriod, amount, callback) => {

    const httpUrl = comdex?.rpc;
    let walletAddress = address;
    const handleMsg = {
        "lock":
        {
            "app_id": productId,
            "locking_period": lockingPeriod,

        }
    };

    const fundsValues = [
        {
            "denom": "uharbor",
            "amount": getAmount(amount)
        }
    ]


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
                        contract: lockingContractAddress,
                        msg: new TextEncoder().encode(JSON.stringify(handleMsg)),
                        funds: fundsValues
                    }
                }],
                customFees.exec,
            ).then((response) => {
                if (!response?.code) {
                    callback(null, response)

                }
                else {
                    console.log(response?.rawLog);
                    callback(response)

                }

            }).catch((err) => {
                console.log(err);
                callback(err)
            })
        }).catch((error) => {
            callback(error)
        });

}
export const transactionForCreateVesting = async (address, productId, lockingPeriod, amount, callback) => {



    const handleMsg = {
        "lock":
        {
            "app_id": productId,
            "locking_period": lockingPeriod,

        }
    };

    const fundsValues = [
        {
            "denom": "uharbor",
            "amount": getAmount(amount)
        }
    ]

    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
        // "enroll giraffe battle jump okay window boat wire sauce replace science cause",
        "still duck bike powder merry gallery bomb marine sport cart crane jazz",
        { prefix: "comdex" }
    );

    const client = await SigningCosmWasmClient.connect(
        comdex?.rpc,
    );

    const offline = await SigningCosmWasmClient.offline(wallet);

    const account = await wallet.getAccounts();

    const httpUrl = comdex?.rpc;
    // let walletAddress = address;
    let walletAddress = account[0].address;

    const msg = {
        typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
        value: MsgExecuteContract.fromPartial({
            sender: walletAddress,
            contract: lockingContractAddress,
            msg: new TextEncoder().encode(JSON.stringify(handleMsg)),
            // msg: handleMsg,
            funds: fundsValues
        })

    }

    const fee = {
        amount: [{ amount: "500000", denom: "ucmdx" }],
        gas: "500000",
    };

    const memo = "Test Tx";

    const cosmJS = await SigningCosmWasmClient.connect(
        comdex?.rpc,
    );

    const { accountNumber, sequence } = await cosmJS.getSequence(account[0].address);
    const clientChain = await cosmJS.getChainId();

    const signed = await offline?.sign(account[0].address, [msg], fee, memo, {
        accountNumber,
        sequence: Number(sequence),
        chainId: clientChain,
    });

    console.log(signed, "signed Message");

    // Broadcast the transaction the transaction, note it must be encode as raw protobuf transaction
    client
        .broadcastTx(Uint8Array.from(TxRaw.encode(signed).finish()))
        .then((res) => {
            console.log(res, "tx res");
            if (!res?.code) {
                callback(null, res)
            }
            else {
                console.log(res?.rawLog);
                callback(res)
            }
        }).catch((error) => {
            console.log(error, "Error");
            callback(error)
        })







    // Create a Stargate client
    // const client = await SigningStargateClient.connectWithSigner(comdex?.rpc, wallet);

    // // Construct the message to execute a contract (replace with the actual message for your contract)
    // const msgExecute = MsgExecuteContract.fromPartial({
    //     sender: walletAddress,
    //     contract: lockingContractAddress,
    //     msg: new TextEncoder().encode(JSON.stringify(handleMsg)),
    //     // msg: handleMsg,
    //     funds: fundsValues
    // });

    // // Sign and broadcast the transaction
    // const response = await client.broadcastTx(address, [msgExecute]);

    // console.log('Transaction broadcasted:', response);


    // const [offlineSigner] = await KeplrWallet(comdex?.chainId);

    // await SigningCosmWasmClient.connectWithSigner(
    //     httpUrl,
    //     offlineSigner)
    //     .then((client) => {
    //         // client.signAndBroadcast(
    //         client.sign(
    //             walletAddress,
    //             [{
    //                 typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
    //                 value: {
    //                     sender: walletAddress,
    //                     contract: lockingContractAddress,
    //                     msg: new TextEncoder().encode(JSON.stringify(handleMsg)),
    //                     funds: fundsValues
    //                 }
    //             }],
    //             customFees.exec,
    //         ).then((response) => {
    //             if (!response?.code) {
    //                 callback(null, response)

    //             }
    //             else {
    //                 console.log(response?.rawLog);
    //                 callback(response)

    //             }

    //         }).catch((err) => {
    //             console.log(err);
    //             callback(err)
    //         })
    //     }).catch((error) => {
    //         callback(error)
    //     });

}


export const transactionForClaimLockedHarbor = async (address, callback) => {

    const httpUrl = comdex?.rpc;
    let walletAddress = address;
    const handleMsg = {
        "withdraw":
        {
            "denom": "uharbor",
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
                        contract: lockingContractAddress,
                        msg: new TextEncoder().encode(JSON.stringify(handleMsg)),
                        funds: []
                    }
                }],
                customFees.exec,
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
            callback(error)
        });

}