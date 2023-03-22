import React from "react";
import type { BscLoginType } from "../../types";
import styles from "./BscLoginBtn.module.css";

// get ethereum scope from global window object

type ParamsType = {
  [key: string]: string;
};

type EthereumType = {
  isMetaMask: boolean;
  request: (param: {
    method: string;
    params?: ParamsType[];
  }) => Promise<string[]>;
};

type WindowType = {
  ethereum: EthereumType;
};

function isMetaMaskInstalled() {
  const { ethereum }: { ethereum: EthereumType } =
    window as unknown as WindowType;

  return Boolean(ethereum && ethereum.isMetaMask);
}

export default function BscLoginBtn({ handleWalletSelect }: BscLoginType) {
  async function loginMetaMask(): Promise<void> {
    if (!isMetaMaskInstalled) {
      alert("MetaMask is not installed");
    } else {
      try {
        const { ethereum }: { ethereum: EthereumType } =
          window as unknown as WindowType;
        await ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await ethereum.request({ method: "eth_accounts" });
        if (accounts[0] != null) {
          handleWalletSelect(accounts[0]);
        } else {
          throw new Error("Unexpected Error: invalid array of accounts");
        }
      } catch (err) {
        console.log("error connecting to metamask wallet");
        console.log(err);
        alert("Error connecting to Metamask wallet, refresh page");
      }
    }
  }

  function handleLogin() {
    void loginMetaMask();
  }

  return (
    <div className={styles.btnContainer} onClick={handleLogin}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="white">
        <path d="M6 36v-3h36v3Zm0-10.5v-3h36v3ZM6 15v-3h36v3Z" />
      </svg>
    </div>
  );
}
