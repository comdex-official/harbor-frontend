export const missions = [
    {
        id: 1,
        name: "liquid",
        title: "Liquid Harbor directly sent to the wallet",
        icon: "liquid-icon",
        viewBox: "0 0 23.958 40.012"
    },
    {
        id: 2,
        name: "mint",
        title: "Mint CMST on Harbor",
        icon: "mint-icon",
        viewBox: "0 0 30 30",
        path: "/mint",
    },
    {
        id: 3,
        name: "vote",
        title: "Vote on proposal",
        icon: "vote-icon",
        viewBox: "0 0 30 32.46",
        path: "/more/govern",
    },
    {
        id: 4,
        name: "lend",
        title: "Lend $CMST on Commodo platform",
        icon: "lend-icon",
        viewBox: "0 0 30.023 32.127",
        path: process.env.REACT_APP_COMMODO_WEBSITE_URL + "/lend",
    },
    {
        id: 5,
        name: "liquidity",
        title: "LP on Master pool on dex ATOM/CMDX",
        icon: "masterpool-icon",
        viewBox: "0 0 32 32",
        path: process.env.REACT_APP_CSWAP_WEBSITE_URL + "/farm",
    },
]