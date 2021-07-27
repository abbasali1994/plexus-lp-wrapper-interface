import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { LP_POSITION_QUERY } from "./queries";

const client = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2",
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
