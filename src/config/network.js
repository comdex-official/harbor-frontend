export const comdex = {
  chainId: "test",
  // chainId: "test-1",
  chainName: "Comdex Test Chain",
  coinDenom: "CMDX",
  coinMinimalDenom: "ucmdx",
  coinDecimals: 6,
  prefix: "comdex",
  // rpc: "https://dev.harborprotocol.one/test-harbor-rpc",
  // Devnet
  // rest: "https://dev.harborprotocol.one/test-harbor-rest",
  //  Devent
  rpc: "http://46.166.172.248:26657/",
  rest: "http://46.166.172.248:1317",
  // rpc: "https://int-rpc.comdex.one/",
  // rest: "https://int-rest.comdex.one/",
  explorerUrlToTx: `https://dev-explorer.comdex.one/transactions/{txHash}`,
  coinType: 118,
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
  uatom: "ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9",
  uusd: "ibc/C0A51FA43D2BF2CF09B2052EEF861DED08BE0943A4C45C6FED223B784307232C",
  uxprt: "ibc/5EE7D7B82238ECB8F78846CAF097C974D3275B9299E91BF7F0ECD1195ED049E6",
  uosmo: "ibc/13B2C536BB057AC79D5616B8EA1B9540EC1F2170718CAFF6F0083C966FFFED0B",
  uluna: "ibc/A1E1A20C1E4F2F76F301DA625CC476FBD0FCD8CA94DAF60814CA5257B6CD3E3E",
};
