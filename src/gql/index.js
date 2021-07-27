import { fetchLpTokens as fetchUniLPTokens } from "./uniswap";
import { fetchLpTokens as fetchSushiLPTokens } from "./sushiswap";
import { getAllTokens } from "../utils/token";
const tokens = getAllTokens();

export const fetchLpTokens = async (userAddress) => {
  let Uniswap, Sushiswap;

  try {
    Uniswap = await fetchUniLPTokens(userAddress);
  } catch (e) {
    console.log(e)
    Uniswap = [];
  }
  try {
    Sushiswap = await fetchSushiLPTokens({user_address:userAddress});
  } catch (e) {
    console.log(e)
    Sushiswap = [];
  }
  return { 1:processResult(Uniswap), 0:processResult(Sushiswap) };
};

const processResult = (result) => {
  console.log("result",result)
  const lpTokens = [];
  result.forEach((liquidityPosition) => {
    let { pair, liquidityTokenBalance } = liquidityPosition;
    const {
      token0,
      token0Price,
      token1,
      token1Price,
      reserveUSD,
      totalSupply,
    } = pair;
    liquidityTokenBalance = parseFloat(liquidityTokenBalance);
    if(liquidityTokenBalance > 0) {
      const lpTokenPrice = parseFloat(reserveUSD) / parseFloat(totalSupply);
      const lpToken1 = tokens.find((token) => token.address === token0.id);
      const token1Amount=((liquidityTokenBalance / 2) * lpTokenPrice) / token0Price;
      
      const lpToken2 = tokens.find((token) => token.address === token1.id);
      const token2Amount=((liquidityTokenBalance / 2) * lpTokenPrice) / token1Price;
      
      lpTokens.push({
        lpToken1: { ...lpToken1, tokenUSDValue: token0Price, tokenAmount:token1Amount },
        lpToken2: { ...lpToken2, tokenUSDValue: token1Price, tokenAmount:token2Amount },
        lpTokenPrice,
        liquidityTokenBalance,
      });
    }
  });
  return lpTokens;
}
