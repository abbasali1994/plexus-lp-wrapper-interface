import { ethers } from "ethers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import store from "../store";
import { resetState } from "../redux/tokens";
import { resetTxnState } from "../redux/transactions";
import { resetErrors, setNetworkErrors, setQueryErrors } from "../redux/errors";
import {
  setWalletAddress,
  setWalletBalance,
  setLpTokens,
  setUserSwaps,
  setEnsName,
} from "../redux/wallet";

import WrapperUniABI from "../helpers/abis/wrapperUniswap.json";
import { plexusUniContractAddress } from "../helpers/contracts";
import { getAllTokens } from "./token";

import { fetchLpTokens, fetchUserTxns, fetchTokensCount } from "../gql";
import { formatAmount } from "./display";
import { fetchUniswapStat, client as uniClient } from "../gql/uniswap";
import { fetchSushiStat, client as sushiClient } from "../gql/sushiswap";
import { setDexesStats } from "../redux/dex";
import { numberFromWei } from "./webThreeUtils";

let provider = null;

const providerOptions = {
  /* See Provider Options Section */
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      infuraId: "ff43e90c13d042d6b641cab07b787fc8", // required
    },
  },
};

const web3Modal = new Web3Modal({
  network: "mainnet", // optional
  cacheProvider: true, // optional
  providerOptions, // required
});

export const connectToWallet = async () => {
  const web3Connection = await web3Modal.connect();
  provider = new ethers.providers.Web3Provider(web3Connection);
  const signer = provider.getSigner();

  const userAddress = await signer.getAddress();
  store.dispatch(setWalletAddress({ walletAddress: userAddress }));
  try {
    const ensName = await provider.lookupAddress(userAddress);

    if (ensName !== null) {
      store.dispatch(setEnsName({ ensName }));
    }
  } catch (e) {
    console.log(e);
  }
  const netinfo = await provider.getNetwork();
  const networkId = netinfo.chainId;

  if (networkId !== 1) {
    store.dispatch(
      setNetworkErrors({ error: "Please Connect to Ethereum Mainnet" })
    );
  }

  // fetch user txns using ethers.js and the subgraph
  await fetchWalletTokenBalances(userAddress);
  await fetchLpTokenBalances(userAddress);
  await fetchTokenSwaps(userAddress);
  setWalletListener(web3Connection);
  setNetworkListener(web3Connection);
};

export const getEthersProvider = () => provider;

export const fetchWalletTokenBalances = async (userAddress) => {
  if (web3Modal.cachedProvider) {
    const { wallet } = store.getState();
    const { balances } = wallet;

    getAllTokens().forEach(async (token) => {
      const tokenSymbol = token.symbol;
      const tokenAddress = token.address;
      const tokenDecimals = token.decimals;
      let tokenBalance = null;

      if (provider !== null) {
        if (tokenSymbol.toLowerCase() !== "eth") {
          tokenBalance = await getTokenBalance(
            userAddress,
            tokenAddress,
            tokenDecimals
          );
        } else {
          tokenBalance = await getUserETHBalance();
        }
        if (tokenBalance !== null) {
          if (tokenBalance !== undefined) {
            tokenBalance = Number(tokenBalance);
            tokenBalance =
              tokenBalance > 0
                ? tokenBalance.toFixed(4).replace(/\d(?=(\d{3})+\.)/g, "$&,")
                : tokenBalance.toFixed(2);
          } else {
            tokenBalance = "0.00";
          }
        }
      }

      if (
        !balances[token.symbol] ||
        tokenBalance !== balances[token.symbol].balance
      ) {
        store.dispatch(
          setWalletBalance({
            key: tokenSymbol,
            balance: tokenBalance,
            address: tokenAddress,
          })
        );
      }
    });
  }
};

export const fetchLpTokenBalances = async (userAddress) => {
    let { lpTokens, errors } = await fetchLpTokens(userAddress);
    if (!errors.uniswap && !errors.sushiswap) {
      store.dispatch(setLpTokens({ lpTokens }));
    } else {
      store.dispatch(setQueryErrors({ errors }));
    }
};

export const getStats = async () => {
  let stats = {};
  let sushiStats = {};
  let uniStats = {};
  let tokensCount = 0;
  stats = await fetchSushiStat();
  tokensCount = await fetchTokensCount(sushiClient);
  sushiStats = {
    tokensCount: formatAmount(tokensCount),
    pairCount: formatAmount(stats.pairCount),
    totalLiquidityUSD: `$${formatAmount(stats.liquidityUSD)}`,
  };
  stats = await fetchUniswapStat();
  tokensCount = await fetchTokensCount(uniClient);
  uniStats = {
    tokensCount: formatAmount(tokensCount),
    pairCount: formatAmount(stats.pairCount),
    totalLiquidityUSD: `$${formatAmount(stats.totalLiquidityUSD)}`,
  };
  store.dispatch(setDexesStats({ sushiStats, uniStats }));
};

export const fetchTokenSwaps = async (userAddress) => {
    let { userSwaps, errors } = await fetchUserTxns(userAddress);
    if (!errors.uniswap && !errors.sushiswap)
      store.dispatch(setUserSwaps({ userSwaps }));

    store.dispatch(setQueryErrors({ errors }));
};

const getUserETHBalance = async () => {
  let ethBalance = 0;

  if (provider !== null) {
    try {
      const signer = provider.getSigner();
      ethBalance = Number(ethers.utils.formatEther(await signer.getBalance()));
    } catch (error) {
      console.log(error);
      ethBalance = 0;
    }
  }

  return ethBalance;
};

const getTokenBalance = async (userAddress, tokenAddress, tokenDecimals) => {
  let tokenBalance = 0;

  if (provider !== null) {
    try {
      const uniContract = new ethers.Contract(
        plexusUniContractAddress,
        WrapperUniABI,
        provider
      );
      const tokenBalanceInWei = await uniContract.getUserTokenBalance(
        userAddress,
        tokenAddress
      );
      tokenBalance = numberFromWei(tokenBalanceInWei, tokenDecimals);
    } catch (error) {
      console.log(error);
      tokenBalance = 0;
    }
  }

  return tokenBalance;
};

const setWalletListener = (provider) => {
  provider.on("accountsChanged", async (accounts) => {
    store.dispatch(setWalletAddress({ walletAddress: accounts[0] }));
    store.dispatch(resetState());
    store.dispatch(resetErrors());
    store.dispatch(resetTxnState());
    await fetchWalletTokenBalances(accounts[0]);
    await fetchLpTokenBalances(accounts[0]);
    await fetchTokenSwaps(accounts[0]);
  });
};

const setNetworkListener = (provider) => {
  provider.on("chainChanged", async (networkId) => {
    console.log(networkId.toString());
    if (networkId === "0x1") store.dispatch(setNetworkErrors({ error: null }));
    else
      store.dispatch(
        setNetworkErrors({ error: "Please Connect to Ethereum Mainnet" })
      );
    store.dispatch(resetState());
    store.dispatch(resetErrors());
    store.dispatch(resetTxnState());
  });
};

//web3modal if provider preexist add listener
(async () => {
  getStats();
  if (process.env.REACT_APP_CYPRESS === "true") await mockStore();
  else if (web3Modal.cachedProvider) {
    await connectToWallet();
    // store.dispatch(resetState());
    store.dispatch(resetTxnState());
  }
})();

async function mockStore() {
  const userAddress = "0x0887e769D8B1C79DB1312Ed4535B0CDa1dd43991";
  store.dispatch(setWalletAddress({ walletAddress: userAddress }));
  store.dispatch(
    setWalletBalance({
      key: "eth",
      balance: "100",
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    })
  );
  store.dispatch(
    setWalletBalance({
      key: "usdt",
      balance: "100",
      address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
    })
  );

  await fetchLpTokenBalances(userAddress);

  await fetchTokenSwaps(userAddress);
}
