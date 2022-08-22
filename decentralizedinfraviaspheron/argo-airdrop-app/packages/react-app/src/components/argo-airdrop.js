import React, { useEffect, useState } from "react";
import {
  Body,
  BodyMain,
  Main,
  Title,
  SubTitle,
  Text,
  List,
  ClaimButton,
  Bold,
  AccordionDiv,
  AccordionItemButtonDiv,
  AccordionItemDiv,
  FontAwesomeIconSet,
  AccordionItemPanelDiv,
  ThanksHeading,
  Line,
  Note,
} from "../styles";
import { addresses, abis } from "@project/contracts";
import { AccordionItemHeading } from "react-accessible-accordion";
import BounceLoader from "react-spinners/BounceLoader";
import "react-accessible-accordion/dist/fancy-example.css";
import { faArrowCircleDown } from "@fortawesome/free-solid-svg-icons";
import { css } from "@emotion/core";
import { MATIC_CHAIN_ID } from "../config";

const override = css`
  display: block;
  margin: 0px 0.5rem;
`;

function ArgoAirdrop({ provider }) {
  const [claimAmount, setClaimAmount] = useState(0);
  const [claimLoading, setClaimLoading] = useState(false);
  const [chain, setChain] = useState(MATIC_CHAIN_ID);

  async function getAirdropContract(web3) {
    const contract = new web3.eth.Contract(abis.airdrop, addresses.airdrop);
    return contract;
  }

  async function airdropAmount() {
    try {
      const chainId = await provider.eth.getChainId();
      setChain(Number.parseInt(chainId));
      const contract = await getAirdropContract(provider);
      const wallet = await provider.eth.getAccounts();
      console.log(contract, wallet[0]);
      var amount = await contract.methods
        .whiteListedAddresses(wallet[0])
        .call();
      console.log(amount);
      return provider.utils.fromWei(amount);
    } catch (err) {
      console.log(err);
      return 0;
    }
  }

  async function claimAirdrop() {
    try {
      setClaimLoading(true);
      const contract = await getAirdropContract(provider);
      const wallet = await provider.eth.getAccounts();
      var tx = await contract.methods.claimAirdrop().send({ from: wallet[0] });
      console.log(tx);
      setClaimLoading(false);
      startup();
      window.location.reload();
    } catch (err) {
      console.log(err);
      setClaimLoading(false);
      startup();
    }
  }

  useEffect(() => {
    if (provider) {
      startup();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider]);

  const startup = async () => {
    const claimableAmount = await airdropAmount();
    console.log(claimableAmount);
    setClaimAmount(Number.parseFloat(claimableAmount));
  };

  return (
    <Body style={{ backgroundColor: "#FEFEFE" }}>
      <BodyMain>
        <Title>Gratitude Drop!</Title>
        <SubTitle>
          WE WOULD NEVER BE HERE WITHOUT YOU! THANKS FOR THE SUPPORT!!!
        </SubTitle>
      </BodyMain>
      <Main>
        <ThanksHeading>Thanks a million! 👊</ThanksHeading>
        <Text>
          We owe you for your love, support & encouragement. Other things may
          change us but we start & stay with our family! As a small token of our
          gratitude, we are dropping <Bold>$ARGO</Bold> to anyone who:
        </Text>
        <List>
          - Is an AMA winner, Invite Campaign winner, Fun Campaign winner,
          Sticker Design Challenge winner, Meme Challenge winner, etc
        </List>
        <List>- Donated to us on Gitcoin Grants Round 9</List>
        {chain !== MATIC_CHAIN_ID && (
          <Note style={{ textAlign: "center" }}>
            Note: Current network is not supported, please switch to Matic
            Mainnet Network.
          </Note>
        )}
        <div style={{ textAlign: "center" }}>
          <ClaimButton
            onClick={claimAirdrop}
            disabled={claimAmount === 0 || chain !== MATIC_CHAIN_ID}
          >
            {!provider ? (
              "Connect Wallet"
            ) : claimLoading ? (
              <BounceLoader
                color={"#fff"}
                css={override}
                loading={claimLoading}
                size={20}
              />
            ) : (
              `Claim ${claimAmount} $ARGO`
            )}
          </ClaimButton>
        </div>
        <Line />
        <AccordionDiv allowZeroExpanded>
          <AccordionItemDiv key={0}>
            <AccordionItemHeading>
              <AccordionItemButtonDiv>
                <FontAwesomeIconSet icon={faArrowCircleDown} />
                Why Decentralized Hosting important for Web3?
              </AccordionItemButtonDiv>
            </AccordionItemHeading>
            <AccordionItemPanelDiv>
              The internet has been around for some time now. However, much of
              its fluid nature is now controlled and censored by governments and
              corporates. But nowadays the internet is in the middle of a
              revolution: centralized proprietary services are being replaced
              with decentralized solutions and monolithic services replaced with
              peer-to-peer algorithmic systems. Here comes the Decentralized
              Hosting solution, which can revolutionize how traditional web
              hosting services work. With peer-to-peer content delivery
              networks, hosting a web application now can be easily done without
              a centralized system. With the advent of Web3.0 technologies, it
              is now more than ever important to decentralize frontend
              applications without a centralized entity controlling their hosted
              site and takedown at any moment.
            </AccordionItemPanelDiv>
          </AccordionItemDiv>
          <AccordionItemDiv key={1}>
            <AccordionItemHeading>
              <AccordionItemButtonDiv>
                <FontAwesomeIconSet icon={faArrowCircleDown} />
                What is ArGo’s Solution?
              </AccordionItemButtonDiv>
            </AccordionItemHeading>
            <AccordionItemPanelDiv>
              ArGo provides a User Interface for any deployment on Arweave
              Protocol and simplifies the experience of developers to work on
              Arweave Protocol and focus on only building applications. ArGo
              provides persistent logs monitoring for deployments and helps in
              organizing their deployments on Arweave with GitHub-based
              organizations and repositories like structure. ArGo also provides
              DNS configuration for any deployment with an intuitive User
              Experience. With ArGo, users no longer have to depend on
              subscription plans of cloud provider giants, enjoy fast deployment
              via pre-rendered front-end web pages supported by multiple
              Jamstacks, and scale seamlessly without any monthly recurring
              fees. This space is 100% auditable and verifiable because all the
              deployment will be logged in the blockchain with tags to
              distinguish them.
            </AccordionItemPanelDiv>
          </AccordionItemDiv>
          <AccordionItemDiv key={2}>
            <AccordionItemHeading>
              <AccordionItemButtonDiv>
                <FontAwesomeIconSet icon={faArrowCircleDown} />
                How do I use ArGo?
              </AccordionItemButtonDiv>
            </AccordionItemHeading>
            <AccordionItemPanelDiv>
              ArGo is a web app that is hosted on{" "}
              <a
                href="https://app.argoapp.live/"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://app.argoapp.live/
              </a>
              . On the app, you can just sign up with GitHub and start deploying
              your app directly from the GitHub repository. Apart from the web
              app, we are also working on CLI for ArGo so that user can directly
              deploy their web app from their local system.
            </AccordionItemPanelDiv>
          </AccordionItemDiv>
          <AccordionItemDiv key={3}>
            <AccordionItemHeading>
              <AccordionItemButtonDiv>
                <FontAwesomeIconSet icon={faArrowCircleDown} />
                How can I use ArGo right now?
              </AccordionItemButtonDiv>
            </AccordionItemHeading>
            <AccordionItemPanelDiv>
              ArGo is currently in the Beta stage and live on{" "}
              <a
                href="https://app.argoapp.live/"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://app.argoapp.live/
              </a>
              . Anyone can use it by signing up with GitHub and start deploying
              your app directly from the GitHub repository.
            </AccordionItemPanelDiv>
          </AccordionItemDiv>
          <AccordionItemDiv key={4}>
            <AccordionItemHeading>
              <AccordionItemButtonDiv>
                <FontAwesomeIconSet icon={faArrowCircleDown} />
                What next for ArGo?
              </AccordionItemButtonDiv>
            </AccordionItemHeading>
            <AccordionItemPanelDiv>
              We are working hard to add new features and improve the user
              experience of our users. We are building our v2 which will improve
              the efficiency and stability of the entire ecosystem.
            </AccordionItemPanelDiv>
          </AccordionItemDiv>
          <AccordionItemDiv key={5}>
            <AccordionItemHeading>
              <AccordionItemButtonDiv>
                <FontAwesomeIconSet icon={faArrowCircleDown} />
                How can I keep up with ArGo?
              </AccordionItemButtonDiv>
            </AccordionItemHeading>
            <AccordionItemPanelDiv>
              Join our{" "}
              <a
                href="https://t.me/argoofficial"
                target="_blank"
                rel="noopener noreferrer"
              >
                Telegram
              </a>{" "}
              &{" "}
              <a
                href="https://discord.com/invite/ahxuCtm"
                target="_blank"
                rel="noopener noreferrer"
              >
                Discord
              </a>{" "}
              groups, Follow us on{" "}
              <a
                href="https://twitter.com/argoapplive"
                target="_blank"
                rel="noopener noreferrer"
              >
                Twitter
              </a>
              .
            </AccordionItemPanelDiv>
          </AccordionItemDiv>
        </AccordionDiv>
      </Main>
    </Body>
  );
}

export default ArgoAirdrop;
