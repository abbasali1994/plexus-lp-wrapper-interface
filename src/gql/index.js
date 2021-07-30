import {
  fetchLpTokens as fetchUniLPTokens,
  fetchUserSwaps as fetchUniUserSwaps,
} from "./uniswap";
import {
  fetchLpTokens as fetchSushiLPTokens,
  fetchUserSwaps as fetchSushiUserSwaps,
} from "./sushiswap";
import { getAllTokens } from "../utils/token";
const tokens = getAllTokens();

export const fetchLpTokens = async (userAddress) => {
  let Uniswap, Sushiswap;
  try {
    Uniswap = await fetchUniLPTokens(userAddress);
  } catch (e) {
    console.log(e);
    Uniswap = [];
  }
  try {
    Sushiswap = await fetchSushiLPTokens(userAddress);
  } catch (e) {
    console.log(e);
    Sushiswap = [];
  }
  return { 1: processResult(Uniswap), 0: processResult(Sushiswap) };
};

export const fetchUserSwaps = async (userAddress) => {
  let Uniswap, Sushiswap;
  try {
    Uniswap = await fetchUniUserSwaps(userAddress);
  } catch (e) {
    console.log(e);
    Uniswap = [];
  }
  try {
    Sushiswap = await fetchSushiUserSwaps(userAddress);
  } catch (e) {
    console.log(e);
    Sushiswap = [];
  }
  return { 1: processSwaps(Uniswap), 0: processSwaps(Sushiswap) };
};

const processResult = (result) => {
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
    if (liquidityTokenBalance > 0) {
      const lpTokenPrice = parseFloat(reserveUSD) / parseFloat(totalSupply);
      const lpToken1 = tokens.find((token) => token.address === token0.id);
      const token1Amount =
        ((liquidityTokenBalance / 2) * lpTokenPrice) / token0Price;

      const lpToken2 = tokens.find((token) => token.address === token1.id);
      const token2Amount =
        ((liquidityTokenBalance / 2) * lpTokenPrice) / token1Price;

      lpTokens.push({
        lpToken1: {
          ...lpToken1,
          tokenUSDValue: token0Price,
          tokenAmount: token1Amount,
        },
        lpToken2: {
          ...lpToken2,
          tokenUSDValue: token1Price,
          tokenAmount: token2Amount,
        },
        lpTokenPrice,
        liquidityTokenBalance,
      });
    }
  });
  return lpTokens;
};

const processSwaps = (result) => {
  const swaps = [];
  result.forEach((swap) => {
    let {
      transaction,
      timestamp,
      pair,
      amount0Out,
      amount1Out,
      amount1In,
      amount0In,
    } = swap;
    const { token0, token1 } = pair;
    const amountIn =
      amount1In !== "0" ? parseFloat(amount1In) : parseFloat(amount0In);
    const amountOut =
      amount1Out !== "0" ? parseFloat(amount1Out) : parseFloat(amount0Out);
    const tokenIn = amount1In !== "0" ? token1 : token0;
    const tokenOut = amount1Out !== "0" ? token1 : token0;
    swaps.push({
      action: "Swap",
      amountIn,
      amountOut,
      timestamp: parseFloat(timestamp),
      transaction,
      tokenIn,
      tokenOut,
    });
  });
  return swaps;
};
