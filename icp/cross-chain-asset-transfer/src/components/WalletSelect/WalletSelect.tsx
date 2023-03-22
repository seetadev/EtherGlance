import { useState } from "react";
import type { ChangeEvent } from "react";
import IconLoginBtn from "../IconLoginBtn/IconLoginBtn";
import BscLoginBtn from "../BscLoginBtn/BscLoginBtn";
import styles from "./WalletSelect.module.css";
import type { WalletProps } from "../../types";

interface SetArr<T> {
  (arg: T): T;
}

function handleLoginGeneral(
  wallet: string,
  setArr: (arg: SetArr<string[]>) => void,
  setSelected: (arg: string) => void
) {
  // const { wallet, setArr, setSelected } = props;

  // update array of wallets in the options of the select component
  setArr((state: string[]) => {
    if (state.includes(wallet)) {
      return state;
    } else {
      return [...state, wallet];
    }
  });

  // updates the currently selected wallet
  setSelected(wallet);
}

export default function WalletSelect({
  chain = "icon",
  handleWalletsChange,
}: WalletProps) {
  const [selectedBscWallet, setSelectedBscWallet] = useState<null | string>(
    null
  );
  const [selectedIconWallet, setSelectedIconWallet] = useState<null | string>(
    null
  );
  const [arrIconWallets, setArrIconWallets] = useState<string[]>([]);
  const [arrBscWallets, setArrBscWallets] = useState<string[]>([]);

  const defaultStr =
    chain === "icon" ? "Select ICON Wallet" : "select BSC Wallet";

  function handleIconLogin(wallet: string) {
    handleLoginGeneral(wallet, setArrIconWallets, setSelectedIconWallet);

    // pass selected wallet to parent component
    handleWalletsChange({ icon: wallet });
  }

  function handleBscLogin(wallet: string) {
    handleLoginGeneral(wallet, setArrBscWallets, setSelectedBscWallet);

    // pass selected wallet to parent component
    handleWalletsChange({ bsc: wallet });
  }

  function handleSelectChange(
    evnt: ChangeEvent<HTMLSelectElement>,
    chain: string
  ) {
    if (chain === "icon") {
      setSelectedIconWallet(evnt.target.value);
      // pass selected wallet to parent component
      handleWalletsChange({ icon: evnt.target.value });
    } else {
      setSelectedBscWallet(evnt.target.value);
      // pass selected wallet to parent component
      handleWalletsChange({ bsc: evnt.target.value });
    }
  }

  return chain === "icon" ? (
    <WalletSelectSubComponent
      selectedWallet={selectedIconWallet}
      defaultStr={defaultStr}
      /* handleSelectChange={() => {}} */
      handleSelectChange={handleSelectChange}
      arrWallets={arrIconWallets}
      handleLogin={handleIconLogin}
      chain={chain}
    />
  ) : (
    <WalletSelectSubComponent
      selectedWallet={selectedBscWallet}
      defaultStr={defaultStr}
      handleSelectChange={handleSelectChange}
      arrWallets={arrBscWallets}
      handleLogin={handleBscLogin}
      chain={chain}
    />
  );
}

type WalletSelectSubComponentType = {
  selectedWallet: string | null;
  defaultStr: string;
  handleSelectChange: (
    evnt: ChangeEvent<HTMLSelectElement>,
    chain: string
  ) => void;
  arrWallets: string[];
  handleLogin: (wallet: string) => void;
  chain: string;
};

function WalletSelectSubComponent({
  selectedWallet,
  defaultStr,
  handleSelectChange,
  arrWallets,
  handleLogin,
  chain,
}: WalletSelectSubComponentType) {
  return (
    <div className={styles.walletSelectMain}>
      <div className={styles.walletSelectChain}>
        <p>{chain === "icon" ? "ICON:" : "BSC:"}</p>
      </div>
      <div className={styles.walletSelectMainContainer}>
        <div
          className={
            selectedWallet === null
              ? `${styles.walletSelectInputContainer} ${styles.walletSelectInputContainerRed}`
              : `${styles.walletSelectInputContainer} ${styles.walletSelectInputContainerGreen}`
          }
        >
          <select
            name={`selectList-${chain}`}
            id={`selectListIcon-${chain}`}
            className={styles.select}
            value={selectedWallet === null ? defaultStr : selectedWallet}
            onChange={(evnt) => handleSelectChange(evnt, chain)}
            placeholder={defaultStr}
          >
            {arrWallets.map((wallet, index) => {
              return (
                <option value={`${wallet}`} key={`${wallet}-${index}`}>
                  {wallet}
                </option>
              );
            })}
          </select>
        </div>
        {chain === "icon" ? (
          <IconLoginBtn handleWalletSelect={handleLogin} />
        ) : (
          <BscLoginBtn handleWalletSelect={handleLogin} />
        )}
      </div>
    </div>
  );
}
