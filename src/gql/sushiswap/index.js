import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { setQueryErrors } from "../../redux/transactions";
import store from "../../store";
import { LP_SUSHISWAP_STATS } from "./queries";

export const client = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/sushiswap/exchange",
  cache: new InMemoryCache(),
});

export const fetchSushiStat = async () => {
  try {
    const { data } = await client.query({
      query: gql(LP_SUSHISWAP_STATS),
    });
    if (data.factory) return data.factory;
    return [];
  } catch (e) {
    store.dispatch(setQueryErrors({ errors: { sushiswap: e.message } }));
    return [];
  }
};
