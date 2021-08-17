import { ChainId, WETH } from "@uniswap/sdk";
import {
  UniswapPair,
  UniswapVersion,
  UniswapPairSettings,
} from "simple-uniswap-sdk";
import { SushiswapPair, SushiswapPairSettings } from "simple-sushiswap-sdk";
import { constants } from ".";

export const fetchBestRoutes = async (
  dex,
  fromToken,
  toToken,
  inputTokenAmount //string format of exact amount (not to convert in Wei)
) => {
  if (fromToken.symbol === "eth") {
    fromToken = WETH[ChainId.MAINNET];
  }
  if (toToken.symbol === "eth") {
    toToken = WETH[ChainId.MAINNET];
  }

  let pairFactory = null;
  if (dex === constants.dexUni) {
    pairFactory = await createUniswapPairFactory(fromToken, toToken);
  } else if (dex === constants.dexSushi) {
    pairFactory = await createSushiswapPairFactory(fromToken, toToken);
  }
  if (pairFactory) {
    const trade = await pairFactory.trade(inputTokenAmount);
    trade.quoteChanged$.subscribe((value) => {});
    console.log(processTradeRoutes(trade));

    return processTradeRoutes(trade); // return top 5 best trade routes
    
    /* return following values based on what you need for best trade
    return trade.routePath         //Array of token addresses representing token path
    return trade.routeText         //Array of token symbols representing token path
    return trade.routePathTokenMap //Array of token objects representing token path
    */
  }
};

const createUniswapPairFactory = async (fromToken, toToken) => {
  const pair = new UniswapPair({
    // the contract address of the token you want to convert FROM
    fromTokenContractAddress: fromToken.address,
    // the contract address of the token you want to convert TO
    toTokenContractAddress: toToken.address,
    // the ethereum address of the user using this part of the dApp
    ethereumAddress: WETH[ChainId.MAINNET].address,
    chainId: ChainId.MAINNET,
    settings: new UniswapPairSettings({
      slippage: 0.005, // represents 0.5%
      deadlineMinutes: 20,
      disableMultihops: false,
      uniswapVersions: [UniswapVersion.v2],
    }),
  });
  const pairFactory = await pair.createFactory();
  return pairFactory;
};

const createSushiswapPairFactory = async (fromToken, toToken) => {
  const pair = new SushiswapPair({
    // the contract address of the token you want to convert FROM
    fromTokenContractAddress: fromToken.address,
    // the contract address of the token you want to convert TO
    toTokenContractAddress: toToken.address,
    // the ethereum address of the user using this part of the dApp
    ethereumAddress: WETH[ChainId.MAINNET].address,
    chainId: ChainId.MAINNET,
    settings: new SushiswapPairSettings({
      slippage: 0.005, // represents 0.5%
      deadlineMinutes: 20,
      disableMultihops: false,
    }),
  });
  const pairFactory = await pair.createFactory();
  return pairFactory;
};

const processTradeRoutes = (trade) => {
  const routes = trade.allTriedRoutesQuotes;
  return routes.sort((a, b) => {
    return (
      parseFloat(b.expectedConvertQuoteOrTokenAmountInMaxWithSlippage) -
      parseFloat(a.expectedConvertQuoteOrTokenAmountInMaxWithSlippage)
    );
  }).slice(0,Math.min(routes.length,5));
};
