import { graphAPIEndpoints, UserPositions, UserSwaps } from "./queries";

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
      },
      properties: UserPositions.properties,
    },
  });
  if (result) return result;
  else return [];
}

export async function fetchUserSwaps({
  minTimestamp = undefined,
  maxTimestamp = undefined,
  minBlock = undefined,
  maxBlock = undefined,
  user_address = undefined,
  max = undefined,
} = {}) {
  if (!user_address) {
    throw new Error("sushi-data: User address undefined");
  }

  const result = await pageResults({
    api: graphAPIEndpoints.exchange_v1,
    query: {
      entity: "swaps",
      selection: {
        where: {
          sender: `\\"${user_address.toLowerCase()}\\"`,
          block_gte: minBlock || undefined,
          block_lte: maxBlock || undefined,
          timestamp_gte: minTimestamp || undefined,
          timestamp_lte: maxTimestamp || undefined,
        },
      },
      properties: UserSwaps.properties,
    },
    max,
  });
  return result;
}
