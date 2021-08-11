import {
    plexusUniContractAddress,
    plexusSushiContractAddress,
    uniV2FactoryContractAddress,
    sushiFactoryContractAddress,
  } from "../helpers/contracts";

import { constants } from "./";
import { numberFromWei, numberToWei, checkSumAddress  } from "./webThreeUtils";

  // contract abi's
import WrapperUniABI from "../helpers/abis/wrapperUniswap.json";
import WrapperSushiABI from "../helpers/abis/wrapperSushi.json";
import UniswapV2FactoryABI from "../helpers/abis/uniswapV2Factory.json";
import SushiFactoryABI from "../helpers/abis/sushiFactory.json";

// finally get web3
import { getWeb3 } from './wallet';

import { ChainId, Token, TokenAmount, Pair } from "@uniswap/sdk";

// standard ERC 20 Token Abi
const abi = require("human-standard-token-abi");

export const getLpTokensEstimate = async(pairAddress, tkn1, tkn2) => {

    const web3 = getWeb3();

    if (web3 !== null) {

        const { lpToken1, lpToken1Amount } = tkn1;
        const { lpToken2, lpToken2Amount } = tkn2;

        const lpTokenContract = new web3.eth.Contract(abi, checkSumAddress(pairAddress));
        const token1Contract = new web3.eth.Contract(abi, checkSumAddress (lpToken1.address));
        const token2Contract = new web3.eth.Contract(abi, checkSumAddress(lpToken2.address));

        // get the LP Token details
        const lpTokenSupply = await lpTokenContract.methods.totalSupply().call();
        const lpTokenDecimals = await lpTokenContract.methods.decimals().call();
        const lpTokenSymbol = await lpTokenContract.methods.symbol().call();
        const lpTokenName = await lpTokenContract.methods.name().call();

        const token1TotalSupply = await token1Contract.methods.totalSupply().call();
        const token2TotalSupply = await token2Contract.methods.totalSupply().call();


        const lpToken = new Token(  ChainId.MAINNET,  checkSumAddress(pairAddress),  Number(lpTokenDecimals),  lpTokenSymbol,  lpTokenName);
        const token1 = new Token(  ChainId.MAINNET,  checkSumAddress (lpToken1.address),  lpToken1.decimals,  lpToken1.symbol.toUpperCase(),  lpToken1.displayName);
        const token2 = new Token(  ChainId.MAINNET,  checkSumAddress(lpToken2.address),  18,  lpToken2.symbol.toUpperCase(),  lpToken2.displayName);

    
        console.log(lpTokenSupply);
        console.log(token1TotalSupply);
        console.log(token2TotalSupply);
        console.log(lpToken1Amount);
        console.log(lpToken2Amount);
        console.log(numberToWei(String(lpToken1Amount), lpToken1.decimals));
        console.log(numberToWei(String(lpToken2Amount), lpToken2.decimals));

       
        const token1Amount = new TokenAmount(token1, String(lpToken1Amount));
        const token2Amount = new TokenAmount(token2, String(lpToken2Amount));

        const pair = new Pair(token1Amount, token2Amount);

        console.log(lpToken);
        console.log(pair.liquidityToken);

        const lpTokenAmount =  new TokenAmount(lpToken, numberFromWei(lpTokenSupply));

        console.log(lpTokenAmount.toExact());
        console.log(token1Amount.toExact());
        console.log(token2Amount.toExact());

        const lpTokensMinted = pair.getLiquidityMinted(lpTokenAmount, token1Amount, token2Amount );

        console.log(lpTokensMinted);
        console.log(lpTokensMinted.toExact());

    }

}

export const checkIfPairExists = async ( dex, token1Address, token2Address) => {
    let dexPairAddress = constants.ZERO_ADDRESS;
    const web3 = getWeb3();
  
    if (web3 !== null) {
      try {

        if (dex === constants.dexUni) {
            const uniV2FactoryContract = new web3.eth.Contract(
                UniswapV2FactoryABI,
                uniV2FactoryContractAddress
            );
    
            const pairAddress = await uniV2FactoryContract.methods
            .getPair(token1Address, token2Address)
            .call();
            const uniPairExists = pairAddress === constants.ZERO_ADDRESS ? false : true;
    
            if (uniPairExists) {
                dexPairAddress = pairAddress;
            }
        }

        if (dex === constants.dexSushi) {
            const sushiFactoryContract = new web3.eth.Contract(
            SushiFactoryABI,
            sushiFactoryContractAddress
            );
    
            const pairAddress = await sushiFactoryContract.methods
            .getPair(token1Address, token2Address)
            .call();

            const sushiPairExists =
            pairAddress === constants.ZERO_ADDRESS ? false : true;
    
            if (sushiPairExists) {
                dexPairAddress = pairAddress;
            }
        }
       
       
      } catch (error) {
        console.log(error);
      }
    }
    return dexPairAddress;
  };
  
export const wrapTokens = async (
    dex,
    inputToken,
    inputTokenAmount,
    lpToken1,
    lpToken2,
    gasPrice,
    ethUSDPrice
  ) => {
    let res = null;

    const web3 = getWeb3();
  
    if (web3 !== null) {
      let wrapperContract = null;
      try {
        if (dex === constants.dexUni) {
          wrapperContract = new web3.eth.Contract(
            WrapperUniABI,
            plexusUniContractAddress
          );
        }
        if (dex === constants.dexSushi) {
          wrapperContract = new web3.eth.Contract(
            WrapperSushiABI,
            plexusSushiContractAddress
          );
        }
  
        let sourceTokenAddress = constants.ZERO_ADDRESS;
        const WETH_ADDRESS = constants.WETH_ADDRESS;
        let destAddress1 = constants.ZERO_ADDRESS;
        let destAddress2 = constants.ZERO_ADDRESS;
  
        const userAddress = (await web3.eth.getAccounts())[0];
        const block = await web3.eth.getBlock("latest");
        const gasLimit = parseInt(block.gasLimit / block.transactions.length);
        const gasLimitIncrease = gasLimit * 15;
        const amountToWrap = numberToWei(inputTokenAmount, inputToken.decimals);

        if (inputToken.symbol.toLowerCase() !== "eth") {
          sourceTokenAddress = inputToken.address;
          const wrapperContractAddress = constants.dexUni
            ? plexusUniContractAddress
            : plexusSushiContractAddress;
          const tokenContract = new web3.eth.Contract(abi, sourceTokenAddress);
  
          // check allowance for the wrapper contract for this token
          const allowance = await tokenContract.methods
            .allowance(userAddress, wrapperContractAddress)
            .call();
  
          if (allowance < amountToWrap) {
           
            const gas = await tokenContract.methods.approve(wrapperContractAddress, amountToWrap).estimateGas({ from: userAddress, gas:  gasLimitIncrease});

            if(gas < gasLimit) {
              const approved = await tokenContract.methods
              .approve(wrapperContractAddress, amountToWrap)
              .send({ from: userAddress, gas, gasPrice });
              console.log(approved);
            } else {
              throw  new Error("Gas limit exceeded!!");
            }
          
          
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
  
        const destTokenAddresses = [
          checkSumAddress(destAddress1),
          checkSumAddress(destAddress2),
        ];

        if (sourceTokenAddress === constants.ZERO_ADDRESS) {

          // get a better gas estimate
          const gas = await wrapperContract.methods
          .wrap(sourceTokenAddress, destTokenAddresses, amountToWrap)
          .estimateGas({ from: userAddress, value: amountToWrap, gas: gasLimitIncrease });

          if(gas < gasLimitIncrease) {

            res = await wrapperContract.methods
            .wrap(sourceTokenAddress, destTokenAddresses, amountToWrap)
            .send({
              from: userAddress,
              value: amountToWrap,
              gas,
              gasPrice,
            });
          }
  
         
        } else {

          const gas = await wrapperContract.methods
          .wrap(sourceTokenAddress, destTokenAddresses, amountToWrap)
          .estimateGas({ from: userAddress, gas: gasLimitIncrease });

          if(gas < gasLimitIncrease) {
             
            res = await wrapperContract.methods
            .wrap(sourceTokenAddress, destTokenAddresses, amountToWrap)
            .send({ from: userAddress, gas, gasPrice });
          }
         
        }
  
        const txnHash = res.transactionHash;
        const txnGasPrice = (await web3.eth.getTransaction(txnHash)).gasPrice;
        const gasUsed = res.gasUsed;
        const networkFee = Number(txnGasPrice) * Number(gasUsed);
        let networkFeeETH = web3.utils.fromWei(String(networkFee));
        let networkFeeUSD = (Number(ethUSDPrice) * Number(networkFeeETH))
          .toFixed(2)
          .replace(/\d(?=(\d{3})+\.)/g, "$&,");
        networkFeeETH = networkFeeETH + " ETH";
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
  