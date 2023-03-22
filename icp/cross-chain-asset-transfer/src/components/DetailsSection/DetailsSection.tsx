import { useState } from "react";
import { Hr } from "../miscItems/miscItems";
import styles from "./DetailsSection.module.css";
// import { WALLETS_INIT } from "../../helpers/helpers";
import TokenTable from "../TokenTable/TokenTable";
import type { DetailsSectionType } from "../../types";

export default function DetailsSection({
  wallets,
  iconWalletDetails,
  bscWalletDetails,
  handleTokenToRefund,
}: DetailsSectionType) {
  const [isOpen, setIsOpen] = useState(false);
  void wallets;
  void bscWalletDetails;

  function handleToggle() {
    setIsOpen((state) => {
      return !state;
    });
  }
  return (
    <div
      className={
        isOpen
          ? `${styles.detailsMain} ${styles.show}`
          : `${styles.detailsMain}`
      }
    >
      <div className={styles.header}>
        <h2>Details:</h2>
        <div
          className={
            isOpen
              ? `${styles.expandBtnContainer} ${styles.expandLess}`
              : `${styles.expandBtnContainer}`
          }
          onClick={handleToggle}
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48">
            <path
              d="m24 30.75-12-12 2.15-2.15L24 26.5l9.85-9.85L36 18.8Z"
              fill="white"
              stroke="white"
            />
          </svg>
        </div>
      </div>
      <Hr />
      <div className={styles.body}>
        <h2>ICON Wallet balance details:</h2>
        <TokenTable
          tableLabel="ICON"
          tokens={iconWalletDetails}
          handleTokenToRefund={handleTokenToRefund}
        />
        <h2>BSC Wallet balance details:</h2>
        {/* <TokenTable */}
        {/*   tableLabel="BSC" */}
        {/*   tokens={bscWalletDetails} */}
        {/*   handleTokenToRefund={handleTokenToRefund} */}
        {/* /> */}
      </div>
    </div>
  );
}
