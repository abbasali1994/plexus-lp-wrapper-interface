import Web3 from "web3";
import Web3Modal from "web3modal";
import BigNumber from "big-number";
import WalletConnectProvider from "@walletconnect/web3-provider";
import ENS, { getEnsAddress } from "@ensdomains/ensjs";
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

let web3 = null;

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
  const provider = await web3Modal.connect();
  web3 = new Web3(provider);

  const userAddress = (await web3.eth.getAccounts())[0];
  const networkId = await web3.eth.net.getId();
  console.log(networkId);
  try {
    const ens = new ENS({
      provider,
      ensAddress: getEnsAddress(networkId.toString()),
    });
    getENSName(ens, userAddress);
  } catch(e) {
    console.log(e)
  }
  
  store.dispatch(setWalletAddress({ walletAddress: userAddress }));
  if (networkId !== 1)
    store.dispatch(
      setNetworkErrors({ error: "Please Connect to Ethereum Mainnet" })
    );
  await fetchWalletTokenBalances(userAddress);
  await fetchLpTokenBalances(userAddress);
  await fetchTokenSwaps(userAddress);
  setWalletListener(provider);
  setNetworkListener(provider);
  return web3;
};

export const getWeb3 = () => web3;

export const fetchWalletTokenBalances = async (userAddress) => {
  if (web3Modal.cachedProvider) {
    const { wallet } = store.getState();
    const { balances } = wallet;
    getAllTokens().forEach(async (token) => {
      const tokenSymbol = token.symbol;
      const tokenAddress = token.address;
      const tokenDecimals = token.decimals;
      let tokenBalance = null;

      if (web3 !== null) {
        if (tokenSymbol.toLowerCase() !== "eth") {
          tokenBalance = await getTokenBalance(
            userAddress,
            tokenAddress,
            tokenDecimals
          );
        } else {
          tokenBalance = await getUserETHBalance(userAddress);
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
  if (web3Modal.cachedProvider) {
    let { lpTokens, errors } = await fetchLpTokens(userAddress);
    if (!errors.uniswap && !errors.sushiswap)
      store.dispatch(setLpTokens({ lpTokens }));

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
  if (web3Modal.cachedProvider) {
    let { userSwaps, errors } = await fetchUserTxns(userAddress);
    if (!errors.uniswap && !errors.sushiswap)
      store.dispatch(setUserSwaps({ userSwaps }));

    store.dispatch(setQueryErrors({ errors }));
  }
};

const getUserETHBalance = async (userAddress) => {
  let ethBalance = 0;

  try {
    const tokenBalanceInWei = await web3.eth.getBalance(userAddress);
    ethBalance = Number(web3.utils.fromWei(tokenBalanceInWei, "ether"));
  } catch (error) {
    console.log(error);
    ethBalance = 0;
  }

  return ethBalance;
};

const getTokenBalance = async (userAddress, tokenAddress, tokenDecimals) => {
  let tokenBalance = 0;

  try {
    const uniContract = new web3.eth.Contract(
      WrapperUniABI,
      plexusUniContractAddress
    );

    const tokenBalanceInWei = await uniContract.methods
      .getUserTokenBalance(userAddress, tokenAddress)
      .call();

    tokenBalance = numberFromWei(tokenBalanceInWei, tokenDecimals);
  } catch (error) {
    console.log(error);
    tokenBalance = 0;
  }

  return tokenBalance;
};

const getENSName = (ens, userAddress) => {
  ens.getName(userAddress).then(async ({ name }) => {
    if (name !== null) {
      let address = await ens.name(name).getAddress();
      if (userAddress.toLowerCase() !== address.toLowerCase()) name = null;
      store.dispatch(setEnsName({ ensName: name }));
    }
  });
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
    else store.dispatch(setNetworkErrors({ error: "Please Connect to Ethereum Mainnet" }));
    store.dispatch(resetState());
    store.dispatch(resetErrors());
    store.dispatch(resetTxnState());
  });
};

//web3modal if provider preexist add listener
(async () => {
  getStats();
  if (web3Modal.cachedProvider) {
    await connectToWallet();
    // store.dispatch(resetState());
    store.dispatch(resetTxnState());
  }
})();

// Other Helper Functions
export const createContract = (abi, address) => {
  return new web3.eth.Contract(abi, address);
};

export function convertAmountToString(amount, decimals) {
  let amountString = amount.toString();
  let amountDecimals = 0;
  if (amountString.split(".")[1])
    amountDecimals = amountString.split(".")[1].length;
  amount = BigNumber(
    parseInt(amount * 10 ** Math.min(amountDecimals, decimals))
  );
  amountString = pad(amount, Math.max(0, decimals - amountDecimals));
  return amountString;
}

function pad(number, length) {
  var str = "" + number;
  for (let i = 1; i <= length; i++) {
    str = str + "0";
  }
  return str;
}
