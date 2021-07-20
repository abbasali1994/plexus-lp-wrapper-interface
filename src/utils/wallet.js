import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { setWalletAddress, setWalletBalance } from "../redux/wallet";
import { resetState } from "../redux/tokens";
import store from "../store";
import { getAllTokens } from "./token";
import WrapperUniABI from '../helpers/abis/wrapperUniswap.json';
import { uniContractAddress } from "../helpers/contracts";

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

//web3modal if provider preexist add listener
(async () => {
  if (web3Modal.cachedProvider) {
    const provider = await web3Modal.connect();
    provider.on("accountsChanged", async (accounts) => {
      store.dispatch(setWalletAddress({ walletAddress: accounts[0] }));
      store.dispatch(resetState());
      await fetchWalletTokenBalances();
    });
  }
})();

export const connectToWallet = async () => {
  const provider = await web3Modal.connect();
  web3 = new Web3(provider);


  provider.on("accountsChanged", async (accounts) => {
    store.dispatch(setWalletAddress({ walletAddress: accounts[0] }));
    await fetchWalletTokenBalances();
  });

  return web3;
};

export const fetchWalletTokenBalances = async () => {
  //Add web3 logic to sent balnaces in payload (currently just mocks random value)
  if (web3Modal.cachedProvider) {


    getAllTokens().forEach(async (token) => {
      const tokenSymbol = token.tokenSymbol;
      const tokenAddress = token.tokenAddress
      let tokenBalance = null;
      
      if(web3 !== null) {

        if(tokenSymbol.toLowerCase() !== 'eth') {
          tokenBalance = await getTokenBalance(tokenAddress, tokenSymbol);
        } else {
          tokenBalance = await getUserETHBalance();
        }
        if( tokenBalance !== null) {
          tokenBalance =  tokenBalance > 0 ? tokenBalance.toFixed(4).replace(/\d(?=(\d{3})+\.)/g, '$&,') : tokenBalance.toFixed(2);
        }

      }

      store.dispatch(setWalletBalance({ key: tokenSymbol, balance: tokenBalance }));
      
    });

  }
    
};

const getUserETHBalance = async() => {
  
  let ethBalance = 0;

  try{
    const userAddress = (await web3.eth.getAccounts())[0];
    const tokenBalanceInWei =  await web3.eth.getBalance(userAddress);

    ethBalance = Number(web3.utils.fromWei(tokenBalanceInWei, "ether"));
  }
  catch(error) {
    console.log(error);
    ethBalance = 0;
  }

  return ethBalance;
}

const getTokenBalance = async(tokenAddress, tokenSymbol) => {
  let tokenBalance = 0;

  try {

    const uniContract = new web3.eth.Contract(WrapperUniABI, uniContractAddress);
    const userAddress = (await web3.eth.getAccounts())[0];
    const tokenBalanceInWei =  await uniContract.methods.getUserTokenBalance(userAddress, tokenAddress).call();

    if(tokenSymbol.toLowerCase() === 'usdt' || tokenSymbol.toLowerCase() === 'usdc') {
      tokenBalance = Number(tokenBalanceInWei / 1000000)
    } else{
      tokenBalance = Number(web3.utils.fromWei(tokenBalanceInWei));
    }
  
  }
  catch(error){
    console.log(error);
    tokenBalance = 0;
  }
  
	return tokenBalance;
}



export const wrapTokens = async (dex) => {
  
}
