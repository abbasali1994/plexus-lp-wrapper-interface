import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { LP_POSITION_QUERY, LP_TRANSACTION_RECEIVE, LP_PAIR_DETAILS } from "./queries";

const client = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/sushiswap/exchange",
  cache: new InMemoryCache(),
});
export const fetchLpTokens = async (userAddress) => {
  const { data } = await client.query({
    query: gql(LP_POSITION_QUERY),
    variables: {
      user: userAddress.toLowerCase(),
    },
  });
  if (data.user && data.user.liquidityPositions)
    return data.user.liquidityPositions;
  return [];
};

export const fetchUserSwaps = async (userAddress) => {
  const { data } = await client.query({
    query: gql(LP_TRANSACTION_RECEIVE),
    variables: {
      user: userAddress.toLowerCase(),
    },
  });
  if (data.swaps)
    return data.swaps;
  return [];
};

export const fetchPairDetails = async (pairAddress) => {
  const { data } = await client.query({
    query: gql(LP_PAIR_DETAILS),
    variables: {
      pair: pairAddress.toLowerCase(),
    },
  });
  return data.pair;
};
