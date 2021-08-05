import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { LP_POSITION_QUERY, LP_TRANSACTION_RECEIVE, LP_PAIR_DETAILS, LP_SUSHISWAP_STATS, LP_TOKENS, LP_TRANSACTIONS } from "./queries";

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

export const fetchSushiStat = async () => {
  const { data } = await client.query({
    query: gql(LP_SUSHISWAP_STATS),
  });
  if (data.factory) return data.factory;
  return [];
};

export const fetchSushiTokensCount = async () => {
  let tokens = [];
  let count = 0;
  while (1) {
    try {
      const { data } = await client.query({
        query: gql(LP_TOKENS),
        variables: {
          skip: count,
        },
      });
      if (data.tokens) {
        tokens.push(data.tokens);
        if (data.tokens.length < 1000) {
          count += data.tokens.length;
          break;
        }
        count += data.tokens.length;
      }
    } catch (e) {
      break;
    }
  }

  return count;
};

export const fetchUserTransactions = async (userAddress) => {
  const { data } = await client.query({
    query: gql(LP_TRANSACTIONS),
    variables: {
      user: userAddress.toLowerCase(),
    },
  });
  if (data) return data;
  return [];
};
