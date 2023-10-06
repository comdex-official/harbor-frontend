import {
  AccountSetBase,
  ChainStore,
  getKeplrFromWindow
} from "@keplr-wallet/stores";
import { envConfig } from "../config/envConfig";
import { cmst, comdex, harbor } from "../config/network";
import { CosmjsOfflineSigner, connectSnap, getKey, getSnap, suggestChain } from '@leapwallet/cosmos-snap-provider';


export const contractAddress = envConfig?.harbor?.governanceContractAddress;
export const lockingContractAddress = envConfig?.harbor?.lockingContractAddress;
export const airdropContractAddress = envConfig?.harbor?.airdropContractAddress;

const getCurrencies = (chain) => {
  if (chain?.rpc === comdex?.rpc) {
    return [
      {
        coinDenom: chain?.coinDenom,
        coinMinimalDenom: chain?.coinMinimalDenom,
        coinDecimals: chain?.coinDecimals,
        coinGeckoId: chain?.coinGeckoId,
      },
      {
        coinDenom: cmst?.coinDenom,
        coinMinimalDenom: cmst?.coinMinimalDenom,
        coinDecimals: cmst?.coinDecimals,
      },
      {
        coinDenom: harbor?.coinDenom,
        coinMinimalDenom: harbor?.coinMinimalDenom,
        coinDecimals: harbor?.coinDecimals,
      },
    ];
  } else {
    return [
      {
        coinDenom: chain?.coinDenom,
        coinMinimalDenom: chain?.coinMinimalDenom,
        coinDecimals: chain?.coinDecimals,
        coinGeckoId: chain?.coinGeckoId,
      },
    ];
  }
};

export const getFeeCurrencies = (chain = comdex) => {
  if (chain?.rpc === comdex?.rpc) {
    return [
      {
        coinDenom: chain?.coinDenom,
        coinMinimalDenom: chain?.coinMinimalDenom,
        coinDecimals: chain?.coinDecimals,
        coinGeckoId: chain?.coinGeckoId,
        gasPriceStep: {
          low: 0.01,
          average: 0.025,
          high: 0.04,
        },
      },
      {
        coinDenom: cmst?.coinDenom,
        coinMinimalDenom: cmst?.coinMinimalDenom,
        coinDecimals: cmst?.coinDecimals,
        coinGeckoId: chain?.coinGeckoId,
        gasPriceStep: {
          low: 0.01,
          average: 0.025,
          high: 0.04,
        },
      },
    ];
  } else {
    return [
      {
        coinDenom: chain?.coinDenom,
        coinMinimalDenom: chain?.coinMinimalDenom,
        coinDecimals: chain?.coinDecimals,
        coinGeckoId: chain?.coinGeckoId,
        // Adding separate gas steps for eth accounts.
        gasPriceStep: chain?.features?.includes("eth-address-gen")
          ? {
            low: 1000000000000,
            average: 1500000000000,
            high: 2000000000000,
          }
          : {
            low: 0.01,
            average: 0.025,
            high: 0.04,
          },
      },
    ];
  }
};

const getFeatures = (chain) => {
  if (chain?.coinDenom === "INJ") {
    return ([
      "ibc-transfer",
      "ibc-go",
      "eth-address-gen",
      "eth-key-sign"
    ])
  }
}

export const getChainConfig = (chain = comdex) => {
  return {
    chainId: chain?.chainId,
    chainName: chain?.chainName,
    rpc: chain?.rpc,
    rest: chain?.rest,
    stakeCurrency: {
      coinDenom: chain?.coinDenom,
      coinMinimalDenom: chain?.coinMinimalDenom,
      coinDecimals: chain?.coinDecimals,
      coinGeckoId: chain?.coinGeckoId,
    },
    walletUrlForStaking: chain?.walletUrlForStaking,
    bip44: {
      coinType: chain?.coinType,
    },
    bech32Config: {
      bech32PrefixAccAddr: `${chain?.prefix}`,
      bech32PrefixAccPub: `${chain?.prefix}pub`,
      bech32PrefixValAddr: `${chain?.prefix}valoper`,
      bech32PrefixValPub: `${chain?.prefix}valoperpub`,
      bech32PrefixConsAddr: `${chain?.prefix}valcons`,
      bech32PrefixConsPub: `${chain?.prefix}valconspub`,
    },
    currencies: getCurrencies(chain),
    feeCurrencies: getFeeCurrencies(chain),
    features: chain?.features,
    coinType: chain?.coinType,
  };
};

// export const initializeChain = (type, callback) => {
//   (async () => {
//     let walletType = type || localStorage.getItem("loginType");
//     let isNoExtensionExists =
//       walletType === "keplr"
//         ? !window.getOfflineSigner || !window.keplr
//         : !window?.leap?.getOfflineSigner || !window.wallet;

//     if (isNoExtensionExists) {
//       const error = `Please install ${walletType} wallet extension`;
//       callback(error);
//     }
//     // } 
//     else {
//       let suggestChain =
//         walletType === "keplr"
//           ? window.keplr.experimentalSuggestChain
//           : window.leap.experimentalSuggestChain;

//       if (suggestChain) {
//         try {

//           walletType === "keplr"
//             ? await window.keplr.experimentalSuggestChain(getChainConfig())
//             : await window.leap.experimentalSuggestChain(getChainConfig());
//           const offlineSigner =
//             walletType === "keplr"
//               ? window.getOfflineSigner(comdex?.chainId)
//               : window?.leap?.getOfflineSigner(comdex?.chainId);

//           const accounts = await offlineSigner.getAccounts();

//           callback(null, accounts[0]);
//         } catch (error) {
//           callback(error?.message);
//         }
//       } else {
//         const versionError = `Please use the recent version of ${walletType} wallet extension`;
//         callback(versionError);
//       }
//     }
//   })();
// };

export const initializeChain = (type, callback) => {
  (async () => {
    let walletType = type || localStorage.getItem("loginType");
    if (walletType === "metamask") {
      (async () => {

        getSnap()
          .then(async (res) => {
            if (!res) {
              await connectSnap(); // Initiates installation if not already present
              await suggestChain(getChainConfig());
              const key = await getKey(comdex?.chainId);
              callback(null, key);
            } else {
              const key = await getKey(comdex?.chainId);
              callback(null, key);
            }
          })
          .catch((error) => {
            console.log(error, 'errro');
            callback(error?.message);
          });

      })()
    } else {
      let isNoExtensionExists =
        walletType === "keplr"
          ? !window.getOfflineSigner || !window.keplr
          : walletType === "leap"
            ? !window?.leap?.getOfflineSigner || !window.leap
            : true; // Add more conditions for other wallet types if needed

      if (isNoExtensionExists) {
        const error = `Please install ${walletType} wallet extension`;
        callback(error);
      } else {
        let suggestChain =
          walletType === "keplr"
            ? window.keplr.experimentalSuggestChain
            : walletType === "leap"
              ? window.leap.experimentalSuggestChain
              : null; // Add more conditions for other wallet types if needed

        if (suggestChain) {
          try {
            if (walletType === "keplr") {
              await window.keplr.experimentalSuggestChain(getChainConfig());
            } else if (walletType === "leap") {
              await window.leap.experimentalSuggestChain(getChainConfig());
            }
            const offlineSigner =
              walletType === "keplr"
                ? window.getOfflineSigner(comdex?.chainId)
                : walletType === "leap"
                  ? window?.leap?.getOfflineSigner(comdex?.chainId)
                  : null; // Add more conditions for other wallet types if needed

            if (offlineSigner) {
              const accounts = await offlineSigner.getAccounts();
              callback(null, accounts[0]);
            } else {
              callback("Offline signer not found for the selected wallet type.");
            }
          } catch (error) {
            callback(error?.message);
          }
        } else {
          const versionError = `Please use the recent version of ${walletType} wallet extension`;
          callback(versionError);
        }
      }
    }
  })();
};

export const magicInitializeChain = (networkChain, callback) => {
  (async () => {
    let walletType = localStorage.getItem("loginType");

    let isNoExtensionExists =
      walletType === "keplr"
        ? !window.getOfflineSigner || !window.keplr
        : !window?.leap?.getOfflineSigner || !window.wallet;

    if (isNoExtensionExists) {
      const error = `Please install ${walletType} wallet extension`;
      callback(error);
    } else {

      let suggestChain =
        walletType === "keplr"
          ? window.keplr.experimentalSuggestChain
          : window.leap.experimentalSuggestChain;

      if (suggestChain) {
        try {
          walletType === "keplr"
            ? await window.keplr.experimentalSuggestChain(getChainConfig(networkChain))
            : await window.leap.experimentalSuggestChain(getChainConfig(networkChain));

          const offlineSigner =
            walletType === "keplr"
              ? window.getOfflineSigner(networkChain?.chainId)
              : window?.leap?.getOfflineSigner(networkChain?.chainId);

          const accounts = await offlineSigner.getAccounts();
          callback(null, accounts[0]);
        } catch (error) {
          callback(error?.message);
        }
      } else {
        const versionError = "Please use the recent version of keplr extension";
        callback(versionError);
      }
    }
  })();

};

// export const initializeIBCChain = (config, callback) => {
//   (async () => {
//     let walletType = localStorage.getItem("loginType");

//     let isNoExtensionExists =
//       walletType === "keplr"
//         ? !window.getOfflineSigner || !window.keplr
//         : !window?.leap?.getOfflineSigner || !window.wallet;

//     if (isNoExtensionExists) {
//       const error = `Please install ${walletType} wallet extension`;

//       callback(error);
//     } else {
//       let suggestChain =
//         walletType === "keplr"
//           ? window.keplr.experimentalSuggestChain
//           : window.leap.experimentalSuggestChain;

//       if (suggestChain) {
//         try {
//           walletType === "keplr"
//             ? await window.keplr.experimentalSuggestChain(config)
//             : await window.leap.experimentalSuggestChain(config);
//           const offlineSigner =
//             walletType === "keplr"
//               ? window.getOfflineSigner(config?.chainId)
//               : window?.leap?.getOfflineSigner(config?.chainId);

//           const accounts = await offlineSigner.getAccounts();
//           callback(null, accounts[0]);
//         } catch (error) {
//           callback(error?.message);
//         }
//       } else {
//         const versionError = "Please use the recent version of keplr extension";
//         callback(versionError);
//       }
//     }
//   })();
// };

export const initializeIBCChain = (config, callback) => {
  (async () => {
    let walletType = localStorage.getItem('loginType');

    if (walletType === "metamask") {
      try {
        const offlineSigner = new CosmjsOfflineSigner(config?.chainId);
        const accounts = await offlineSigner.getAccounts();

        callback(null, accounts[0]);
      } catch (error) {
        callback(error?.message);
      }
    } else {
      let isNoExtensionExists =
        walletType === 'keplr'
          ? !window.getOfflineSigner || !window.keplr
          : !window?.leap?.getOfflineSigner || !window.leap;

      if (isNoExtensionExists) {
        const error = `Please install ${walletType} wallet extension`;
        callback(error);
      } else {
        let suggestChain =
          walletType === 'keplr'
            ? window.keplr.experimentalSuggestChain
            : window.leap.experimentalSuggestChain;

        if (suggestChain) {
          try {
            walletType === 'keplr'
              ? await window.keplr.experimentalSuggestChain(config)
              : await window.leap.experimentalSuggestChain(config);
            const offlineSigner =
              walletType === 'keplr'
                ? window.getOfflineSigner(config?.chainId)
                : window?.leap?.getOfflineSigner(config?.chainId);
            const accounts = await offlineSigner.getAccounts();

            callback(null, accounts[0]);
          } catch (error) {
            callback(error?.message);
          }
        } else {
          const versionError = 'Please use the recent version of keplr extension';
          callback(versionError);
        }
      }
    }


  })();
};

export const fetchKeplrAccountName = async () => {
  const chainStore = new ChainStore([getChainConfig()]);

  const accountSetBase = new AccountSetBase(
    {
      // No need
      addEventListener: () => { },
      removeEventListener: () => { },
    },
    chainStore,
    comdex?.chainId,
    {
      suggestChain: false,
      autoInit: true,
      getKeplr: getKeplrFromWindow,
    }
  );

  // Need wait some time to get the Keplr.
  await (() => {
    return new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
  })();

  return accountSetBase?.name;
};
// export const KeplrWallet = async (chainID = comdex?.chainId) => {
//   await window.keplr.enable(chainID);
//   const offlineSigner = await window.getOfflineSignerAuto(chainID);
//   const accounts = await offlineSigner.getAccounts();
//   return [offlineSigner, accounts];
// };

export const KeplrWallet = async (chainID = comdex.chainId) => {
  let walletType = localStorage.getItem("loginType");
  if (walletType === "metamask") {
    const offlineSigner = new CosmjsOfflineSigner(comdex?.chainId);
    const accounts = await offlineSigner.getAccounts();
    return [offlineSigner, accounts];
  } else {
    walletType === "keplr"
      ? await window.keplr.enable(chainID)
      : await window.leap.enable(chainID);

    const offlineSigner =
      walletType === "keplr"
        ? await window.getOfflineSignerAuto(chainID)
        : await window?.leap?.getOfflineSignerAuto(chainID);
    const accounts = await offlineSigner.getAccounts();
    return [offlineSigner, accounts];
  }
};
