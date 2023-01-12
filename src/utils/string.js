import { sha256, stringToPath } from "@cosmjs/crypto";
import moment from "moment";
import { comdex, ibcDenoms } from "../config/network";
import { denomConversion } from "./coin";
import AssetList from "../config/ibc_assets.json";

const getIbcDenomToDenomMap = () => {
  let myMap = {};

  for (let i = 0; i < AssetList?.tokens?.length; i++) {
    if (myMap[AssetList?.tokens[i].ibcDenomHash] === undefined) {
      myMap[AssetList?.tokens[i].ibcDenomHash] =
        AssetList?.tokens[i]?.coinMinimalDenom;
    }
  }

  return myMap;
};

let ibcDenomToDenomMap = getIbcDenomToDenomMap();


const encoding = require("@cosmjs/encoding");

export const decode = (hash) =>
  decodeURIComponent(hash.replace("#", "")) || undefined;

export const generateHash = (txBytes) =>
  encoding.toHex(sha256(txBytes)).toUpperCase();

export const ibcDenomToDenom = (key) => ibcDenomToDenomMap?.[key];

// For getIcon From extendedPair name 
export const symbolToDenom = (key) => {
  switch (key) {
    case "atom":
    case ibcDenoms["uatom"]:
      return ibcDenoms["uatom"];
    case "osmo":
    case ibcDenoms["uosmo"]:
      return ibcDenoms["uosmo"];
    case "juno":
    case ibcDenoms["ujuno"]:
      return ibcDenoms["ujuno"];
    case "usdc":
    case ibcDenoms["uusdc"]:
      return ibcDenoms["uusdc"];
    case "weth":
    case ibcDenoms["weth-wei"]:
      return ibcDenoms["weth-wei"];
    case "wbtc-satoshi" || "wbtc":
    case ibcDenoms["wbtc-satoshi"]:
      return ibcDenoms["wbtc-satoshi"];
    case "wmatic-wei" || "wmatic":
    case ibcDenoms["wmatic-wei"]:
      return ibcDenoms["wmatic-wei"];
    case "stuatom":
    case ibcDenoms["stuatom"]:
      return ibcDenoms["stuatom"];
    case "dai":
    case ibcDenoms["dai-wei"]:
      return ibcDenoms["dai-wei"];
    case "cmdx":
      return "ucmdx";
    case "cmst":
      return "ucmst";
    case "harbor":
      return "uharbor";
    default:
      return "";
  }
};

export const denomToSymbol = (key) => {
  return denomConversion(key);
};

export const denomToCoingeckoTokenId = (key) => {
  switch (key) {
    case "uatom":
    case ibcDenoms["uatom"]:
      return "cosmos";
    case "uosmo":
    case ibcDenoms["uosmo"]:
      return "osmosis";
    case "ucmdx":
      return "comdex";
    case "uusdc":
    case ibcDenoms["uusdc"]:
      return "axlusdc";
    case "weth-wei":
    case "uweth":
    case ibcDenoms["weth-wei"]:
      return "axlweth";
    default:
      return "";
  }
};


const iconMap = {
  ucmdx: "comdex-icon",
  ucmst: "cmst-icon",
  uharbor: "harbor-icon",
  // taking coinMinimalDenom to match ibc denom and fetch icon.
  [ibcDenoms["uatom"]]: "atom-icon",
  [ibcDenoms["uosmo"]]: "osmosis-icon",
  [ibcDenoms["uusdc"]]: "usdc-icon",
  [ibcDenoms["weth-wei"]]: "weth-icon",
  [ibcDenoms["ujuno"]]: "juno-icon",
  [ibcDenoms["wbtc-satoshi"]]: "wbtc-icon",
  [ibcDenoms["stuatom"]]: "statom-icon",
  [ibcDenoms["wmatic-wei"]]: "wmatic-icon",
  [ibcDenoms["dai-wei"]]: "dai-icon",
};

export const iconNameFromDenom = (key) => {
  return iconMap[key];
};

export const orderStatusText = (key) => {
  switch (key) {
    case 0:
      return "UNSPECIFIED";
    case 1:
      return "NOT EXECUTED";
    case 2:
      return "NOT MATCHED";
    case 3:
      return "PARTIALLY MATCHED";
    case 4:
      return "COMPLETED";
    case 5:
      return "CANCELED";
    case 6:
      return "EXPIRED";
    default:
      return "";
  }
};

export const trimWhiteSpaces = (data) => data.split(" ").join("");

export const truncateString = (string, front, back) =>
  `${string.substr(0, front)}...${string.substr(
    string.length - back,
    string.length
  )}`;

export const lowercaseFirstLetter = (string) => {
  return string.charAt(0).toLowerCase() + string.slice(1).toUpperCase();
};

//Considering input with given decimal point only.
export const toDecimals = (value, decimal = comdex.coinDecimals) =>
  value.indexOf(".") >= 0
    ? value.substr(0, value.indexOf(".")) +
    value.substr(value.indexOf("."), decimal + 1)
    : value;

export const showUserAssetCount = (assetShare, denom) => {
  return `${assetShare} ${denomConversion(denom) || ""}`;
};

export const uniqueDenoms = (list, type) => {
  return [
    ...new Set(
      list && list.length > 0
        ? list.map((item) => (type === "in" ? item.denomIn : item.denomOut))
        : []
    ),
  ];
};

export const uniqueLiquidityPairDenoms = (list, type) => {
  return [
    ...new Set(
      list && list.length > 0
        ? list.map((item) =>
          type === "in" ? item.baseCoinDenom : item.quoteCoinDenom
        )
        : []
    ),
  ];
};

export const uniqueQuoteDenomsForBase = (list, type, denom) => {
  const quoteList =
    list && list.length > 0
      ? list.filter((item) =>
        type === "in"
          ? item.baseCoinDenom === denom
          : item.quoteCoinDenom === denom
      )
      : [];

  const quoteMap = quoteList.map((item) =>
    type === "in" ? item.quoteCoinDenom : item.baseCoinDenom
  );

  return [...new Set(quoteMap)];
};

export const makeHdPath = (
  accountNumber = "0",
  addressIndex = "0",
  coinType = comdex.coinType
) => {
  return stringToPath(
    "m/44'/" + coinType + "'/" + accountNumber + "'/0/" + addressIndex
  );
};

export const unixToGMTTime = (time) => {
  let newTime = Math.floor(time / 1000000000);
  var timestamp = moment.unix(newTime);
  timestamp = timestamp.format("DD/MMMM/YYYY")
  return timestamp;
}

export const stringTagParser = input => {
  const lines = input.split('\n')
  const output = []
  lines.forEach((d, i) => {
    if (i > 0) {
      output.push(<br />)
    }
    output.push(d)
  })
  return output
}