import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { setWalletAddress, setWalletBalance } from "../redux/wallet";
import { resetState } from "../redux/tokens";
import store from "../store";
import { getAllTokens } from "./token";
import WrapperUniABI from "../helpers/abis/wrapperUniswap.json";
import UniswapV2FactoryABI from "../helpers/abis/uniswapV2Factory.json";
import SushiFactoryABI from "../helpers/abis/sushiFactory.json";
import { uniContractAddress, uniV2FactoryContractAddress, sushiFactoryContractAddress } from "../helpers/contracts";

// sdks
import { ChainId, Token, TokenAmount, Pair } from '@uniswap/sdk'




let web3 = null;
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

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

//web3modal if provider preexist add listener
(async () => {
  if (web3Modal.cachedProvider) {
    const provider = await web3Modal.connect();
    web3 = new Web3(provider);
    const userAddress = (await web3.eth.getAccounts())[0];
    store.dispatch(setWalletAddress({ walletAddress: userAddress }));
    store.dispatch(resetState());
    await fetchWalletTokenBalances();
    setWalletListener(provider);
  }
})();

export const connectToWallet = async () => {
  const provider = await web3Modal.connect();
  web3 = new Web3(provider);
  setWalletListener(provider);
  return web3;
};

export const fetchWalletTokenBalances = async () => {
  if (web3Modal.cachedProvider) {
    getAllTokens().forEach(async (token) => {
      const tokenSymbol = token.tokenSymbol;
      const tokenAddress = token.tokenAddress;
      let tokenBalance = null;
      if (web3 !== null) {
        if (tokenSymbol.toLowerCase() !== "eth") {
          tokenBalance = await getTokenBalance(tokenAddress, tokenSymbol);
        } else {
          tokenBalance = await getUserETHBalance();
        }
        if (tokenBalance !== null) {
          tokenBalance =
            tokenBalance > 0
              ? tokenBalance.toFixed(4).replace(/\d(?=(\d{3})+\.)/g, "$&,")
              : tokenBalance.toFixed(2);
        }
      }

      store.dispatch(
        setWalletBalance({ key: tokenSymbol, balance: tokenBalance, address:tokenAddress })
      );
    });
  }
};


const getUserETHBalance = async () => {
  let ethBalance = 0;

  try {
    const userAddress = (await web3.eth.getAccounts())[0];
    const tokenBalanceInWei = await web3.eth.getBalance(userAddress);

    ethBalance = Number(web3.utils.fromWei(tokenBalanceInWei, "ether"));
  } catch (error) {
    console.log(error);
    ethBalance = 0;
  }

  return ethBalance;
};

const getTokenBalance = async (tokenAddress, tokenSymbol) => {
  let tokenBalance = 0;

  try {
    const uniContract = new web3.eth.Contract(
      WrapperUniABI,
      uniContractAddress
    );
    const userAddress = (await web3.eth.getAccounts())[0];
    const tokenBalanceInWei = await uniContract.methods
      .getUserTokenBalance(userAddress, tokenAddress)
      .call();

    if (
      tokenSymbol.toLowerCase() === "usdt" ||
      tokenSymbol.toLowerCase() === "usdc"
    ) {
      tokenBalance = Number(tokenBalanceInWei / 1000000);
    } else {
      tokenBalance = Number(web3.utils.fromWei(tokenBalanceInWei));
    }
  } catch (error) {
    console.log(error);
    tokenBalance = 0;
  }
  
	return tokenBalance;
};

export const checkIfUniPairExists = async(token1Address, token2Address) => {

  let uniPairAddress = ZERO_ADDRESS;
 
  if (web3 !== null) {

    try {

      const uniV2FactoryContract = new web3.eth.Contract(
        UniswapV2FactoryABI,
        uniV2FactoryContractAddress
      );

      const pairAddress = await uniV2FactoryContract.methods.getPair(token1Address, token2Address).call();
      const uniPairExists = pairAddress === ZERO_ADDRESS ? false:true;

      if(uniPairExists) {
        uniPairAddress = pairAddress;
      }
      
      
    } catch (error) {
      console.log(error);
     
    }

  }
  return uniPairAddress;
}

export const checkIfSushiPairExists = async(token1Address, token2Address) => {

  let sushiPairAddress = ZERO_ADDRESS;
 
  if (web3 !== null) {

    try {
      const sushiFactoryContract = new web3.eth.Contract(
        SushiFactoryABI,
        sushiFactoryContractAddress
      );

      const pairAddress = await sushiFactoryContract.methods.getPair(token1Address, token2Address).call();
      const sushiPairExists = pairAddress === ZERO_ADDRESS ? false:true;

      if(sushiPairExists) {
        sushiPairAddress = pairAddress;
      }
      
    } catch (error) {
      console.log(error);
     
    }

  }
  return sushiPairAddress;
}

export const getUNILpTokens = async(lpToken1, lpToken2) => {

  const token1 = new Token(ChainId.MAINNET, '0xc0FFee0000000000000000000000000000000000', 18, 'HOT', 'Caffeine')
  const token2 = new Token(ChainId.MAINNET, '0xDeCAf00000000000000000000000000000000000', 18, 'NOT', 'Caffeine')

  const pair = new Pair(new TokenAmount(token1, '2000000000000000000'), new TokenAmount(token2, '1000000000000000000'))

  console.log(pair);

}


export const wrapTokens = async (dex) => {};
  
const setWalletListener = (provider) => {
  provider.on("accountsChanged", async (accounts) => {
    store.dispatch(setWalletAddress({ walletAddress: accounts[0] }));
    store.dispatch(resetState());
    await fetchWalletTokenBalances();
  });
};
