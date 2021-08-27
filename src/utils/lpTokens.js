import { queryUserLPTokenDetails } from "../gql";
import { client as uniClient } from "../gql/uniswap";
import { client as sushiClient } from "../gql/sushiswap";

import { constants } from ".";
import store from "../store";
import { getAllTokens, getPriceId } from "./token";

let tokens = getAllTokens();

export const calcLpTokenDetails = async (
  dex,
  lpTokenAddress,
  userAddress,
  slippagePercentage = 1
) => {
  try {
    let LpTokenDetails = await fetchLpTokensDetails(
      dex,
      lpTokenAddress,
      userAddress
    );

    let { liquidityTokenBalance, pair } = LpTokenDetails;
    console.log("LpTokenDetails", LpTokenDetails);
    let { reserveUSD, totalSupply } = pair;

    const lpTokenPrice = parseFloat(reserveUSD) / parseFloat(totalSupply);
    const liquidityTokenBalanceInUSD =
      parseFloat(lpTokenPrice) * parseFloat(liquidityTokenBalance);

    const proccesedLiquidityTokenBalanceInUSD =
      liquidityTokenBalanceInUSD * (1 - slippagePercentage / 100);
    console.log({
      proccesedLiquidityTokenBalanceInUSD, //lp token balance in USD with slippage
      liquidityTokenBalanceInUSD, //lp token balance in USD without slippage
      liquidityTokenBalance,
    });
    return {
      proccesedLiquidityTokenBalanceInUSD, //lp token balance in USD with slippage
      liquidityTokenBalanceInUSD, //lp token balance in USD without slippage
      liquidityTokenBalance,
    };
  } catch (e) {
    console.log(e);
    return {
      error: `Error calculation of Lp Token Price`,
    };
  }
};

export const calcTokenAmountsfromLiquidity = (
  liquidityTokenBalanceInUSD,
  token1,
  token2,
  slippagePercentage = 1
) => {
  try {
    const { prices } = store.getState();
    const { pricesUSD } = prices;

    const token1Price = pricesUSD[getPriceId(token1)].usd;
    const token2Price = pricesUSD[getPriceId(token2)].usd;

    const token1Amount = liquidityTokenBalanceInUSD / 2 / token1Price;
    const token2Amount = liquidityTokenBalanceInUSD / 2 / token2Price;

    const proccesedlpToken1Amount =
      token1Amount * (1 - slippagePercentage / 100);
    const proccesedlpToken2Amount =
      token2Amount * (1 - slippagePercentage / 100);

    return {
      token1Amount, //amount without slippage
      token2Amount, //amount without slippage
      proccesedlpToken1Amount, //amount with slippage
      proccesedlpToken2Amount, //amount with slippage
    };
  } catch (e) {
    console.log(e);
    return {
      error: `Error calculation of Lp Token Price`,
    };
  }
};

const fetchLpTokensDetails = async (dex, lpTokenAddress, userAddress) => {
  let LpTokenDetails = {};
  try {
    if (dex === constants.dexUni)
      LpTokenDetails = await queryUserLPTokenDetails(
        uniClient,
        lpTokenAddress,
        userAddress
      );
    else
      LpTokenDetails = await queryUserLPTokenDetails(
        sushiClient,
        lpTokenAddress,
        userAddress
      );
  } catch (e) {
    console.log(e);
  }
  return LpTokenDetails;
};

// example function call
calcLpTokenDetails(
  constants.dexSushi,
  "0xc3d03e4f041fd4cd388c549ee2a29a9e5075882f",
  "0x1825BEa9F9271b04171c51F46d10B1DFcEa0BD8C"
);

//example function call
let token1 = tokens.find((token) => token.symbol === "eth");
let token2 = tokens.find((token) => token.symbol === "dai");
console.log(calcTokenAmountsfromLiquidity(100, token1, token2));
