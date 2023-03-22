// @ts-ignore
import lib from "../../src/lib/lib";
const assert = require("assert");

type TestType = [string, string, boolean];
const tests: TestType[] = [["ICX", "btp-0x2.icon-ICX", true]];

describe("Testing function lib.getBtpCoinName", () => {
  it("Returns a btp formatted coin name.", () => {
    const resultArray = tests.map(test => {
      console.log(
        `${test[0]} should ${test[1]}. returns ${lib.getBtpCoinName(
          test[0],
          test[2]
        )}. -- ${
          lib.getBtpCoinName(test[0], test[2]) === test[1] ? "PASS" : "FAILED"
        }`
      );
      return lib.getBtpCoinName(test[0], test[2]) === test[1]
        ? "PASS"
        : "FAILED";
    });
    assert.ok(!resultArray.includes("FAILED"));
  });
});
