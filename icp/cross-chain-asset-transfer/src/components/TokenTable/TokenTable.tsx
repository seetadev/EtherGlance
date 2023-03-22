import type { TokenType, TokenTableType } from "../../types";
import { LoadingComponent } from "../miscItems/miscItems";
import styles from "./TokenTable.module.css";

function hexToDecimal(hex: string, decimals = 2) {
  const result = parseInt(hex, 16) / 10 ** 18;
  return result.toFixed(decimals);
}

export default function TokenTable({
  tableLabel,
  tokens,
  handleTokenToRefund,
}: TokenTableType) {
  void tableLabel;
  const tokensKeys = tokens.map((eachToken) => {
    void eachToken;
    try {
      return self.crypto.randomUUID();
    } catch (err) {
      console.log("error accesing randomUUID function");
      const rand = Math.random() * 100000;
      return rand.toString();
    }
  });

  function handleOnClick(token: TokenType, refundable: string) {
    if (refundable != "0x0") {
      void handleTokenToRefund(token);
    }
  }
  return (
    <div className={styles.main}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Token</th>
            <th>Locked</th>
            <th>Refundable</th>
            <th>Usable</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((eachToken, index) => {
            return (
              <tr className={styles.tableRow} key={tokensKeys[index]}>
                <td>{eachToken.token}</td>
                {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
                <td>{hexToDecimal(eachToken.balance.locked!)}</td>
                {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
                <td>{hexToDecimal(eachToken.balance.refundable!)}</td>
                {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
                <td>{hexToDecimal(eachToken.balance.usable!)}</td>
                {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
                <td>{hexToDecimal(eachToken.balance.userBalance!)}</td>
                <td>
                  <button
                    disabled={
                      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                      eachToken.balance.refundable! === "0x0" ||
                      eachToken.claiming === true
                        ? true
                        : false
                    }
                    onClick={() =>
                      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                      handleOnClick(eachToken, eachToken.balance.refundable!)
                    }
                  >
                    Refund
                  </button>
                </td>
                {eachToken.claiming ? <LoadingComponent /> : <></>}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
