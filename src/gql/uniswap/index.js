import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { setQueryErrors } from "../../redux/errors";
import store from "../../store";
import { LP_UNISWAP_STATS } from "./queries";

export const client = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2",
  cache: new InMemoryCache(),
});

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
