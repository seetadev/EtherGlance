import React, { useEffect, useState } from "react";
import {
  Body,
  BodyMain,
  Main,
  Title,
  SubTitle,
  Text,
  AccordionDiv,
  AccordionItemButtonDiv,
  AccordionItemDiv,
  FontAwesomeIconSet,
  AccordionItemPanelDiv,
  ThanksHeading,
  Line,
  NftGrid,
  NftItem,
  NftImage,
  NftOwner,
  NftClaimContainer,
  NftOnwerBlockie,
  NftOnwerAddress,
  NftType,
  NftClaim,
  NftClaimButton,
  NftClaimedText,
  Note,
} from "../styles";
import { addresses, abis } from "@project/contracts";
import BounceLoader from "react-spinners/BounceLoader";
import { AccordionItemHeading } from "react-accessible-accordion";
import { faArrowCircleDown, faGift } from "@fortawesome/free-solid-svg-icons";
import "react-accessible-accordion/dist/fancy-example.css";
import { css } from "@emotion/core";
import { MATIC_CHAIN_ID } from "../config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import makeBlockie from "ethereum-blockies-base64";
import GET_TRANSFERS from "../graphql/subgraph";
import { useQuery } from "@apollo/react-hooks";
import Web3 from "web3";

const override = css`
  display: block;
  margin: 0px 0.5rem;
`;

function NftAirdrop({ provider, loadWeb3Modal, logoutOfWeb3Modal }) {
  const { loading, error, data } = useQuery(GET_TRANSFERS);

  const [nfts, setNfts] = useState([]);
  const [walletAddress, setWalletAddress] = useState("");
  const [claimSet, setClaimSet] = useState(false);
  const [claimLoading, setClaimLoading] = useState(-1);
  const [chain, setChain] = useState(MATIC_CHAIN_ID);

  function shortenAddress(pAddress, pDigits = 4) {
    return `${pAddress.substring(0, pDigits + 2)}...${pAddress.substring(
      42 - pDigits
    )}`;
  }

  //nft contract functions
  async function getNftContract(web3) {
    const contract = new web3.eth.Contract(abis.nftDrop, addresses.nftDrop);
    return contract;
  }

  async function claimNftReward(id) {
    try {
      setClaimLoading(id);
      const contract = await getNftContract(provider);
      const wallet = await provider.eth.getAccounts();
      var tx = await contract.methods.claimToken(id).send({ from: wallet[0] });
      console.log(tx);
      setClaimLoading(-1);
      startup();
      window.location.reload();
    } catch (err) {
      console.log(err);
      setClaimLoading(-1);
      startup();
    }
  }

  useEffect(() => {
    if (provider && nfts.length && !claimSet) {
      startup();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider, nfts, claimSet]);

  useEffect(() => {
    if (data) {
      const nfts = data.nftDatas;
      const parsedNfts = nfts.map((n) => ({
        ...n,
        uri: JSON.parse(n.uri),
        claimed: Number.parseFloat(Web3.utils.fromWei(n.reward)),
      }));
      setNfts(parsedNfts);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const startup = async () => {
    const wallet = await provider.eth.getAccounts();
    setWalletAddress(wallet[0]);
    const chainId = await provider.eth.getChainId();
    setChain(Number.parseInt(chainId));
    const nftsSorted = nfts.sort(function(x, y) {
      return x.owner.toLowerCase() === wallet[0].toLowerCase()
        ? -1
        : y.owner.toLowerCase() === wallet[0].toLowerCase()
        ? 1
        : 0;
    });
    console.log(nftsSorted);
    setNfts(nftsSorted);
    setClaimSet(true);
  };

  const checkDisabled = (address) => {
    return (
      !walletAddress || address.toLowerCase() !== walletAddress.toLowerCase() || chain !== MATIC_CHAIN_ID
    );
  };

  return (
    <Body style={{ backgroundColor: "#FEFEFE" }}>
      <BodyMain>
        <Title>NFT Drop!</Title>
        <SubTitle>
          WE WOULD NEVER BE HERE WITHOUT YOU! THANKS FOR THE SUPPORT!!!
        </SubTitle>
      </BodyMain>
      <Main>
        <ThanksHeading>Thank You For Being You! 👊</ThanksHeading>
        <Text>
          We are honored to have you in the ArGo community. We appreciate your
          support & participation. Please claim your well-deserved $ARGO tokens
          & become a part of this amazing journey.
        </Text>
        <AccordionDiv allowZeroExpanded>
          <AccordionItemDiv key={1}>
            <AccordionItemHeading>
              <AccordionItemButtonDiv>
                <FontAwesomeIconSet icon={faArrowCircleDown} />
                Does NFT Drop contains more than just NFT?
              </AccordionItemButtonDiv>
            </AccordionItemHeading>
            <AccordionItemPanelDiv>
              Yes, Each NFT contains random amount of $ARGO tokens between 1500
              & 2000 $ARGO that can be claimed instantly by the owner of the
              NFT!!!
            </AccordionItemPanelDiv>
          </AccordionItemDiv>
          <AccordionItemDiv key={2}>
            <AccordionItemHeading>
              <AccordionItemButtonDiv>
                <FontAwesomeIconSet icon={faArrowCircleDown} />
                How to claim your $ARGO token inside the NFTs?
              </AccordionItemButtonDiv>
            </AccordionItemHeading>
            <AccordionItemPanelDiv>
              Follow this steps to claim your $ARGO token:
              <br />- Connect your metamask wallet with <b>
                Connect Wallet
              </b>{" "}
              button.
              <br />- Make sure you are on <b>Matic Mainnet</b> Chain in
              Metamask.
              <br />
              - Make sure you connect with wallet whose address you have sent to
              ArGo Team earlier.
              <br />
              - If your address is in the minted NFT's owners, you will be able
              to see your NFT in the first position.
              <br />- Make sure you have some matic token to claim $ARGO tokens,
              use Ploygon Faucet{" "}
              <a href="https://matic.supply/">https://matic.supply/</a>.<br />-
              Click on the <b>Claim Reward</b> button in your NFT.
              <br />
            </AccordionItemPanelDiv>
          </AccordionItemDiv>
          <AccordionItemDiv key={3}>
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
        <Line />
        <Text>
          You are family now. So, stay connected as we need your support in the
          future as well.
        </Text>
        <Text>
          To claim your $ARGO tokens, you need to first connect with your
          wallet.
        </Text>
        {chain !== MATIC_CHAIN_ID && (
          <Note style={{ textAlign: "center" }}>
            Note: Current network is not supported, please switch to Matic
            Mainnet Network.
          </Note>
        )}
        {!loading ? (
          <NftGrid>
            {nfts.map((n, i) => (
              <NftItem key={i}>
                <NftImage src={n.uri.image}></NftImage>
                <NftOwner>
                  <NftOnwerBlockie src={makeBlockie(n.owner)}></NftOnwerBlockie>
                  <NftOnwerAddress>
                    {shortenAddress(n.owner, 8)}
                  </NftOnwerAddress>
                </NftOwner>
                <NftClaimContainer>
                  <NftType>
                    <FontAwesomeIcon icon={faGift} /> Gifted
                  </NftType>
                  <NftClaim>
                    {provider ? (
                      !n.claimed ? (
                        <NftClaimButton
                          disabled={checkDisabled(n.owner)}
                          onClick={(e) => claimNftReward(n.id)}
                        >
                          {claimLoading === n.id ? (
                            <BounceLoader
                              color={"#fff"}
                              css={override}
                              loading={claimLoading}
                              size={20}
                            />
                          ) : (
                            `Claim Reward`
                          )}
                        </NftClaimButton>
                      ) : (
                        <NftClaimedText>
                          Claimed {n.claimed.toFixed(2)} $ARGO
                        </NftClaimedText>
                      )
                    ) : null}
                  </NftClaim>
                </NftClaimContainer>
              </NftItem>
            ))}
          </NftGrid>
        ) : null}
      </Main>
    </Body>
  );
}

export default NftAirdrop;
