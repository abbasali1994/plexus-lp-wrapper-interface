import { fetchTokens } from "../gql";
import { client as sushiClient } from "../gql/sushiswap";
import { client as uniClient } from "../gql/uniswap";
import { fetchTokensUniV3 } from "../gql/uniswapV3";

test("fetch sushiswap tokens list", async () => {
  const tokenList = await fetchTokens(sushiClient);
  console.log(tokenList);
});

test("fetch uniswap-v2 tokens list", async () => {
  const tokenList = await fetchTokens(uniClient);
  console.log(tokenList);
});

test("fetch uniswap-v3 tokens list", async () => {
  const tokenList = await fetchTokensUniV3();
  console.log(tokenList);
});
