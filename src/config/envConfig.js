export const envConfig = {
    rpc: "https://devnet.rpc.comdex.one",
    rest: "https://devnet.rest.comdex.one",
    chainId: "test-1",
    coinDenom: "CMDX",
    coinMinimalDenom: "ucmdx",
    coinDecimals: 6,
    prefix: "comdex",
    coinType: 118,
    symbol:"CMDX",
    chainName: "Comdex Test Chain",
    explorerUrlToTx: "https://dev-explorer.comdex.one/transactions/{txHash}",
    apiUrl: "https://test-stat.comdex.one",
    comdexStakingUrl: "https://comdex.omniflix.co/stake",
    coinGeckoId: "comdex",
    webSocketApiUrl: "wss://rpc.comdex.one/websocket",

    harbor: {
        title: "Harbor Protocol",
        websiteUrl: "https://devnet.harborprotocol.one",
        appId: 2,
        governanceContractAddress: "comdex17p9rzwnnfxcjp32un9ug7yhhzgtkhvl9jfksztgw5uh69wac2pgs4jg6dx",
        lockingContractAddress: "comdex1nc5tatafv6eyq7llkr2gv50ff9e22mnf70qgjlv737ktmt4eswrqdfklyz",
        airdropContractAddress: "comdex1xt4ahzz2x8hpkc0tk6ekte9x6crw4w6u0r67cyt3kz9syh24pd7s6erldv",
        harborAirdropApiUrl:"http://3.7.255.161",
        harborDashboardTVLApiUrl:" https://stat.comdex.one"
    },
    cSwap: {
        title: "cSwap Exchange",
        websiteUrl: "https://devnet.cswap.one",
        appId: 1, // for testnet appId is 1, and for devnet appId is 2
        masterPoolId: 1,
    },
    commodo: {
        title: "Commodo",
        websiteUrl: "https://devnet.commodo.one",
        appId: 3,
    },
};