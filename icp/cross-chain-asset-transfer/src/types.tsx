import type { ReactNode, ChangeEventHandler, Dispatch } from "react";
// import type IconBridgeSDK from "@espanicon/icon-bridge-sdk-js";
import type lib from "./lib/lib";

export interface EspaniconSDKType {
  getTxResult: (hash: string) => Promise<QueryResult>;
  queryMethod: (
    arg1: string,
    arg2: string,
    arg3: string,
    arg4: boolean,
    arg5: string | boolean | null
  ) => Promise<QueryResult>;
}

export interface IconBridgeSDKType {
  params: {
    bscProvider: {
      hostname: string;
    };
    iconProvider: {
      hostname: string;
    };
  };
  sdkUtils: {
    contracts: ContractListType2;
  };
  icon: {
    web: {
      reclaim: (
        arg1: string,
        arg2: string,
        arg3: WalletsObjType["icon"]
      ) => Promise<JSONRPCType>;
      transferNativeCoin: (
        arg1: string,
        arg2: string,
        arg3: WalletsObjType["icon"],
        arg4: string
      ) => Promise<JSONRPCType>;
      transferToBTSContract: (
        arg1: string,
        arg2: string,
        arg3: WalletsObjType["icon"]
      ) => Promise<JSONRPCType>;
      approveBTSContract: (
        arg1: string,
        arg2: string,
        arg3: WalletsObjType["icon"]
      ) => Promise<JSONRPCType>;
      transfer: (
        arg1: string,
        arg2: string,
        arg3: WalletsObjType["icon"],
        arg4: string,
        arg5: string
      ) => Promise<JSONRPCType>;
    };
    methods: {
      balanceOf: (
        arg1: WalletsObjType["icon"],
        arg2: string
      ) => Promise<QueryType>;
    };
  };
  bsc: {
    web: {
      reclaim: (arg1: string, arg2: string, arg3: string) => Promise<BscParams>;
      transferNativeCoin: (
        arg1: string,
        arg2: string,
        arg3: WalletsObjType["bsc"],
        arg4: string
      ) => Promise<BscParams>;
      approveTransfer: (
        arg1: WalletsObjType["bsc"],
        arg2: string,
        arg3: string
      ) => Promise<BscParams>;
      transfer: (
        arg1: string,
        arg2: string,
        arg3: WalletsObjType["icon"],
        arg4: string,
        arg5: string
      ) => Promise<BscParams>;
    };
    methods: {
      balanceOf: (
        arg1: WalletsObjType["bsc"],
        arg2: string
      ) => Promise<BscBalanceOfReply>;
    };
  };
}

export type Tokens = (typeof lib.tokens)[number];

export interface CustomEventType extends Event {
  detail: {
    type: string;
    payload: string;
  };
}

declare global {
  interface WindowEventMap {
    ICONEX_RELAY_RESPONSE: CustomEventType;
  }
}

export type TokenType = {
  token: string;
  label: string;
  claiming: boolean;
  balance: {
    refundable?: string;
    locked?: string;
    usable?: string;
    userBalance?: string;
  };
};

export type WalletsType = {
  icon: string | null;
  bsc: string | null;
};

export type TokenTableType = {
  tableLabel: string;
  tokens: Array<TokenType>;
  handleTokenToRefund: (token: TokenType) => Promise<void>;
};

export type DetailsSectionType = {
  wallets: WalletsType;
  iconWalletDetails: Array<TokenType>;
  bscWalletDetails: Array<TokenType>;
  handleTokenToRefund: (token: TokenType) => Promise<void>;
};

export type ChainComponentType = {
  label: string;
  fromIcon: boolean;
  handle: ChangeEventHandler<HTMLSelectElement>;
};

export type DefaultTxResultType = {
  txHash: string;
  hash?: string;
  blockNumber?: null | string;
  failure?: {
    code: string;
    message: string;
  };
};

export type TxResultComponentType = {
  txResult: DefaultTxResultType;
  fromIcon: boolean;
};

export type WalletProps = {
  chain?: string;
  handleWalletsChange: (wallets: WalletsObjType) => void;
};

export type WalletsObjType = {
  icon?: string | null;
  bsc?: string | null;
};

export type BscLoginType = {
  handleWalletSelect: (wallet: string) => void;
};

export type IconLoginType = BscLoginType;

export type IconLoginDispatch = {
  handleWalletSelect: Dispatch<WalletsObjType>;
};

export type HandleWalletSelectType = (state: WalletsObjType) => void;

export type IconLoginDispatch2 = {
  handleWalletSelect: HandleWalletSelectType;
};

// export type IconLoginPropsTypes = IconLoginDispatch | IconLoginDispatch2;
export type IconLoginPropsTypes = IconLoginDispatch2;

export type GenericModalType = {
  isOpen: boolean;
  onClose: () => void;
  useSmall?: boolean;
  children?: ReactNode;
};

export type QueryType = {
  jsonrpc: string;
  error?: {
    code: string;
    message: string;
  };
  result?: IconBalanceOfReply;
};

export type QueryResult = {
  jsonrpc: string;
  error?: {
    code: string;
    message: string;
  };
  result?: DefaultTxResultType;
};

export type IconexResponseEvent = {
  detail: {
    type: string;
    payload: {
      result?: string;
      code?: string;
      message?: string;
    };
  };
};

export type JSONRPCType = {
  jsonrpc: string;
  method: string;
  id: number;
  params: {
    to: string;
    from?: string;
    stepLimit?: string;
    nid?: string;
    nonce?: string;
    version?: string;
    timestamp?: string;
    dataType: string;
    value?: string;
    data: {
      method: string;
      params?: {
        [key: string]: string;
      };
    };
  };
};

export type TxType = "" | "transfer" | "methodCall" | "reclaimCall";

export type BscParams = {
  to: string;
  from: string;
  gas: string;
  data: string;
  value: string;
};

export type BscBalanceOfReply = {
  _usableBalance: string;
  _lockedBalance: string;
  _refundableBalance: string;
  _userBalance: string;
  error?: {
    code: string;
    message: string;
  };
};

export type IconBalanceOfReply = {
  locked: string;
  refundable: string;
  usable: string;
  userBalance: string;
};

export type Url = {
  protocol: "https" | "http";
  hostname: string | null;
  path: string | null;
  port: string | null;
};

export type TxModalType = {
  isOpen: boolean;
  onClose: () => void;
  onClickHandler: Dispatch<boolean>;
  fromIcon: boolean;
  tokenToTransfer: string | undefined;
  transferTxResult: DefaultTxResultType | null;
  methodCallTxResult: DefaultTxResultType | null;
};

export type ContractListType = {
  [key: string]: {
    [key: string | number]: {
      mainnet: string;
      testnet: string;
    };
  };
};

export type SdkContracts = {
  icon: {
    [key: string]: {
      mainnet: string;
      testnet: string;
    };
  };
  bsc: {
    [key: string]: {
      mainnet: string;
      testnet: string;
    };
  };
};

export type ContractListType2 = {
  icon: {
    testnet: {
      [key: string]: {
        address: string;
      };
    };
    mainnet: {
      [key: string]: {
        address: string;
      };
    };
  };
  bsc: {
    testnet: {
      [key: string]: {
        address: string;
      };
    };
    mainnet: {
      [key: string]: {
        address: string;
      };
    };
  };
};
