import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import {
  LP_POSITION_QUERY,
  LP_TRANSACTION_RECEIVE,
  LP_TRANSACTIONS,
  LP_UNISWAPV3_STATS,
  LP_TOKENS,
  LP_TOKENS_COUNT,
  LP_PAIRS,
} from "./queries";

export const client = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3",
  cache: new InMemoryCache(),
});

export const fetchLpTokensUniV3 = async (userAddress) => {
  const { data } = await client.query({
    query: gql(LP_POSITION_QUERY),
    variables: {
      user: userAddress.toLowerCase(),
    },
  });
  if (data.positions) return data.positions;
  return [];
};

export const fetchUserSwapsUniV3 = async (userAddress) => {
  const { data } = await client.query({
    query: gql(LP_TRANSACTION_RECEIVE),
    variables: {
      user: userAddress.toLowerCase(),
    },
  });
  if (data.swaps) return data.swaps;
  return [];
};

export const fetchUserTransactionsUniV3 = async (userAddress) => {
  const { data } = await client.query({
    query: gql(LP_TRANSACTIONS),
    variables: {
      user: userAddress.toLowerCase(),
    },
  });
  if (data) return data;
  return [];
};

export const fetchUniswapV3Stat = async () => {
  const { data } = await client.query({
    query: gql(LP_UNISWAPV3_STATS),
  });
  if (data.factory) return data.factory;
  return [];
};

export const fetchUniswapV3TokensCount = async () => {
  let tokens = [];
  let count = 0;
  while (1) {
    try {
      const { data } = await client.query({
        query: gql(LP_TOKENS_COUNT),
        variables: {
          skip: count,
        },
      });
      if (data.tokens) {
        tokens.push(data.tokens);
        if (data.tokens.length < 1000) {
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

export const fetchPairsUniV3 = async () => {
  const { data } = await client.query({
    query: gql(LP_PAIRS),
  });
  if (data.pools) return data.pools;
  return [];
};

export const fetchTokensUniV3 = async () => {
  const { data } = await client.query({
    query: gql(LP_TOKENS),
  });
  if (data.tokens) return data.tokens;
  return [];
};