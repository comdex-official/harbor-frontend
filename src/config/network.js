export const comdex = {
  chainId: "test-1",
  chainName: "Comdex Test Chain",
  coinDenom: "CMDX",
  coinMinimalDenom: "ucmdx",
  coinDecimals: 6,
  prefix: "comdex",
  rpc: "http://65.21.177.16:26657",
  rest: "http://65.21.177.16:1317",
  explorerUrlToTx: `https://dev-explorer.comdex.one/transactions/{txHash}`,
};

export const cmst = {
  coinDenom: "CMST",
  coinMinimalDenom: "ucmst",
  coinDecimals: 6,
};
export const harbor = {
  coinDenom: "HARBOR",
  coinMinimalDenom: "uharbor",
  coinDecimals: 6,
};

export const ibcDenoms = {
  // uatom: "ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9",
  uatom: "ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9",
  uusd: "ibc/C0A51FA43D2BF2CF09B2052EEF861DED08BE0943A4C45C6FED223B784307232C",
  // uxprt: "ibc/F9DEC4F5FFE69B7B9A881D394A30D11DDE2C1FD1FF3941D7F9EBD7CF208BD61A",
  uxprt: "ibc/5EE7D7B82238ECB8F78846CAF097C974D3275B9299E91BF7F0ECD1195ED049E6",
  // uosmo: "ibc/0471F1C4E7AFD3F07702BEF6DC365268D64570F7C1FDC98EA6098DD6DE59817B",
  uosmo: "ibc/13B2C536BB057AC79D5616B8EA1B9540EC1F2170718CAFF6F0083C966FFFED0B",
  uluna: "ibc/A1E1A20C1E4F2F76F301DA625CC476FBD0FCD8CA94DAF60814CA5257B6CD3E3E",
};


export const tokenCoinGeckoIds = ["cosmos","terra-luna","ki","comdex","kava","sentinel","osmosis","juno-network","akash-network",
  "umee","mantle", "persistence","chihuahua-token","secret","injective-protocol"];