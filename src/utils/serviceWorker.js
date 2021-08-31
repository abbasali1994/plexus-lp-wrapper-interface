import { schedulerFrequency } from ".";
import { getGasPrices, getTokenUSDPrices } from "../redux/prices";
import store from "../store";
import { getCoinGeckoTokenIDS } from "./token";
import { fetchTokenPrices } from "./tokenPrices";
import {
  fetchLpTokenBalances,
  fetchTokenSwaps,
  fetchWalletTokenBalances,
} from "./wallet";

// updates user balances
const refreshUserDetails = async () => {
  const { wallet } = store.getState();
  const { walletAddress } = wallet;

  if (!walletAddress) return;
  fetchWalletTokenBalances(walletAddress);
  fetchLpTokenBalances(walletAddress);
  fetchTokenSwaps(walletAddress);
};

// updates token prices
export const refreshPriceDetails = async () => {
  const tokenIds = getCoinGeckoTokenIDS();
  store.dispatch(getGasPrices());
  await store.dispatch(getTokenUSDPrices(tokenIds));
  const { prices } = store.getState();
  if (prices.coinGeckoApiStatus !== "success") {
    fetchTokenPrices();
  }
};

setInterval(() => refreshPriceDetails(), schedulerFrequency.tokenPrices);
setInterval(() => refreshUserDetails(), schedulerFrequency.userBalances);
