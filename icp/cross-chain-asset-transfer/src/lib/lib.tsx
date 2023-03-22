import { useRef, useEffect } from "react";
import EspaniconSDKWeb from "@espanicon/espanicon-sdk";
import type {
  BscBalanceOfReply,
  IconBalanceOfReply,
  Url,
  ContractListType,
  ContractListType2,
  EspaniconSDKType,
  // DefaultTxResultType,
} from "../types";

const RPC_NODES = {
  ctz: {
    nid: 1,
    hostname: "ctz.solidwallet.io",
  },
  icon: {
    nid: 1,
    hostname: "api.icon.community",
  },
  espanicon: {
    nid: 1,
    hostname: "api.icon.community",
  },
  sejong: {
    nid: 83,
    hostname: "sejong.net.solidwallet.io",
  },
  berlin: {
    nid: 7,
    hostname: "berlin.net.solidwallet.io",
  },
  lisbon: {
    nid: 2,
    hostname: "lisbon.net.solidwallet.io",
  },
};

const tokenNames = {
  icx: "ICX",
  sicx: "sICX",
  bnb: "BNB",
  btcb: "BTCB",
  eth: "ETH",
  bnusd: "bnUSD",
  busd: "BUSD",
  usdt: "USDT",
  usdc: "USDC",
  icz: "ICZ",
};

const btpTokenNames = {
  icx: ["btp-0x1.icon-ICX", "btp-0x2.icon-ICX"],
  sicx: ["btp-0x1.icon-sICX", "btp-0x2.icon-sICX"],
  bnb: ["btp-0x38.bsc-BNB", "btp-0x61.bsc-BNB"],
  btcb: ["btp-0x38.bsc-BTCB", "btp-0x61.bsc-BTCB"],
  eth: ["btp-0x38.bsc-ETH", "btp-0x61.bsc-ETH"],
  bnusd: ["btp-0x1.icon-bnUSD", "btp-0x2.icon-bnUSD"],
  busd: ["btp-0x38.bsc-BUSD", "btp-0x61.bsc-BUSD"],
  usdt: ["btp-0x38.bsc-USDT", "btp-0x61.bsc-USDT"],
  usdc: ["btp-0x38.bsc-USDC", "btp-0x61.bsc-USDC"],
};

const tokens = [...Object.values(tokenNames)] as const;

const iconTokens = {
  native: [tokenNames.sicx, tokenNames.bnusd],
  wrapped: [
    tokenNames.bnb,
    tokenNames.btcb,
    tokenNames.eth,
    tokenNames.busd,
    tokenNames.usdt,
    tokenNames.usdc,
    tokenNames.icz,
  ],
};

// type ContractListType = {
//   [key: string]: {
//     [key: string]: string;
//   };
// };

// function buildContractList(sdkContracts: ContractListType2) {
//   const chains = Object.keys(sdkContracts);
//   const result: ContractListType = {
//     icon: {},
//     bsc: {},
//   };

//   for (const chain of chains) {
//     const chainTs = chain as keyof typeof sdkContracts;
//     result[chainTs] = {};
//     const networks = Object.keys(sdkContracts[chainTs]);
//     const networksTs = sdkContracts[chainTs];
//     for (const network of networks) {
//       const networkTs = network as keyof typeof networksTs;
//       const tokens = Object.keys(sdkContracts[chainTs][networkTs]);
//       const tokensTs = networksTs[networkTs];
//       for (const token of tokens) {
//         const tokenTs = token as keyof typeof tokensTs;
//         if (result[chain] !== undefined) {
//           // eslint-disable-next-line
//           if (result?[chainTs][tokenTs] == null) {
//             result[chainTs][tokenTs] = {
//               [network]: sdkContracts[chain][network][token].address,
//             };
//           } else {
//             result[chain][token] = {
//               ...result[chain][token],
//               [network]: sdkContracts[chain][network][token].address,
//             };
//           }
//         }
//       }
//     }
//   }
//   return result;
// }

function buildContractList(sdkContracts: ContractListType2) {
  const chains = Object.keys(sdkContracts);
  const result: ContractListType = {};

  for (const chain of chains) {
    result[chain] = {};
    // eslint-disable-next-line
    const networks = Object.keys(sdkContracts[chain]);
    for (const network of networks) {
      // eslint-disable-next-line
      const tokens = Object.keys(sdkContracts[chain][network]);
      for (const token of tokens) {
        if (result[chain][token] == null) {
          result[chain][token] = {
            mainnet: "",
            testnet: "",
          };
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          result[chain][token][network] =
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            sdkContracts[chain][network][token].address;
        } else {
          result[chain][token] = {
            ...result[chain][token],
            // eslint-disable-next-line
            [network]: sdkContracts[chain][network][token].address,
          };
        }
      }
    }
  }
  return result;
}

const contracts = {
  icon: {
    [tokenNames.bnb]: {
      mainnet: "cx077807f2322aeb42ea19a1fcc0c9f3d3f35e1461",
      testnet: "cxcea1078c39e8b887692d3ccdd81bd711a6260ea5",
    },
    [tokenNames.btcb]: {
      mainnet: "cx5b5a03cb525a1845d0af3a872d525b18a810acb0",
      testnet: "cx63be8619af9cdf1cb053ccde7642ae974648a8c1",
    },
    [tokenNames.eth]: {
      mainnet: "cx288d13e1b63563459a2ac6179f237711f6851cb5",
      testnet: "cx4b9cd9bb520b08d14c19c5035295f7e44003e42f",
    },
    [tokenNames.sicx]: {
      mainnet: "cx2609b924e33ef00b648a409245c7ea394c467824",
      testnet: "cx2d013cb55781fb54b81d629aa4b611be2daec564",
      testnet2: "cx3044ad389267b50eb3c57103eade0c5a72261c1a",
    },
    [tokenNames.bnusd]: {
      mainnet: "cx88fd7df7ddff82f7cc735c871dc519838cb235bb",
      testnet: "cxcadcaf77d8e46089fd3d98fcf71eabee1700f148",
      testnet2: "cx7f45afe9d8ce95e80c1be7c4eef2ea0dd843c4e3",
    },
    [tokenNames.busd]: {
      mainnet: "cxb49d82c46be6b61cab62aaf9824b597c6cf8a25d",
      testnet: "cxea67f5fe1d1f7e1d29d54f185f0585b8262c788e",
    },
    [tokenNames.usdt]: {
      mainnet: "cx8e4d9b4164618f796d493a8154f1f17ad75f11bb",
      testnet: "cxac717247714a0b8e2b9038fdadfdcc0f033e325b",
    },
    [tokenNames.usdc]: {
      mainnet: "cx532e4235f9004c233604c1be98ca839cd777d58c",
      testnet: "cxd840ae3c79c1366895747aa8c228bd7e3459032f",
    },
    [tokenNames.icz]: {
      mainnet: "cxbdcc8e15406998d99c4927fecfde99f7c1404358",
      testnet: "cx29e69bd4b79096dc6e07a4f3c22c1ef45675ff34",
    },
  },
  bsc: {
    [tokenNames.icx]: {
      mainnet: "0x9b7b6A964f8870699Ae74744941663D257b0ec1f",
      testnet: "0x0C8773fa9A67291e089cB8136Abb1bcb0Aae220F",
    },
    [tokenNames.btcb]: {
      mainnet: "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c",
      testnet: "0x299Fb600FB51A208d3c268Da187539a59bE40041",
    },
    [tokenNames.eth]: {
      mainnet: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
      testnet: "0xd49a76cF9a79F13deaAcB789039e3ef76C4c1c5F",
    },
    [tokenNames.sicx]: {
      mainnet: "0x33acDF0Fe57C531095F6bf5a992bF5aA81c94Acf",
      testnet: "0xBBE70cE3dAe164a188a47e6Be898F09D29AFdF74",
    },
    [tokenNames.bnusd]: {
      mainnet: "0xa804D2e9221057099eF331AE1c0D6616cC27d770",
      testnet: "0x4F6f26967a882c12a03DAe27272Ed0fd85A94443",
    },
    [tokenNames.busd]: {
      mainnet: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
      testnet: "0xED41B3B136a96c867Ee265cC8a79a8ea39eeC9C4",
    },
    [tokenNames.usdt]: {
      mainnet: "0x55d398326f99059fF775485246999027B3197955",
      testnet: "0x8dE8FaF129d5BD9844dbc92024907d48B415987C",
    },
    [tokenNames.usdc]: {
      mainnet: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
      testnet: "0x9DDBcf279D1D01C32A2c13efCB6415f37416857F",
    },
    [tokenNames.icz]: {
      mainnet: "0xEC018C4e38A67038c2dFBFe94ff2df1B6c6F5385",
      testnet: "0xe3CdBBEE28f7EbB0E2b81764a6E71ce7C681C0E9",
    },
  },
};

function isValidBscAddress(address: string) {
  const regex = /([0][xX][a-fA-F0-9]{40})$/;
  return regex.test(address);
}

function isValidIconAddress(address: string) {
  const regex = /([hH][xX][a-fA-F0-9]{40})$/;
  return regex.test(address);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useTraceUpdate(props: any, from = "default", print = true) {
  const prev = useRef(props);
  useEffect(() => {
    // eslint-disable-next-line
    const changedProps = Object.entries(props).reduce((ps: any, [k, v]) => {
      // eslint-disable-next-line
      let newV: any;
      // eslint-disable-next-line
      let newK: any;
      const flag = false;
      if (flag) {
        // if (k === "pageItems") {
        // eslint-disable-next-line
        newV = JSON.stringify(v);
        // eslint-disable-next-line
        newK = JSON.stringify(prev.current[k]);
      } else {
        // eslint-disable-next-line
        newV = v;
        // eslint-disable-next-line
        newK = prev.current[k];
      }
      if (newK !== newV) {
        // eslint-disable-next-line
        ps[k] = [newK, newV];
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return ps;
    }, {});

    // eslint-disable-next-line
    if (Object.keys(changedProps).length > 0) {
      console.log("no change in props");
      if (print) {
        console.log(`Running from ${from}`);
        console.log("Changed props:", changedProps);
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    prev.current = props;
  });
}

async function getTxResult(
  hash: string,
  useMainnet: boolean,
  maxIterations = 10
) {

  let sdk: null | EspaniconSDKType = null;

  if (!useMainnet) {
    // eslint-disable-next-line
    sdk = new EspaniconSDKWeb(RPC_NODES.lisbon.hostname, RPC_NODES.lisbon.nid);
  } else {
    // eslint-disable-next-line
    sdk = new EspaniconSDKWeb(RPC_NODES.icon.hostname, RPC_NODES.icon.nid);
  }
  //
  if (sdk != null) {
    for (let i = 0; i < maxIterations; i++) {
      // fetch tx from blockchain
      // console.log(`round ${i}`);
      const txResult = await sdk.getTxResult(hash);
      // console.log("sdk tx result");
      // console.log(txResult);

      if (txResult.error == null) {
        return txResult;
      } else {
        await sleep();
      }
    }
  }

  return null;
}

function sleep(time = 1000): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function getBtpCoinName(tokenLabel: string, useMainnet: boolean) {
  let coinName = "";
  if (useMainnet) {
    switch (tokenLabel) {
      case tokenNames.icx:
        coinName = "btp-0x1.icon-ICX";
        break;
      case tokenNames.sicx:
        coinName = "btp-0x1.icon-sICX";
        break;
      case tokenNames.bnb:
        coinName = "btp-0x38.bsc-BNB";
        break;
      case tokenNames.btcb:
        coinName = "btp-0x38.bsc-BTCB";
        break;
      case tokenNames.eth:
        coinName = "btp-0x38.bsc-ETH";
        break;
      case tokenNames.bnusd:
        coinName = "btp-0x1.icon-bnUSD";
        break;
      case tokenNames.busd:
        coinName = "btp-0x38.bsc-BUSD";
        break;
      case tokenNames.usdt:
        coinName = "btp-0x38.bsc-USDT";
        break;
      case tokenNames.usdc:
        coinName = "btp-0x38.bsc-USDC";
        break;
      default:
    }
  } else {
    switch (tokenLabel) {
      case tokenNames.icx:
        coinName = "btp-0x2.icon-ICX";
        break;
      case tokenNames.sicx:
        coinName = "btp-0x2.icon-sICX";
        break;
      case tokenNames.bnb:
        coinName = "btp-0x61.bsc-BNB";
        break;
      case tokenNames.btcb:
        coinName = "btp-0x61.bsc-BTCB";
        break;
      case tokenNames.eth:
        coinName = "btp-0x61.bsc-ETH";
        break;
      case tokenNames.bnusd:
        coinName = "btp-0x2.icon-bnUSD";
        break;
      case tokenNames.busd:
        coinName = "btp-0x61.bsc-BUSD";
        break;
      case tokenNames.usdt:
        coinName = "btp-0x61.bsc-USDT";
        break;
      case tokenNames.usdc:
        coinName = "btp-0x61.bsc-USDC";
        break;
      default:
    }
  }
  return coinName;
}

function decimalToHex(decimal: number) {
  return "0x" + decimal.toString(16);
}

function hexToDecimal(hex: string) {
  return parseInt(hex, 16);
}

function formatBscBalanceResponse(rawBalance: BscBalanceOfReply): {
  result: IconBalanceOfReply;
} {
  return {
    result: {
      locked: rawBalance._lockedBalance,
      refundable: rawBalance._refundableBalance,
      usable: rawBalance._usableBalance,
      userBalance: rawBalance._userBalance,
    },
  };
}

async function getBscTxResult(
  hash: string,
  nodeUrl: string,
  maxIterations = 20
) {
  try {

    // eslint-disable-next-line
    const sdk: EspaniconSDKType = new EspaniconSDKWeb(
      RPC_NODES.lisbon.hostname,
      RPC_NODES.lisbon.nid
    );

    //
    const jsonRpcObj = makeEthGetTxByHashJsonRpcObj(hash);
    const urlObj = parseEthRPCUrl(nodeUrl);
    for (let i = 0; i < maxIterations; i++) {
      // fetch tx from blockchain
      // console.log(`round ${i}`);
      // console.log(urlObj);
      // console.log(jsonRpcObj);
      // eslint-disable-next-line
      const txResult = await sdk.queryMethod(
        // eslint-disable-next-line
        urlObj.path!,
        jsonRpcObj,
        // eslint-disable-next-line
        urlObj.hostname!,
        urlObj.protocol === "https" ? true : false,
        urlObj.port === "" ? false : urlObj.port
      );

      if (txResult == null) {
        throw new Error("error making fetch request");
      }
      if (txResult.result == null) {
        throw new Error(
          `Error response from chain: ${JSON.stringify(txResult)}`
        );
      }

      if (
        txResult.result.blockNumber == null ||
        txResult.result.blockNumber === "null"
      ) {
        await sleep(3000);
      } else {
        return txResult.result;
      }
    }
  } catch (err) {
    console.log(err);
  }
  return null;
}

function makeEthGetTxByHashJsonRpcObj(data: string) {
  return makeEthJsonRpcObj(null, data, "eth_getTransactionByHash");
}

function makeEthJsonRpcObj(
  to: string | null = null,
  data: string,
  callType: string
) {
  let params: Array<string> | Array<{ to: string | null; data: string }>;
  if (to == null) {
    params = [data];
  } else {
    params = [{ to: to, data: data }];
  }
  const result = {
    jsonrpc: "2.0",
    method: callType,
    id: Math.ceil(Math.random() * 100),
    params: params,
  };
  return JSON.stringify(result);
}

function parseEthRPCUrl(nodeUrl: string) {
  const urlRegex =
    /^((https|http):\/\/)?(([a-zA-Z0-9-]{1,}\.){1,}([a-zA-Z0-9]{1,63}))(:[0-9]{2,5})?(\/.*)?$/;
  const inputInLowercase = nodeUrl.toLowerCase();
  const parsedUrl: Url = {
    protocol: "https",
    path: "/",
    hostname: null,
    port: "443",
  };

  const regexResult = inputInLowercase.match(urlRegex);

  if (regexResult != null) {
    parsedUrl.protocol =
      regexResult[2] == null
        ? "https"
        : (regexResult[2] as unknown as "https" | "http");
    parsedUrl.path = regexResult[7] == null ? "/" : regexResult[7];
    parsedUrl.hostname = regexResult[3] == undefined ? null : regexResult[3];
    parsedUrl.port = regexResult[6] == null ? "" : regexResult[6].slice(1);
  }

  return parsedUrl;
}

const lib = {
  tokenNames,
  iconTokens,
  tokens,
  contracts,
  isValidBscAddress,
  isValidIconAddress,
  useTraceUpdate,
  getTxResult,
  getBtpCoinName,
  btpTokenNames,
  decimalToHex,
  hexToDecimal,
  buildContractList,
  formatBscBalanceResponse,
  getBscTxResult,
};

export default lib;
