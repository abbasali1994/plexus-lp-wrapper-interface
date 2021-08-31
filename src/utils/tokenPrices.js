/* eslint-disable no-undef */
import { ethers } from "ethers";
import { addresses, networks, swaps } from "../constants";
import UniswapPriceOracle from "../helpers/uniswapPriceOracle";
import { getEthersProvider } from "./wallet";
import UniswapV2FactoryABI from "../helpers/abis/uniswapV2Factory.json";
import { getAllTokens, getPriceId } from "./token";
import store from "../store";
import { updateTokenPrice } from "../redux/prices";

export const getTokenPriceInUSD = async (provider, network, token) => {
  try {
    let uniswapFactoryAddress = swaps.uniswapFactory[network];
    let usdtTokenAddress = addresses.tokens.USDT[network];

    const blockNumber = BigInt((await provider.getBlockNumber()) - 1);

    const uniV2FactoryContract = new ethers.Contract(
      uniswapFactoryAddress,
      UniswapV2FactoryABI,
      provider
    );

    const pairAddress = await uniV2FactoryContract.getPair(
      usdtTokenAddress,
      token.address
    );

    const uniswapPriceOracle = new UniswapPriceOracle(provider);
    let price = await uniswapPriceOracle.getTokenPrice(
      BigInt(pairAddress),
      BigInt(usdtTokenAddress),
      blockNumber
    );
    const denominationDecimals = 6;
    const decimals = token.decimals - denominationDecimals;
    price = (Number(price) / 2 ** 112) * 10 ** decimals;

    const tokenPrice = {};
    tokenPrice[getPriceId(token)] = { usd: price };
    return tokenPrice;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const fetchTokenPrices = async () => {
  const tokens = getAllTokens();
  const provider = getEthersProvider();
  const netinfo = await provider.getNetwork();
  const network = networks[netinfo.chainId];
  tokens.map((token) => {
    return getTokenPriceInUSD(provider, network, token).then((tokenPrice) => {
      if (tokenPrice) {
        store.dispatch(updateTokenPrice({ ...tokenPrice }));
      }
    });
  });
};
