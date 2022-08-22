import { gql } from "apollo-boost";

// See more example queries on https://thegraph.com/explorer/subgraph/paulrberg/create-eth-app
const GET_TRANSFERS = gql`
  {
    nftDatas {
      id
      owner
      tokenId
      uri
      reward
    }
  }
`;

export default GET_TRANSFERS;
