import { schedulerFrequency } from ".";
import { getGasPrices, getTokenUSDPrices } from "../redux/prices";
import store from "../store";
import { getCoinGeckoTokenIDS } from "./token";
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
const refreshPriceDetails = async () => {
  const tokenIds = getCoinGeckoTokenIDS();

  store.dispatch(getTokenUSDPrices(tokenIds));
  store.dispatch(getGasPrices());
};

setInterval(()=>refreshPriceDetails(),schedulerFrequency.tokenPrices)
setInterval(()=>refreshUserDetails(),schedulerFrequency.userBalances)
