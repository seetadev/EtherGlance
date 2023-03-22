import type { Dispatch, ChangeEvent } from "react";
import lib from "../lib/lib";
import type {
  Tokens,
  JSONRPCType,
  TxType,
  TokenType,
  WalletsObjType,
  BscParams,
  IconBridgeSDKType,
  // SdkContracts,
  // IconBalanceOfReply,
  ContractListType,
} from "../types";

// import IconBridgeSDK from "@espanicon/icon-bridge-sdk-js";

// variable declarations
// const sdkTestnet = new IconBridgeSDK({ useMainnet: false });
// const sdkMainnet = new IconBridgeSDK({ useMainnet: true });

export const WALLETS_INIT: WalletsObjType = {
  icon: null,
  bsc: null,
};

// functions
function dispatchTxEvent(txData: JSONRPCType) {
  window.dispatchEvent(
    new CustomEvent("ICONEX_RELAY_REQUEST", {
      detail: {
        type: "REQUEST_JSON-RPC",
        payload: txData,
      },
    })
  );
}

function handleWalletsChange(
  wallets: WalletsObjType,
  setLoginWallets: Dispatch<WalletsObjType>
) {
  setLoginWallets(wallets);
}

function handleOnChainFromIcon(
  evnt: ChangeEvent<HTMLSelectElement>,
  setFromIcon: Dispatch<boolean>
) {
  switch (evnt.target.value) {
    case "icon":
      setFromIcon(true);
      break;
    case "bsc":
      setFromIcon(false);
      break;
    default:
  }
}

function handleOnChainFromBsc(
  evnt: ChangeEvent<HTMLSelectElement>,
  setFromIcon: Dispatch<boolean>
) {
  switch (evnt.target.value) {
    case "icon":
      setFromIcon(false);
      break;
    case "bsc":
      setFromIcon(true);
      break;
    default:
  }
}

function handleTokenSelection(
  evnt: ChangeEvent<HTMLSelectElement>,
  setTokenToTransfer: Dispatch<string>
) {
  setTokenToTransfer(evnt.target.value);
}

function handleAmountToTransferChange(
  evnt: ChangeEvent<HTMLInputElement>,
  setAmountToTransfer: Dispatch<string>
) {
  const valueArr = evnt.target.value.split(".");
  const result = [];
  for (let each = 0; each < 2; each++) {
    if (valueArr[each] != null) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const a = valueArr[each]!.replace(/\D/, "");
      result.push(a);
    }
  }

  const parsed = result.join(".");
  setAmountToTransfer(parsed);
}

function handleOnNetworkChange(
  evnt: ChangeEvent<HTMLSelectElement>,
  setUseMainnet: Dispatch<boolean>
) {
  switch (evnt.target.value) {
    case "testnet":
      setUseMainnet(false);
      break;
    case "mainnet":
      setUseMainnet(true);
      break;
    default:
  }
}

async function refundIconTokenBalance(
  loginWallets: WalletsObjType,
  useMainnet: boolean,
  tokenData: TokenType,
  sdkTestnet: IconBridgeSDKType,
  sdkMainnet: IconBridgeSDKType
) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const wallet = loginWallets.icon!;
  const localSdk = useMainnet ? sdkMainnet.icon : sdkTestnet.icon;
  const tokenLabel = lib.getBtpCoinName(tokenData.token, useMainnet);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const refundableBalance = tokenData.balance.refundable!;
  // parseInt(tokenData.balance.refundable!, 16) / 10 ** 18;
  const queryObj = await localSdk.web.reclaim(
    tokenLabel,
    refundableBalance,
    wallet
  );

  return queryObj;
}

async function getBscTokensBalance(
  loginWallets: WalletsObjType,
  useMainnet: boolean,
  arrOfTokens: Partial<typeof lib.tokens>,
  callback: Dispatch<Array<TokenType>>,
  sdkTestnet: IconBridgeSDKType,
  sdkMainnet: IconBridgeSDKType
) {
  try {
    const wallet = loginWallets.bsc;
    const localSdk = useMainnet ? sdkMainnet.bsc : sdkTestnet.bsc;
    const result = [];
    for (const token of arrOfTokens) {
      if (token != null) {
        const tokenLabel = lib.getBtpCoinName(token, useMainnet);
        const rawQuery = await localSdk.methods.balanceOf(wallet, tokenLabel);
        if (rawQuery == null || rawQuery.error != null) {
          throw new Error("Error fetching balance of tokens on BSC chain");
        }
        const query = lib.formatBscBalanceResponse(rawQuery);
        if (query != null) {
          const parsedBalances = { ...query.result };
          result.push({
            token: token,
            label: tokenLabel,
            claiming: false,
            balance: { ...parsedBalances },
          });
        }
      }
    }
    callback(result);
  } catch (err) {
    console.log("error fetching bsc balance");
    console.log(err);
  }
}

async function getIconTokensBalance(
  loginWallets: WalletsObjType,
  useMainnet: boolean,
  arrOfTokens: Partial<typeof lib.tokens>,
  callback: Dispatch<Array<TokenType>>,
  sdkTestnet: IconBridgeSDKType,
  sdkMainnet: IconBridgeSDKType
) {
  const wallet = loginWallets.icon;
  const localSdk = useMainnet ? sdkMainnet.icon : sdkTestnet.icon;
  const result = [];
  for (const token of arrOfTokens) {
    if (token != null) {
      const tokenLabel = lib.getBtpCoinName(token, useMainnet);
      const query = await localSdk.methods.balanceOf(wallet, tokenLabel);
      if (query != null) {
        result.push({
          token: token,
          label: tokenLabel,
          claiming: false,
          balance: { ...query.result },
        });
      }
    }
  }
  callback(result);
}

async function handleOnTransfer(
  fromIcon: boolean,
  loginWallets: WalletsObjType,
  targetStatus: boolean,
  tokenToTransfer: Tokens,
  amountToTransfer: string,
  useMainnet: boolean,
  targetAddress: string,
  sdkTestnet: IconBridgeSDKType,
  sdkMainnet: IconBridgeSDKType,
  sdkContracts: ContractListType
) {
  const result: {
    iconQuery: null | JSONRPCType;
    bscQuery: null | BscParams;
    bscQuery2: null | BscParams;
    type: TxType;
  } = {
    iconQuery: null,
    bscQuery: null,
    bscQuery2: null,
    type: "",
  };

  if (
    (fromIcon && loginWallets.icon === null) ||
    (!fromIcon && loginWallets.bsc === null)
  ) {
    alert("Invalid source wallet");
    return result;
  }
  if (!targetStatus) {
    alert("invalid target address");
    return result;
  } else {
    const localSdk = useMainnet ? sdkMainnet : sdkTestnet;

    if (fromIcon) {
      // if originating chain is ICON
      if (tokenToTransfer === lib.tokenNames.icx) {
        // if token to transfer is ICX. use 'transferNativeCoin' method
        // of btp contract.
        result.iconQuery = await localSdk.icon.web.transferNativeCoin(
          targetAddress, // target bsc wallet address
          "bsc", // target chain
          loginWallets.icon, // originating icon wallet address
          amountToTransfer // amount
        );
        result.type = "transfer";
      } else {
        const contractAddress = useMainnet
          ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            sdkContracts.icon[tokenToTransfer]!.mainnet
          : // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            sdkContracts.icon[tokenToTransfer]!.testnet;

        if (lib.iconTokens.native.includes(tokenToTransfer)) {
          // if token to transfer is a native ICON token, the proccess
          // requires 2 transfers. The first one is to transfer the amount
          // of tokens to the BTP contract and then the second one is to call
          // the 'transfer' method of the BTP contract.

          result.iconQuery = await localSdk.icon.web.transferToBTSContract(
            amountToTransfer,
            contractAddress,
            loginWallets.icon
          );
          result.type = "methodCall";
        } else if (lib.iconTokens.wrapped.includes(tokenToTransfer)) {
          // if the token to transfer is an ICON wrapped token the proccess
          // requires 2 tx. the first tx is to call the 'approve' method of
          // the token contract and approve the BTP contract for the required
          // amount and the second tx is to call the 'transfer' method of the
          // btp contract.

          result.iconQuery = await localSdk.icon.web.approveBTSContract(
            amountToTransfer,
            contractAddress,
            loginWallets.icon
          );
          result.type = "methodCall";
        }
      }
    } else {
      // if !fromIcon
      if (tokenToTransfer === lib.tokenNames.bnb) {
        // if token to transfer is BNB. use 'transferNativeCoin' method
        // of btp contract.
        // const parsedAmount = lib.decimalToHex(
        //   Number(amountToTransfer) * 10 ** 18
        // );
        result.bscQuery = await localSdk.bsc.web.transferNativeCoin(
          targetAddress, // target icon wallet address
          "icon", // target chain
          loginWallets.bsc, // originating icon wallet address
          amountToTransfer // amount
          // parsedAmount // amount
        );
        result.type = "transfer";
      } else {
        const contractAddress = useMainnet
          ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            sdkContracts.bsc[tokenToTransfer]!.mainnet
          : // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            sdkContracts.bsc[tokenToTransfer]!.testnet;
        // if token to transfer is any other token besides BNB.
        // call 'approve' method on token contract

        result.bscQuery = await localSdk.bsc.web.approveTransfer(
          loginWallets.bsc, // originating icon wallet address
          amountToTransfer, // amount
          contractAddress // token contract address
        );

        const coinName = lib.getBtpCoinName(tokenToTransfer, useMainnet);
        result.bscQuery2 = await localSdk.bsc.web.transfer(
          targetAddress,
          "icon",
          loginWallets.bsc,
          amountToTransfer,
          coinName
        );
        result.type = "methodCall";
      }
    }
  }
  return result;
}

function handleOnTargetAddressChange(
  evnt: ChangeEvent<HTMLInputElement>,
  setTargetAddress: Dispatch<string>
) {
  const regex = /^[A-Za-z0-9]*$/;

  if (evnt.target.value.match(regex)) {
    setTargetAddress(evnt.target.value);
  }
}

async function dispatchSecondTx(
  tokenToTransfer: Tokens,
  fromIcon: boolean,
  useMainnet: boolean,
  amountToTransfer: string,
  targetAddress: string,
  loginWallets: WalletsObjType,
  sdkTestnet: IconBridgeSDKType,
  sdkMainnet: IconBridgeSDKType
) {
  if (typeof tokenToTransfer === "string") {
    const localSdk = useMainnet ? sdkMainnet : sdkTestnet;

    const targetChain = fromIcon ? "bsc" : "icon";
    const btpCoinName = lib.getBtpCoinName(tokenToTransfer, useMainnet);
    const query = await localSdk.icon.web.transfer(
      btpCoinName,
      amountToTransfer,
      loginWallets.icon,
      targetChain,
      targetAddress
    );
    dispatchTxEvent(query);
  }
}

type RequestResponse = {
  code: string;
  message: string;
};

async function dispatchBscTransfer(params: BscParams) {
  let response: string | null | RequestResponse = null;
  try {
    if (window != null && window.ethereum != null) {
      // eslint-disable-next-line
      response = (await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [params],
      })) as unknown as string;

      if (typeof response == "string") {
        return {
          txHash: response,
        };
      } else if (response == null) {
        return {
          txHash: "",
          failure: {
            code: "0",
            message: "Unexpected Error",
          },
        };
      } else {
        return {
          txHash: "",
          failure: response,
        };
      }
    } else {
      throw new Error('Cant find "ethereum" property on global Window');
    }
  } catch (err) {
    if (err instanceof Error) {
      console.log(err);
      return {
        txHash: "",
        failure: { code: "0", message: err.message },
      };
    }
    return {
      txHash: "",
      failure: { code: "0", message: "Unexpected Error" },
    };
  } finally {
  }
}

export const helpers = {
  dispatchTxEvent,
  handleWalletsChange,
  handleOnChainFromIcon,
  handleOnChainFromBsc,
  handleTokenSelection,
  handleAmountToTransferChange,
  handleOnNetworkChange,
  handleOnTransfer,
  handleOnTargetAddressChange,
  dispatchSecondTx,
  getIconTokensBalance,
  getBscTokensBalance,
  refundIconTokenBalance,
  dispatchBscTransfer,
};
