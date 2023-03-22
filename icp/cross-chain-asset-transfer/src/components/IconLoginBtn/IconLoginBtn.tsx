import { useEffect } from "react";
import styles from "./IconLoginBtn.module.css";
import type { CustomEventType } from "../../types";

export default function IconLoginBtn({
  handleWalletSelect,
}: {
  handleWalletSelect: (wallet: string) => void;
}) {
  function handleLogin() {
    // event dispatcher for ICON wallets
    window.dispatchEvent(
      new CustomEvent("ICONEX_RELAY_REQUEST", {
        detail: {
          type: "REQUEST_ADDRESS",
        },
      })
    );
  }

  useEffect(() => {
    function iconexRelayResponseEventHandler(evnt: CustomEventType) {
      const { type, payload } = evnt.detail;

      switch (type) {
        case "RESPONSE_ADDRESS":
          handleWalletSelect(payload);
          break;
        case "CANCEL":
          console.log("ICONEX/Hana wallet selection window closed by user");
          break;
        default:
      }
    }

    // add event listener for the wallet response on wallet selection
    window.addEventListener(
      "ICONEX_RELAY_RESPONSE",
      iconexRelayResponseEventHandler
    );

    // return function to clean up event on component unmount
    return function removeCustomEventListener() {
      window.removeEventListener(
        "ICONEX_RELAY_RESPONSE",
        iconexRelayResponseEventHandler
      );
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div className={styles.btnContainer} onClick={handleLogin}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="white">
        <path d="M6 36v-3h36v3Zm0-10.5v-3h36v3ZM6 15v-3h36v3Z" />
      </svg>
      {/* <img src="menu.png" alt="menu button" /> */}
    </div>
  );
}
