import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { setQueryErrors } from "../../redux/transactions";
import store from "../../store";
import { LP_PAIR_DETAILS, LP_UNISWAP_STATS, LP_TOKENS } from "./queries";

export const client = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2",
  cache: new InMemoryCache(),
});

export const fetchPairDetails = async (pairAddress) => {
  try {
  const { data } = await client.query({
    query: gql(LP_PAIR_DETAILS),
    variables: {
      pair: pairAddress.toLowerCase(),
    },
  });
  if (data.pair) return data.pair;
  return null;
}catch (e) {
    store.dispatch(setQueryErrors({ errors: { uniswap: e.message } }));
    return null;
  }
};

export const fetchUniswapStat = async () => {
  try {
    const { data } = await client.query({
      query: gql(LP_UNISWAP_STATS),
    });
    if (data.uniswapFactory) return data.uniswapFactory;
    return [];
  } catch (e) {
    store.dispatch(setQueryErrors({ errors: { uniswap: e.message } }));
    return [];
  }
};

export const fetchUniswapTokensCount = async () => {
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
