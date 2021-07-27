import { graphAPIEndpoints } from "./queries";

const pageResults = require("graph-results-pager");

export async function fetchLpTokens({
  block = undefined,
  timestamp = undefined,
  user_address = undefined,
} = {}) {
  if (!user_address) {
    throw new Error("sushi-data: User address undefined");
  }

  const result = await pageResults({
    api: graphAPIEndpoints.exchange_v1,
    query: {
      entity: "liquidityPositions",
      selection: {
        where: {
          user: `\\"${user_address.toLowerCase()}\\"`,
        },
        block: undefined,
      },
      properties: UserPositions.properties,
    },
  });
  if (result) return result;
  else return [];
}

const UserPositions = {
  properties: [
    "id",
    "pair { id, reserve0, reserve1, reserveUSD, token0 { id, symbol, derivedETH },token0Price,token1Price, token1 { id, symbol, derivedETH }, totalSupply }",
    "liquidityTokenBalance",
  ],

  callback(results) {
    return results.map((entry) => ({
      id: entry.id,
      pair: {
        id: entry.pair.id,
        reserve0: Number(entry.pair.reserve0),
        reserve1: Number(entry.pair.reserve1),
        reserveUSD: Number(entry.pair.reserveUSD),
        token0: {
          id: entry.pair.token0.id,
          symbol: entry.pair.token0.symbol,
          derivedETH: Number(entry.pair.token0.derivedETH),
        },
        token1: {
          id: entry.pair.token1.id,
          symbol: entry.pair.token1.symbol,
          derivedETH: Number(entry.pair.token1.derivedETH),
        },
        totalSupply: Number(entry.pair.totalSupply),
      },
      liquidityTokenBalance: Number(entry.liquidityTokenBalance),
    }));
  },
};
