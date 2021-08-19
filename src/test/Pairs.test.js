import { fetchPairs } from "../gql";
import { client as sushiClient } from "../gql/sushiswap";
import { client as uniClient } from "../gql/uniswap";
import { fetchPairsUniV3 } from "../gql/uniswapV3";

test("fetch sushiswap pair list", async () => {
  const pairList = await fetchPairs(sushiClient);
  console.log(pairList);
});

test("fetch uniswap-v2 pairs list", async () => {
  const pairList = await fetchPairs(uniClient);
  console.log(pairList);
});

test("fetch uniswap-v3 pairs list", async () => {
  const pairList = await fetchPairsUniV3();
  console.log(pairList);
});
