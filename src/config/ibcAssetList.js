export const ibcAssetList = [
    {
        "chainId": "cosmoshub-4",
        "chainName": "COSMOS",
        "rpc": "https://cosmos-rpc.comdex.one/cosmos",
        "rest": "https://cosmos-rest.comdex.one/cosmos",
        "coinDenom": "ATOM",
        "coinMinimalDenom": "uatom",
        "symbol": "ATOM",
        "coinDecimals": 6,
        "coinType": 118,
        "prefix": "cosmos",
        "channel": "channel-400",
        "comdexChannel": "channel-37",
        "ibcDenomHash": "ibc/961FA3E54F5DCCA639F37A7C45F7BBE41815579EF1513B5AFBEFCFEB8F256352",
        "logoURI": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/atom.svg",
        "coinGeckoId": "cosmos",
        "explorerUrlToTx": "https://www.mintscan.io/osmosis/txs/{txHash}",
        "features": [
            "ibc-transfer",
            "ibc-go"
        ]
    },
    {
        "chainId": "osmosis-1",
        "chainName": "Osmosis",
        "rpc": "https://osmosis-rpc.comdex.one/osmosis",
        "rest": "https://osmosis-rest.comdex.one/osmosis",
        "coinDenom": "OSMO",
        "coinMinimalDenom": "uosmo",
        "symbol": "OSMO",
        "coinDecimals": 6,
        "coinType": 118,
        "prefix": "osmo",
        "channel": "channel-87",
        "comdexChannel": "channel-1",
        "ibcDenomHash": "ibc/0471F1C4E7AFD3F07702BEF6DC365268D64570F7C1FDC98EA6098DD6DE59817B",
        "logoURI": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/osmo.svg",
        "coinGeckoId": "osmosis",
        "explorerUrlToTx": "https://www.mintscan.io/osmosis/txs/{txHash}",
        "features": [
            "ibc-transfer",
            "ibc-go"
        ]
    },

    {
        "chainId": "phoenix-1",
        "chainName": "terra2",
        "rpc": "https://terra-rpc.comdex.one/terra",
        "rest": "https://terra-rest.comdex.one/terra",
        "coinDenom": "LUNA",
        "coinMinimalDenom": "uluna",
        "symbol": "LUNA",
        "coinDecimals": 6,
        "coinType": 118,
        "prefix": "terra",
        "channel": "channel-39",
        "comdexChannel": "channel-51",
        "logoURI": "https://raw.githubusercontent.com/cosmos/chain-registry/master/terra2/images/luna.png",
        "ibcDenomHash": "ibc/0695E3FA2C74C608E9573025598A7BD4297BE15180F86707B2118E513DBF4A5A",
        "coinGeckoId": "terra",
        "explorerUrlToTx": "https://finder.terra.money/mainnet/tx/{txHash}",
        "features": [
            "ibc-transfer",
            "ibc-go"
        ]
    },

    {
        "chainId": "stride-1",
        "chainName": "stride",
        "rpc": "https://stride-rpc.comdex.one/stride",
        "rest": "https://stride-rest.comdex.one/stride",
        "coinDenom": "statom",
        "coinMinimalDenom": "stuatom",
        "symbol": "stATOM",
        "coinDecimals": 6,
        "coinType": 118,
        "prefix": "stride",
        "channel": "channel-49",
        "comdexChannel": "channel-45",
        "ibcDenomHash": "ibc/21476176CD2CBF2F8017EFF231B1132DF23F350B0219AB47A6E087527ECADCC2",
        "logoURI": "https://raw.githubusercontent.com/cosmos/chain-registry/master/stride/images/statom.svg",
        "coinGeckoId": "stride-staked-atom",
        "explorerUrlToTx": "https://www.mintscan.io/stride/txs/{txHash}",
        "features": [
            "ibc-transfer",
            "ibc-go"
        ]
    },
    {
        "chainId": "stride-1",
        "chainName": "stride",
        "rpc": "https://stride-rpc.comdex.one/stride",
        "rest": "https://stride-rest.comdex.one/stride",
        "coinDenom": "stosmo",
        "coinMinimalDenom": "stuosmo",
        "symbol": "stOSMO",
        "coinDecimals": 6,
        "coinType": 118,
        "prefix": "stride",
        "channel": "channel-49",
        "comdexChannel": "channel-45",
        "ibcDenomHash": "ibc/CC482813CC038C614C2615A997621EA5E605ADCCD4040B83B0468BD72533A165",
        "logoURI": "https://raw.githubusercontent.com/cosmos/chain-registry/master/stride/images/stosmo.svg",
        "coinGeckoId": "stride-staked-osmo",
        "explorerUrlToTx": "https://www.mintscan.io/stride/txs/{txHash}",
        "features": [
            "ibc-transfer",
            "ibc-go"
        ]
    },
    {
        "chainId": "gravity-bridge-3",
        "chainName": "gravitybridge",
        "rpc": "https://gravitybridge-rpc.comdex.one/gravitybridge",
        "rest": "https://gravitybridge-rest.comdex.one/gravitybridge",
        "coinDenom": "gusdc",
        "coinMinimalDenom": "gravity0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        "symbol": "USDC.grav",
        "coinDecimals": 6,
        "coinType": 118,
        "prefix": "gravity",
        "channel": "channel-21",
        "comdexChannel": "channel-23",
        "ibcDenomHash": "ibc/50EF138042B553362774A8A9DE967F610E52CAEB3BA864881C9A1436DED98075",
        "logoURI": "https://raw.githubusercontent.com/comdex-official/comdex-assetlists/main/images/gusdc.svg",
        "coinGeckoId": "gravity-bridge-usdc",
        "explorerUrlToTx": "https://www.mintscan.io/gravity-bridge/${txHash}",
        "features": [
            "ibc-transfer",
            "ibc-go"
        ]
    },
    {
        "chainId": "gravity-bridge-3",
        "chainName": "gravitybridge",
        "rpc": "https://gravitybridge-rpc.comdex.one/gravitybridge",
        "rest": "https://gravitybridge-rest.comdex.one/gravitybridge",
        "coinDenom": "gdai",
        "coinMinimalDenom": "gravity0x6B175474E89094C44Da98b954EedeAC495271d0F",
        "symbol": "DAI.grav",
        "coinDecimals": 18,
        "coinType": 118,
        "prefix": "gravity",
        "channel": "channel-21",
        "comdexChannel": "channel-23",
        "ibcDenomHash": "ibc/109DD45CF4093BEB472784A0C5B5F4643140900020B74B102B842A4BE2AE45DA",
        "logoURI": "https://raw.githubusercontent.com/comdex-official/comdex-assetlists/main/images/gusdc.svg",
        "coinGeckoId": "gravity-bridge-dai",
        "explorerUrlToTx": "https://www.mintscan.io/gravity-bridge/${txHash}",
        "features": [
            "ibc-transfer",
            "ibc-go"
        ]
    },
    {
        "chainId": "axelar-dojo-1",
        "chainName": "Axelar",
        "coinDenom": "wbtc",
        "coinMinimalDenom": "wbtc-satoshi",
        "symbol": "WBTC",
        "coinDecimals": 8,
        "coinType": 118,
        "channel": "channel-31",
        "comdexChannel": "channel-34",
        "logoURI": "https://raw.githubusercontent.com/cosmos/chain-registry/master/axelar/images/wbtc.png",
        "ibcDenomHash": "ibc/0A6F20FA34BEBB63568E44C81C6E154C63ED061BA45E7EBC144B24C0DBBD0A4F",
        "depositUrlOverride": "https://satellite.money/?destination_address=&asset_denom=wbtc-satoshi&source=ethereum&destination=comdex",
        "withdrawUrlOverride": "https://satellite.money/?destination_address=&asset_denom=wbtc-satoshi&source=comdex&destination=ethereum",
        "features": [
            "ibc-transfer",
            "ibc-go"
        ]
    },
    {
        "chainId": "axelar-dojo-1",
        "chainName": "Axelar",
        "coinDenom": "USDC",
        "coinMinimalDenom": "uusdc",
        "symbol": "USDC.axl",
        "coinDecimals": 6,
        "coinType": 118,
        "channel": "channel-31",
        "comdexChannel": "channel-34",
        "ibcDenomHash": "ibc/E1616E7C19EA474C565737709A628D6F8A23FF9D3E9A7A6871306CF5E0A5341E",
        "depositUrlOverride": "https://satellite.money/?source=ethereum&destination=comdex&asset_denom=uausdc&destination_address=",
        "withdrawUrlOverride": "https://satellite.money/?source=comdex&destination=ethereum&asset_denom=uausdc&destination_address=",
        "features": [
            "ibc-transfer",
            "ibc-go"
        ]
    },
    {
        "chainId": "axelar-dojo-1",
        "chainName": "Axelar",
        "coinDenom": "wmatic",
        "coinMinimalDenom": "wmatic-wei",
        "symbol": "WMATIC",
        "coinDecimals": 18,
        "coinType": 118,
        "channel": "channel-31",
        "comdexChannel": "channel-34",
        "logoURI": "https://raw.githubusercontent.com/cosmos/chain-registry/master/_non-cosmos/polygon/images/wmatic.svg",
        "ibcDenomHash": "ibc/E8F0355CBC21AFD4C758E93383D28404D19AEB81E8251A63FAA0C250672ADBEF",
        "depositUrlOverride": "https://satellite.money/?destination_address=&asset_denom=wmatic-wei&source=ethereum&destination=comdex",
        "withdrawUrlOverride": "https://satellite.money/?destination_address=&asset_denom=wmatic-wei&source=comdex&destination=ethereum",
        "features": [
            "ibc-transfer",
            "ibc-go"
        ]
    },
    {
        "chainId": "axelar-dojo-1",
        "chainName": "Axelar",
        "coinDenom": "dai",
        "coinMinimalDenom": "dai-wei",
        "symbol": "DAI.axl",
        "coinDecimals": 18,
        "coinType": 118,
        "channel": "channel-31",
        "comdexChannel": "channel-34",
        "logoURI": "https://raw.githubusercontent.com/cosmos/chain-registry/master/axelar/images/dai.svg",
        "ibcDenomHash": "ibc/54DEF693B7C4BF171E7FFF3ABFE2B54D6A3B8A047A32BAAE9F1417A378594EC6",
        "depositUrlOverride": "https://satellite.money/?destination_address=&asset_denom=dai-wei&source=ethereum&destination=comdex",
        "withdrawUrlOverride": "https://satellite.money/?destination_address=&asset_denom=dai-wei&source=comdex&destination=ethereum",
        "features": [
            "ibc-transfer",
            "ibc-go"
        ]
    },
    {
        "chainId": "axelar-dojo-1",
        "chainName": "Axelar",
        "coinDenom": "weth",
        "coinMinimalDenom": "weth-wei",
        "symbol": "WETH",
        "coinDecimals": 18,
        "coinType": 118,
        "channel": "channel-31",
        "comdexChannel": "channel-34",
        "logoURI": "https://raw.githubusercontent.com/cosmos/chain-registry/master/axelar/images/weth.png",
        "ibcDenomHash": "ibc/81C3A46287D7664A8FD19843AC8D0CFD6C284EF1F750C661C48B3544277B1B29",
        "depositUrlOverride": "https://satellite.money/?destination_address=&asset_denom=weth-wei&source=ethereum&destination=comdex",
        "withdrawUrlOverride": "https://satellite.money/?destination_address=&asset_denom=weth-wei&source=comdex&destination=ethereum",
        "features": [
            "ibc-transfer",
            "ibc-go"
        ]
    },
]