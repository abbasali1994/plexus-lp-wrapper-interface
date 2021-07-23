import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { setWalletAddress, setWalletBalance } from "../redux/wallet";
import { resetState } from "../redux/tokens";
import store from "../store";
import { getAllTokens } from "./token";
import WrapperUniABI from "../helpers/abis/wrapperUniswap.json";
import WrapperSushiABI from "../helpers/abis/wrapperSushi.json";
import UniswapV2FactoryABI from "../helpers/abis/uniswapV2Factory.json";
import SushiFactoryABI from "../helpers/abis/sushiFactory.json";
import { uniContractAddress,sushiContractAddress, uniV2FactoryContractAddress, sushiFactoryContractAddress } from "../helpers/contracts";
import { constants } from "./";

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
      const tokenSymbol = token.symbol;
      const tokenAddress = token.address;
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
      if(tokenBalance !== "0.00")
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


export const wrapTokens = async (dex, inputToken, inputTokenAmount, lpToken1, lpToken2, gasPrice) => {

  let res = null;

  if(web3 !== null){
    
    let wrapperContract = null;

    try {
     
      if(dex === constants.dexUni) {
        wrapperContract = new web3.eth.Contract(WrapperUniABI, uniContractAddress);
      }
      if(dex === constants.dexSushi) {
        wrapperContract = new web3.eth.Contract(WrapperSushiABI, sushiContractAddress);
      }

      let sourceTokenAddress = ZERO_ADDRESS;
      let destAddress1 = ZERO_ADDRESS;
      let destAddress2 = ZERO_ADDRESS;

      if (inputToken.symbol.toLowerCase() !== "eth") {
        sourceTokenAddress = inputToken.tokenAddress;
      }

      if (lpToken1.symbol.toLowerCase() !== "eth") {
        destAddress1 = lpToken1.address;
      }

      if (lpToken2.symbol.toLowerCase() !== "eth") {
        destAddress2 = lpToken2.address;
      }

      const destTokenAddresses = [Web3.utils.toChecksumAddress(destAddress1), Web3.utils.toChecksumAddress(destAddress2)];
      const amountToWrap = web3.utils.toWei(inputTokenAmount);

      const userAddress = (await web3.eth.getAccounts())[0];

      console.log(sourceTokenAddress);
      console.log(destTokenAddresses);
      console.log(amountToWrap);
      console.log(userAddress);

      if(sourceTokenAddress === ZERO_ADDRESS){
        res = await wrapperContract.methods.wrap(sourceTokenAddress, destTokenAddresses, amountToWrap).send({from: userAddress, value: amountToWrap});
      } else {
        res = await wrapperContract.methods.wrap(sourceTokenAddress, destTokenAddresses, amountToWrap).send({from: userAddress});
      }
      

      console.log(res);
  
    } catch (error) {
      console.log(error);
      res = null;
    }

  }

  return res;
};
  
const setWalletListener = (provider) => {
  provider.on("accountsChanged", async (accounts) => {
    store.dispatch(setWalletAddress({ walletAddress: accounts[0] }));
    store.dispatch(resetState());
    await fetchWalletTokenBalances();
  });
};
