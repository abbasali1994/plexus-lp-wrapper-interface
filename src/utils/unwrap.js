import {
    plexusUniContractAddress,
    plexusSushiContractAddress,
  } from "../helpers/contracts";

import { constants } from "./";
import {  numberToWei, checkSumAddress  } from "./webThreeUtils";

  // contract abi's
import WrapperUniABI from "../helpers/abis/wrapperUniswap.json";
import WrapperSushiABI from "../helpers/abis/wrapperSushi.json";


// finally get web3
import { getWeb3 } from './wallet';

// standard ERC 20 Token Abi
const abi = require("human-standard-token-abi");

export const unwrapTokens = async (
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
        .unwrap(sourceTokenAddress, destTokenAddresses, amountToWrap)
        .estimateGas({ from: userAddress, value: amountToWrap, gas: gasLimitIncrease });

        if(gas < gasLimitIncrease) {

          res = await wrapperContract.methods
          .unwrap(sourceTokenAddress, destTokenAddresses, amountToWrap)
          .send({
            from: userAddress,
            value: amountToWrap,
            gas,
            gasPrice,
          });
        }

       
      } else {

        const gas = await wrapperContract.methods
        .unwrap(sourceTokenAddress, destTokenAddresses, amountToWrap)
        .estimateGas({ from: userAddress, gas: gasLimitIncrease });

        if(gas < gasLimitIncrease) {
           
          res = await wrapperContract.methods
          .unwrap(sourceTokenAddress, destTokenAddresses, amountToWrap)
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