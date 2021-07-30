import Web3 from "web3";
import Web3Modal from "web3modal";
import BigNumber from "big-number";
import WalletConnectProvider from "@walletconnect/web3-provider";

import store from "../store";
import { resetState } from "../redux/tokens";
import { resetTxnState } from "../redux/transactions";
import { setWalletAddress, setWalletBalance, setLpTokens, setUserSwaps } from "../redux/wallet";

import WrapperUniABI from "../helpers/abis/wrapperUniswap.json";
import WrapperSushiABI from "../helpers/abis/wrapperSushi.json";
import UniswapV2FactoryABI from "../helpers/abis/uniswapV2Factory.json";
import SushiFactoryABI from "../helpers/abis/sushiFactory.json";

import { uniContractAddress, sushiContractAddress, uniV2FactoryContractAddress, sushiFactoryContractAddress } from "../helpers/contracts";
import { constants } from "./";
import { getAllTokens } from "./token";

import { fetchLpTokens, fetchUserSwaps } from "../gql";

const  abi = require('human-standard-token-abi');

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
  store.dispatch(setWalletAddress({ walletAddress: userAddress }));
  await fetchWalletTokenBalances(userAddress);
  await fetchLpTokenBalances(userAddress);
  await fetchTokenSwaps(userAddress);
  setWalletListener(provider);
  return web3;
};

export const fetchWalletTokenBalances = async (userAddress) => {
  if (web3Modal.cachedProvider) {
    const { wallet } = store.getState();
  const { balances } = wallet;
    getAllTokens().forEach(async (token) => {
      const tokenSymbol = token.symbol;
      const tokenAddress = token.address;
      let tokenBalance = null;

      if (web3 !== null) {
        if (tokenSymbol.toLowerCase() !== "eth") {
          tokenBalance = await getTokenBalance(userAddress, tokenAddress, tokenSymbol);
        } else {
          tokenBalance = await getUserETHBalance(userAddress);
        }
        if (tokenBalance !== null) {
          tokenBalance =
            tokenBalance > 0
              ? tokenBalance.toFixed(4).replace(/\d(?=(\d{3})+\.)/g, "$&,")
              : tokenBalance.toFixed(2);
        }

      }

      if(!balances[token.symbol] || tokenBalance !== balances[token.symbol].balance) {
        store.dispatch(
          setWalletBalance({ key: tokenSymbol, balance: tokenBalance, address:tokenAddress })
        );
      }
     
    });
  }
};

export const fetchLpTokenBalances = async (userAddress) => {
  if (web3Modal.cachedProvider) {
    let lpTokens = await fetchLpTokens(userAddress);
    store.dispatch(setLpTokens({lpTokens}));
  }
};

export const fetchTokenSwaps = async (userAddress) => {
  if (web3Modal.cachedProvider) {
    let userSwaps = await fetchUserSwaps(userAddress)
    store.dispatch(setUserSwaps({userSwaps}));
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

const getTokenBalance = async (userAddress, tokenAddress, tokenSymbol) => {
  let tokenBalance = 0;

  try {
    const uniContract = new web3.eth.Contract(
      WrapperUniABI,
      uniContractAddress
    );
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

  let uniPairAddress = constants.ZERO_ADDRESS;
 
  if (web3 !== null) {
    try {

      const uniV2FactoryContract = new web3.eth.Contract(
        UniswapV2FactoryABI,
        uniV2FactoryContractAddress
      );

      const pairAddress = await uniV2FactoryContract.methods.getPair(token1Address, token2Address).call();
      const uniPairExists = pairAddress === constants.ZERO_ADDRESS ? false:true;

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

  let sushiPairAddress = constants.ZERO_ADDRESS;
 
  if (web3 !== null) {

    try {
      const sushiFactoryContract = new web3.eth.Contract(
        SushiFactoryABI,
        sushiFactoryContractAddress
      );

      const pairAddress = await sushiFactoryContract.methods.getPair(token1Address, token2Address).call();
      const sushiPairExists = pairAddress === constants.ZERO_ADDRESS ? false:true;

      if(sushiPairExists) {
        sushiPairAddress = pairAddress;
      }
      
    } catch (error) {
      console.log(error);
     
    }

  }
  return sushiPairAddress;
}

export const wrapTokens = async (dex, inputToken, inputTokenAmount, lpToken1, lpToken2, gasPrice, ethUSDPrice) => {

  let res = null;

  if(web3 !== null) {
    
    let wrapperContract = null;
    try {
     
      if(dex === constants.dexUni) {
        wrapperContract = new web3.eth.Contract(WrapperUniABI, uniContractAddress);
      }
      if(dex === constants.dexSushi) {
        wrapperContract = new web3.eth.Contract(WrapperSushiABI, sushiContractAddress);
      }

      let sourceTokenAddress = constants.ZERO_ADDRESS;
      const WETH_ADDRESS = constants.WETH_ADDRESS;
      let destAddress1 = constants.ZERO_ADDRESS;
      let destAddress2 = constants.ZERO_ADDRESS;

      const userAddress = (await web3.eth.getAccounts())[0];
      const block = await web3.eth.getBlock("latest");
      const gasLimit = parseInt(block.gasLimit/block.transactions.length);
      const gasLimitIncrease = gasLimit * 15;

      let amountToWrap = 0;

      if(inputToken.decimals === 18) {
        amountToWrap = web3.utils.toWei(inputTokenAmount);
      }
      if(inputToken.decimals === 6) {
        amountToWrap = String(inputTokenAmount * 1000000);
      }

      if (inputToken.symbol.toLowerCase() !== "eth") {
        sourceTokenAddress = inputToken.address;
        const wrapperContractAddress = constants.dexUni ? uniContractAddress : sushiContractAddress;
        const tokenContract = new web3.eth.Contract(abi, sourceTokenAddress);

        // check allowance for the wrapper contract for this token
        const allowance = await tokenContract.methods.allowance(userAddress, wrapperContractAddress).call();
  
        if(allowance < amountToWrap) {
          const approved = await tokenContract.methods.approve(wrapperContractAddress, amountToWrap).send({ from: userAddress, gasPrice, gas: gasLimit });
          console.log(approved);
        }

      /*   
       TODO: revist and see why this is failing
       
        if(allowance > 0 && allowance < amountToWrap) {
          let addedValue = 0;

          if(inputToken.decimals === 18){
            addedValue = web3.utils.toWei(Number(web3.utils.fromWei(amountToWrap)) - Number(web3.utils.fromWei(allowance)));
          }
          if(inputToken.decimals === 6) {
            addedValue = Number(amountToWrap) - Number(allowance);
          }
          
          console.log(addedValue);
          const allowanceIncreased = await tokenContract.methods.increaseAllowance(wrapperContractAddress, addedValue).send({ from: userAddress, gasPrice, gas: gasLimit});
          console.log(allowanceIncreased);
        } */
      }

      if (lpToken1.symbol.toLowerCase() !== "eth") {
        destAddress1 = lpToken1.address;
      } else {
        destAddress1 = WETH_ADDRESS;
      }

      if (lpToken2.symbol.toLowerCase() !== "eth") {
        destAddress2 = lpToken2.address;
      } else {
        destAddress2 = WETH_ADDRESS;
      }

      const destTokenAddresses = [Web3.utils.toChecksumAddress(destAddress1), Web3.utils.toChecksumAddress(destAddress2)];
    
      if(sourceTokenAddress === constants.ZERO_ADDRESS){
        res = await wrapperContract.methods.wrap(sourceTokenAddress, destTokenAddresses, amountToWrap).send({from: userAddress, value: amountToWrap, gas: gasLimitIncrease, gasPrice});
      } else {
        res = await wrapperContract.methods.wrap(sourceTokenAddress, destTokenAddresses, amountToWrap).send({from: userAddress, gas: gasLimitIncrease, gasPrice});
      }

      const txnHash = res.transactionHash;
      const txnGasPrice = (await web3.eth.getTransaction(txnHash)).gasPrice;
      const gasUsed = res.gasUsed;
      const networkFee = Number(txnGasPrice) * Number(gasUsed);
      let networkFeeETH = web3.utils.fromWei(String(networkFee)) ;
      let networkFeeUSD = (Number(ethUSDPrice) * Number(networkFeeETH)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
      networkFeeETH = networkFeeETH + " ETH"
      networkFeeUSD = "~$" + networkFeeUSD;

      // return the txn results
      res = { networkFeeETH, networkFeeUSD, txnHash };

    } catch (error) {
      console.log(error);
      res = error;
    }

  }

  return res;
};
  
const setWalletListener = (provider) => {
  provider.on("accountsChanged", async (accounts) => {
    store.dispatch(setWalletAddress({ walletAddress: accounts[0] }));
    store.dispatch(resetState());
    store.dispatch(resetTxnState());
    await fetchWalletTokenBalances(accounts[0]);
    await fetchLpTokenBalances(accounts[0]);
    await fetchTokenSwaps(accounts[0]);
  });
};

//web3modal if provider preexist add listener
(async () => {
  if (web3Modal.cachedProvider) {
    await connectToWallet();
    store.dispatch(resetState());
    store.dispatch(resetTxnState());
  }
})();

// Other Helper Functions
export const createContract = (abi,address) => {
  return new web3.eth.Contract(abi,address)
}

export function convertAmountToString(amount,decimals) {
  let amountString = amount.toString()
  let amountDecimals = 0;
  if(amountString.split(".")[1])
    amountDecimals = amountString.split(".")[1].length
  amount = BigNumber(parseInt(amount*(10**Math.min(amountDecimals,decimals))))
  amountString = pad(amount,Math.max(0,decimals-amountDecimals))
  return amountString
}

function pad(number, length) {
  var str = '' + number;
  for (let i=1;i <= length;i++) {
      str = str+'0';
  } 
  return str;
}
