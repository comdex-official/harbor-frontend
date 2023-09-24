import { Button, Input, message } from 'antd'
import { DirectSecp256k1HdWallet, coins } from 'cosmwasm';
import React, { useState } from 'react'
const bip39 = require('bip39');
import { SigningCosmWasmClient, Secp256k1HdWallet } from 'cosmwasm';
import { comdex } from '../../../config/network';
import { KeplrWallet, signAndBroadcastTransaction } from '../../../services/helper';
import { getAmount } from '../../../utils/coin';
// import { MsgGrantAuthorization } from "cosmwasm-sdk/types/codec/cosmwasm/authorization/v1beta1/tx";
// import { SigningCosmWasmClient, Secp256k1HdWallet, MsgGrantAuthorization } from "cosmjs/cosmwasm";
// import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
// import { SigningCosmWasmClient, Secp256k1Pen, Registry } from "@cosmjs/cosmwasm";
// import { MsgGrant } from '@cosmjs/cosmos/authz/v1beta1/tx';
import { MsgGrant, Authorization } from "cosmjs-types/cosmos/authz/v1beta1/tx";
import { DEFAULT_FEE } from '../../../constants/common';
import { GenericAuthorization } from 'cosmjs-types/cosmos/authz/v1beta1/authz';
import { Timestamp } from 'cosmjs-types/google/protobuf/timestamp';
import moment from 'moment';


const TestOneClick = () => {
    const [newAddress, setNewAddress] = useState()


    // Generate Seeds And Address 

    const generateMemonicAndAddress = async () => {
        const oldOneClickAddress = localStorage.getItem("oneClickAddress");
        if (oldOneClickAddress) {
            setNewAddress(oldOneClickAddress)
        } else {
            const mnemonic = bip39.generateMnemonic();
            const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
                mnemonic,
                { prefix: "comdex" }
            );
            console.log(wallet);
            const account = await wallet.getAccounts();
            localStorage.setItem("oneClickAddress", account?.[0]?.address)
            setNewAddress(account?.[0]?.address)
        }

    }

    // Approve transaction 
    const handleGrant = async () => {
        // const customFees = {
        //     exec: {
        //         amount: [{ amount: "500000", denom: "ucmdx" }],
        //         gas: "500000"
        //     }
        // }
        // try {

        // const wallet = {
        //     privateKey: "bullet energy shrimp flash fiction clever spin chase grunt actor pottery wing",
        //     address: 'comdex1e4esfey4hgwyxvzqxkwx9txnz0pquge6wjdhs7',
        // };
        // const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
        //     "bullet energy shrimp flash fiction clever spin chase grunt actor pottery wing",
        //     { prefix: "comdex" }
        // );

        // const account = await wallet.getAccounts();

        // const offline = await SigningCosmWasmClient.offline(wallet);


        // const client = new SigningCosmWasmClient(comdex?.rpc, wallet, wallet.address);

        // const msg = {
        //     type: "comdex/MsgGrantAuthorization",
        //     value: {
        //         // grantee: wallet?.address,
        //         grantee: account?.[0]?.address,
        //         authorization_type: "generic",
        //         granter: "comdex19u289gsgkm7y27j8ze50je6j9cykqm7ty3xzgc",
        //     },
        // };

        // const response = await client.signAndBroadcast(msg);

        // console.log(response, "Approve response");

        // *example 2

        // const mnemonic = "bullet energy shrimp flash fiction clever spin chase grunt actor pottery wing";

        // // Create a wallet using the mnemonic and specifying the prefix
        // const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: "comdex" });

        // // Specify the RPC URL for the Comdex blockchain
        // const comdexRpc = comdex?.rpc;

        // // Create a CosmWasm client using the specified RPC and wallet
        // const client = await SigningCosmWasmClient.connectWithSigner(comdexRpc, wallet, { prefix: "comdex" });

        // // Derive the key to get the wallet's address
        // const [{ address }] = await wallet.getAccounts();

        // // Construct the message for the authz grant transaction
        // const msg = {
        //     // type: "comdex/MsgGrantAuthorization",
        //     typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
        //     value: {
        //         grantee: address, // Grant authorization to the same address (you can change this if needed)
        //         authorization_type: "generic",
        //         granter: "comdex19u289gsgkm7y27j8ze50je6j9cykqm7ty3xzgc", // Replace with the actual granter address
        //     },
        // };

        // // Sign and broadcast the transaction
        // const response = await client.signAndBroadcast(address, [msg]);

        // console.log("Authorization granted. Transaction response:", response);

        // Example 3

        // Define your CosmWasm endpoint and other configuration options
        // const endpoint = comdex?.rpc;
        // const mnemonic = "bullet energy shrimp flash fiction clever spin chase grunt actor pottery wing";

        // // Create a wallet from the mnemonic
        // const wallet = await Secp256k1HdWallet.fromMnemonic(mnemonic);

        // // Create a CosmJS signing client
        // const client = new SigningCosmWasmClient(endpoint, wallet);

        // Example 4

        // const httpUrl = comdex?.rpc;
        // let walletAddress = "comdex19u289gsgkm7y27j8ze50je6j9cykqm7ty3xzgc";
        // const handleMsg = {
        //     grantee: "comdex19u289gsgkm7y27j8ze50je6j9cykqm7ty3xzgc", // Grant authorization to the same address (you can change this if needed)
        //     authorization_type: "generic",
        //     granter: "comdex1e4esfey4hgwyxvzqxkwx9txnz0pquge6wjdhs7", // Replace with the actual granter address
        // };

        // const fundsValues = [
        //     {
        //         "denom": "uharbor",
        //         "amount": getAmount(amount)
        //     }
        // ]


        // const [offlineSigner] = await KeplrWallet(comdex?.chainId);

        // await SigningCosmWasmClient.connectWithSigner(
        //     httpUrl,
        //     offlineSigner)
        //     .then((client) => {
        //         client.signAndBroadcast(
        //             walletAddress,
        //             [{
        //                 typeUrl: "/cosmwasm.wasm.v1.MsgGrantAuthorization",
        //                 value: {
        //                     grantee: "comdex19u289gsgkm7y27j8ze50je6j9cykqm7ty3xzgc", // Grant authorization to the same address (you can change this if needed)
        //                     authorization_type: "generic",
        //                     granter: "comdex1e4esfey4hgwyxvzqxkwx9txnz0pquge6wjdhs7",
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

        // Example 5
        //     const mnemonic = "bullet energy shrimp flash fiction clever spin chase grunt actor pottery wing";

        //     // Create a wallet using the mnemonic and specifying the prefix
        //     const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: "comdex" });

        //     // Specify the RPC URL for the Comdex blockchain
        //     const comdexRpc = comdex?.rpc;

        //     // Create a CosmWasm client using the specified RPC and wallet
        //     // const registry = new Registry();
        //     // register("/cosmwasm.wasm.v1.MsgGrantAuthorization", "com.example.MsgGrantAuthorization");
        //     // register("/cosmwasm.wasm.v1.MsgGrantAuthorization");
        //     const [offlineSigner] = await KeplrWallet(comdex?.chainId);
        //     // const client = await SigningCosmWasmClient.connectWithSigner(comdexRpc, offlineSigner);

        //     // Derive the key to get the wallet's address
        //     const [{ address }] = await wallet.getAccounts();

        //     const msg = {
        //         typeUrl: "/cosmwasm.wasm.v1.MsgGrantAuthorization", // Use the correct type URL
        //         // typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract", // Use the correct type URL
        //         value: {
        //             grantee: address, // Grant authorization to the same address (you can change this if needed)
        //             authorization_type: "generic",
        //             granter: "comdex19u289gsgkm7y27j8ze50je6j9cykqm7ty3xzgc", // Replace with the actual granter address
        //             // ...other parameters
        //         },
        //     };

        //     // Sign and broadcast the transaction
        //     // const response = await client.signAndBroadcast(address, [msg]);

        //     await SigningCosmWasmClient.connectWithSigner(
        //         comdexRpc,
        //         offlineSigner)
        //         .then((client) => {
        //             client.signAndBroadcast(
        //                 "comdex19u289gsgkm7y27j8ze50je6j9cykqm7ty3xzgc",
        //                 [msg],
        //                 customFees.exec,
        //             ).then((response) => {


        //             }).catch((err) => {
        //                 console.log(err);
        //             })
        //         })

        //     // console.log("Authorization granted. Transaction response:", response);


        // } catch (error) {
        //     console.error("Error:", error);
        //     // setResult("Error: " + error.toString());
        // }

        // Example -6

        const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
            "bullet energy shrimp flash fiction clever spin chase grunt actor pottery wing",
            { prefix: "comdex" }
        );

        const account = await wallet.getAccounts();

        const offline = await SigningCosmWasmClient.offline(wallet);


        // const fee = {
        //     amount: coins(2000, "ucmdx"),
        //     gas: "200000",
        // };
        // const memo = "Test Tx";

        // const cosmJS = await SigningCosmWasmClient.connect(
        //     comdex?.rpc,
        // );

        // const { accountNumber, sequence } = await cosmJS.getSequence(account[0].address);
        // const clientChain = await cosmJS.getChainId();

        // // // Sign a message
        // // const signed = await offline?.sign(account[0].address, [msg], fee, memo, {
        // const signed = await offline?.signAndBroadcast(account[0].address, [msg], fee, memo, {
        //     accountNumber,
        //     sequence: Number(sequence),
        //     chainId: clientChain,
        // });

        // console.log(signed, "signed Message");
        const grant = {
            grantee: 'comdex19u289gsgkm7y27j8ze50je6j9cykqm7ty3xzgc', // Replace with the actual grantee's address
            grant: {
                authorizationType: 'AUTHORIZATION_TYPE', // Replace with the actual authorization type
            } // This is where you can provide the specific grant details
        };

        // grant: { authorizationType: "generic" },
        // grant: grant,

        const msg = {
            typeUrl: "/cosmos.authz.v1beta1.MsgGrant",
            // typeUrl: '/cosmos.authz.v1beta1.Authorization',
            value: MsgGrant.fromPartial({
                grantee: "comdex1e4esfey4hgwyxvzqxkwx9txnz0pquge6wjdhs7", // Grant authorization to the same address (you can change this if needed)
                // grant: {
                //     authorization: {
                //         // typeUrl: '/cosmos.authz.v1beta1.Authorization',
                //         // typeUrl: '/comdex.MsgGrantAuthorization',
                //         // typeUrl: '/cosmos.authz.v1beta1.Authorization',
                //         // typeUrl: '/cosmos.authz.v1beta1.Authorization',
                //         // typeUrl: "/cosmos.bank.v1beta1.SendAuthorization",
                //         typeUrl: "/cosmos.bank.v1beta1.MsgSendAuthorization",
                //         value: "generic",
                //     }
                // },


                grant:
                {
                    authorization: {
                        typeUrl: "/cosmos.bank.v1beta1.SendAuthorization",
                        // typeUrl: "/cosmos.authz.v1beta1.Authorization",
                        // typeUrl: '/cosmos.authz.v1beta1.GenericAuthorization',
                        // typeUrl: '/cosmos.authz.v1beta1.Authorization',
                        // typeUrl: '/cosmos.authz.v1beta1.Grant',
                        // spendLimit: [
                        //     {
                        //         denom: "ucmdx",
                        //         amount: String(10000000000),
                        //     },
                        // ],
                        // value: {
                        //     generic: {
                        //         spendLimit: '10000000000ucmdx', // Specify the spend limit as per the required format (e.g., 1000uatom)
                        //     },
                        // },
                        value: "generic",
                        // spendLimit: '10000000000uharbor'
                        expiration: "2025-01-01T00:00:00Z"
                    },
                },



                // grant: {
                //     authorization: {
                //         typeUrl: "/cosmos.authz.v1beta1.Grant",
                //         value: "generic",
                //     },
                //     authorization_type: '2', // Specify the desired authorization type
                // },
                granter: "comdex19u289gsgkm7y27j8ze50je6j9cykqm7ty3xzgc",
            }),
        };

        console.log(msg, "msg");

        // const msg = {
        //     typeUrl: "/cosmos.authz.v1beta1.MsgGrant",
        //     value: {
        //         grantee: "comdex1e4esfey4hgwyxvzqxkwx9txnz0pquge6wjdhs7",
        //         granter: "comdex19u289gsgkm7y27j8ze50je6j9cykqm7ty3xzgc",
        //         authorization: "generic",
        //         msgType: {
        //             typeUrl: "/cosmos.gov.v1beta1.MsgVote",
        //         }

        //     }
        // }

        const msgGrant = {
            typeUrl: "/cosmos.authz.v1beta1.MsgGrant",
            value: MsgGrant.fromPartial({
                granter: 'comdex19u289gsgkm7y27j8ze50je6j9cykqm7ty3xzgc',
                grantee: "comdex1e4esfey4hgwyxvzqxkwx9txnz0pquge6wjdhs7",
                authorization: {
                    send: {
                        spendLimit: [
                            {
                                denom: 'ucmdx', // Replace with the token denomination you want to allow
                                amount: '100000000', // Replace with the maximum amount allowed for the specified denomination
                            },
                        ],
                    },
                },
            })
        }

        signAndBroadcastTransaction(
            {
                // message: msg,
                message: msgGrant,
                fee: {
                    amount: [{ denom: "ucmdx", amount: DEFAULT_FEE.toString() }],
                    gas: "2500000",
                },
            },
            "comdex19u289gsgkm7y27j8ze50je6j9cykqm7ty3xzgc",
            (error, result) => {
                if (error) {
                    message.error(error)
                    return;
                }
                if (result && !result?.code) {
                    console.log(result, "result");
                    message.success(
                        "Transaction success"
                    )
                } else {
                    message.error(result?.rawLog || "Transaction failed")
                    console.log(result?.rawLog);
                }

            }
        );


    };


    const handleApproveTx = (
        client,
        granter,
        grantee,
        msg,
    ) => {
        const secondsInOneYear = 31536000;
        const message = {
            typeUrl: '/cosmos.authz.v1beta1.MsgGrant',
            value: {
                granter,
                grantee,
                grant: {
                    authorization: {
                        typeUrl: '/cosmos.authz.v1beta1.GenericAuthorization',
                        value: GenericAuthorization.encode(GenericAuthorization.fromPartial({ msg })).finish(),
                    },
                    expiration: Timestamp.fromPartial({
                        // seconds: dayjs().toDate().getTime() / 1000 + secondsInOneYear,
                        seconds: moment().add(secondsInOneYear, 'seconds').unix(),
                        nanos: 0,
                    }),
                },
            },
        };
        const fee = {
            amount: [{ amount: "500000", denom: "ucmdx" }],
            gas: "500000",
        };

        return client.signAndBroadcast(granter, [message], fee, 'creating authz grant for staking to BOW');
    }


    const handleApproveTxClick = async () => {
        const [offlineSigner] = await KeplrWallet(comdex?.chainId);
        console.log(offlineSigner, "offlineSigner");
        const client = await SigningCosmWasmClient.connectWithSigner(
            comdex?.rpc,
            offlineSigner
        )

        const data = await handleApproveTx(
            client,
            'comdex19u289gsgkm7y27j8ze50je6j9cykqm7ty3xzgc',
            "comdex1e4esfey4hgwyxvzqxkwx9txnz0pquge6wjdhs7",
            '/cosmwasm.wasm.v1.MsgExecuteContract',
        )
        console.log(data, "data");
    }


    return (
        <>
            <div className="onclick_main_container">
                <h1>One Click Transaction</h1>
                <div className="d-flex">
                    <h2>Generated Address - </h2> <span>{newAddress}</span>
                </div>
                <div>
                    <Button className='mr-3' onClick={generateMemonicAndAddress}>Generate Address</Button>
                    {/* <Button className='mr-3' onClick={handleGrant}>Approve</Button> */}
                    <Button className='mr-3' onClick={handleApproveTxClick}>Approve</Button>
                    <Button>Auth Transaction</Button>
                </div>
                <div className='mt-3'>
                    <Input></Input>
                    <Button className='mt-3'>Txansaction</Button>
                </div>
            </div>
        </>
    )
}

export default TestOneClick