import React from "react";
import useWeb3Modal from "./hooks/useWeb3Modal";
import "react-accessible-accordion/dist/fancy-example.css";
import Header from "./components/header";
import { Route, Redirect, Switch } from "react-router-dom";
import ArgoAirdrop from "./components/argo-airdrop";
import NftAirdrop from "./components/nft-airdrop";

function App() {
  const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();

  return (
    <div>
      <Header
        provider={provider}
        loadWeb3Modal={loadWeb3Modal}
        logoutOfWeb3Modal={logoutOfWeb3Modal}
      />

      <Switch>
        <Route
          path="/"
          exact
          render={() => {
            return <Redirect to="/token-airdrop" />
            
          }}
        />
        <Route
          path="/token-airdrop"
          exact
          render={() => {
            return (
              <ArgoAirdrop
                provider={provider}
                loadWeb3Modal={loadWeb3Modal}
                logoutOfWeb3Modal={logoutOfWeb3Modal}
              />
            );
          }}
        />
        <Route
          path="/nft-drop"
          exact
          render={() => {
            return (
              <NftAirdrop
                provider={provider}
                loadWeb3Modal={loadWeb3Modal}
                logoutOfWeb3Modal={logoutOfWeb3Modal}
              />
            );
          }}
        />
      </Switch>
    </div>
  );
}

export default App;
