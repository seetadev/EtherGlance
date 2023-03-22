import type { MetaMaskInpageProvider } from "@metamask/providers";
declare module "@espanicon/icon-bridge-sdk-js";
declare module "@espanicon/espanicon-sdk";
declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider;
    // ethereum: {
    //   request: (method: string, params: string[]) => Promise<string>;
    // };
  }
}
