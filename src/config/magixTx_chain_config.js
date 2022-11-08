export const chainNetworks = {
    agoric: {
        chainId: "agoric-3",
        chainName: "Agoric",
        rpc: "https://agoric-rpc.polkachu.com",
        rest: "https://agoric-api.polkachu.com",
        explorerUrlToTx: "https://bigdipper.live/agoric/transactions/{txHash}",
        coinDenom: "BLD",
        coinMinimalDenom: "ubld",
        coinDecimals: 6,
        prefix: "agoric",
        coinType: 118,
    },
    injective: {
        chainId: "injective-1",
        chainName: "Injective",
        rpc: "https://injective-rpc.polkachu.com",
        rest: "https://injective-api.polkachu.com",
        explorerUrlToTx: "https://explorer.injective.network/transaction/${txHash}",
        coinDenom: "INJ",
        coinMinimalDenom: "inj",
        coinDecimals: 18,
        prefix: "inj",
        coinType: 118,
    },
    luna2: {
        chainId: "phoenix-1",
        chainName: "Luna",
        rpc: "https://terra-rpc.polkachu.com",
        rest: "https://terra-api.polkachu.com",
        explorerUrlToTx: "https://explorer.injective.network/transaction/${txHash}",
        coinDenom: "LUNA",
        coinMinimalDenom: "uluna",
        coinDecimals: 6,
        prefix: "terra",
        coinType: 118,
    },
    cronos: {
        chainId: "cronosmainnet_25-1",
        chainName: "Cronos",
        rpc: "https://rpc.cronos.org/",
        rest: "https://rest.cronos.org/",
        explorerUrlToTx: "https://cronos.org/explorer/tx/${txHash}",
        coinDenom: "CRO",
        coinMinimalDenom: "basecro",
        coinDecimals: 18,
        prefix: "crc",
        coinType: 118,
    },
    evmos: {
        chainId: "evmos_9001-2",
        chainName: "Evmos",
        rpc: "https://evmos-rpc.polkachu.com",
        rest: "https://evmos-api.polkachu.com",
        explorerUrlToTx: "https://www.mintscan.io/evmos/txs/${txHash}",
        coinDenom: "EVMOS",
        coinMinimalDenom: "aevmos",
        coinDecimals: 18,
        prefix: "evmos",
        coinType: 118,
    },
    secret: {
        chainId: "secret-4",
        chainName: "Secret Network",
        rpc: "https://rpc.scrt.network",
        rest: "https://api.scrt.network",
        explorerUrlToTx: "https://www.mintscan.io/secret/txs/${txHash}",
        coinDenom: "SCRT",
        coinMinimalDenom: "uscrt",
        coinDecimals: 6,
        prefix: "secret",
        coinType: 118,
    },
};


// Cronos 
// Luna 2
// Agoric