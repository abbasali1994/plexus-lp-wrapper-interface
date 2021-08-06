import {
  fetchLpTokens as fetchUniLPTokens,
  fetchUserTransactions as fetchUniUserTransactions,
} from "./uniswap";
import {
  fetchLpTokens as fetchSushiLPTokens,
  fetchUserTransactions as fetchSushiUserTransactions,
} from "./sushiswap";
import { getAllTokens, getPriceId } from "../utils/token";
import { formatAmount } from "../utils/display";
import store from "../store";
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
    Uniswap = await fetchUniUserTransactions(userAddress);
  } catch (e) {
    console.log(e);
    Uniswap = [];
  }
  try {
    Sushiswap = await fetchSushiUserTransactions(userAddress);
  } catch (e) {
    console.log(e);
    Sushiswap = [];
  }
  return {
    1: processTransactions(Uniswap, "Uniswap-V2"),
    0: processTransactions(Sushiswap, "Sushiswap"),
  };
};

const processResult = (result) => {
  const { prices } = store.getState();
  const { pricesUSD } = prices;
  const lpTokens = [];
  result.forEach((liquidityPosition) => {
    let { pair, liquidityTokenBalance } = liquidityPosition;
    const { token0, token1, reserveUSD, totalSupply } = pair;

    liquidityTokenBalance = parseFloat(liquidityTokenBalance);
    if (liquidityTokenBalance > 0) {
      const lpTokenPrice = parseFloat(reserveUSD) / parseFloat(totalSupply);
      const lpToken1 = tokens.find((token) => token.address === token0.id);
      const lpToken2 = tokens.find((token) => token.address === token1.id);
      const lpToken1Price = pricesUSD[getPriceId(lpToken1)].usd;
      const lpToken2Price = pricesUSD[getPriceId(lpToken2)].usd;
      if (lpToken1Price && lpToken2Price) {
        const token1Amount =
          ((liquidityTokenBalance / 2) * lpTokenPrice) / lpToken1Price;
        const token2Amount =
          ((liquidityTokenBalance / 2) * lpTokenPrice) / lpToken2Price;
        lpTokens.push({
          lpToken1: {
            ...lpToken1,
            tokenUSDValue: lpToken1Price,
            tokenAmount: token1Amount,
          },
          lpToken2: {
            ...lpToken2,
            tokenUSDValue: lpToken2Price,
            tokenAmount: token2Amount,
          },
          lpTokenPrice,
          liquidityTokenBalance,
        });
      }
    }
  });
  return lpTokens;
};

const processTransactions = (result, type) => {
  const transactions = [];
  const { burns, mints, received } = result;

  burns.forEach((burn) => {
    let { transaction, timestamp, pair, liquidity } = burn;
    const { token0, token1 } = pair;
    const statement = `${formatAmount(liquidity)} ${token0.symbol}/${
      token1.symbol
    } ${type} LP Tokens`;
    transactions.push({
      action: "Unwrap",
      timestamp: parseFloat(timestamp),
      transaction,
      statement,
    });
  });
  mints.forEach((mint) => {
    let { transaction, timestamp, pair, liquidity } = mint;
    const { token0, token1 } = pair;
    const statement = `${formatAmount(liquidity)} ${token0.symbol}/${
      token1.symbol
    } ${type} LP Tokens`;
    transactions.push({
      action: "Wrap",
      timestamp: parseFloat(timestamp),
      transaction,
      statement,
    });
  });
  received.forEach((swap) => {
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
    const amountIn = amount1In !== "0" ? amount1In : amount0In;
    const amountOut = amount1Out !== "0" ? amount1Out : amount0Out;
    const tokenIn = amount1In !== "0" ? token1 : token0;
    const tokenOut = amount1Out !== "0" ? token1 : token0;
    const statement = `${formatAmount(amountIn)} ${
      tokenIn.symbol
    } to ${formatAmount(amountOut)} ${tokenOut.symbol}`;
    transactions.push({
      action: "Swap",
      timestamp: parseFloat(timestamp),
      transaction,
      statement,
    });
  });
  return transactions;
};
