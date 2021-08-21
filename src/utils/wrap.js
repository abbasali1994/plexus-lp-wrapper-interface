import { ethers } from "ethers";

import {
    plexusUniContractAddress,
    plexusSushiContractAddress
  } from "../helpers/contracts";

import { constants } from "./";
import { numberFromWei, numberToWei, checkSumAddress  } from "./webThreeUtils";

  // contract abi's
import WrapperUniABI from "../helpers/abis/wrapperUniswap.json";
import WrapperSushiABI from "../helpers/abis/wrapperSushi.json";

// uni lib imports
import { ChainId, Token, TokenAmount, Pair } from "@uniswap/sdk";

// provider
import { getEthersProvider } from './wallet';

// standard ERC 20 Token Abi
const abi = require("human-standard-token-abi");

export const getLpTokensEstimate = async(pairAddress, tkn1, tkn2) => {

    const web3 = null;

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

export const wrapTokens = async (
    dex,
    inputToken,
    inputTokenAmount,
    lpToken1,
    lpToken2,
    gasPrice,
    ethUSDPrice,
    paths,
    slippageTolerance,
    deadline
  ) => {
    
    let res = null;

    const provider = getEthersProvider();
  
    if (provider !== null) {
      let wrapperContract = null;
      const signer = provider.getSigner();

      try {
        if (dex === constants.dexUni) {
          wrapperContract = new ethers.Contract(
            plexusUniContractAddress,
            WrapperUniABI,
            signer
          );
        }
        if (dex === constants.dexSushi) {
          wrapperContract = new ethers.Contract(
            plexusSushiContractAddress,
            WrapperSushiABI,
            signer
          );
        }
  
        let sourceTokenAddress = constants.ZERO_ADDRESS;
        const WETH_ADDRESS = constants.WETH_ADDRESS;
        let destAddress1 = constants.ZERO_ADDRESS;
        let destAddress2 = constants.ZERO_ADDRESS;
  
        const userAddress =  await signer.getAddress();
        const amountToWrap = ethers.utils.parseEther(inputTokenAmount);

        if (inputToken.symbol.toLowerCase() !== "eth") {
          sourceTokenAddress = inputToken.address;
          const wrapperContractAddress = constants.dexUni? plexusUniContractAddress : plexusSushiContractAddress;
          const tokenContract = new ethers.Contract(sourceTokenAddress, abi, signer);
  
          // check allowance for the wrapper contract for this token
          let allowance = await tokenContract.allowance(userAddress, wrapperContractAddress);
          allowance = numberFromWei(allowance, inputToken.decimals);

          console.log(allowance);
          console.log(inputTokenAmount);
  
          if (allowance < inputTokenAmount) {

            const overrides = {
              from: userAddress
            };

            const approved = await(await tokenContract.approve(wrapperContractAddress, amountToWrap, overrides)).wait();
              
            console.log(approved);

             // Check conversion is successful
            if (approved.status !== 1) {
              throw  new Error("Token approval failed!!");
            }
          }
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

        // WE DO THE ACTUAL WRAPPING HERE
        // FIRST OF ALL WE MAKE SURE THE DEADLINE IS OK
        // So if the deadline is 0 we default to a 5 mins deadline
        if(deadline === 0) {
          const unixTimeInSecs = Math.floor(new Date().getTime() / 1000);
          const deadlineInSecs = 5 * 60;
          deadline = unixTimeInSecs + deadlineInSecs;
        }

        // ETH WRAPPING
        
        if (sourceTokenAddress === constants.ZERO_ADDRESS) {

          const overrides = {
            from: userAddress,
            value: amountToWrap,
           
          };

          console.log(overrides);
          console.log(sourceTokenAddress);
          console.log(destTokenAddresses);
          console.log(paths);
          console.log(amountToWrap);
          console.log(amountToWrap.toString());
          console.log(slippageTolerance);
          console.log(deadline);

          const gas = await wrapperContract
          .estimateGas
          .wrap(sourceTokenAddress, 
            destTokenAddresses, 
            paths, 
            amountToWrap, 
            slippageTolerance,
            deadline,
            overrides);

          console.log(gas);


          res = await(await wrapperContract
            .wrap(sourceTokenAddress, 
              destTokenAddresses, 
              paths, 
              amountToWrap, 
              slippageTolerance,
              deadline,
              overrides))
            .wait();
         
        } else { // ERC 20 WRAPPING

          const overrides = {
            from: userAddress,
            gasLimit: ethers.BigNumber.from("1000000")
          };

          res = await(await wrapperContract
            .wrap(sourceTokenAddress, 
              destTokenAddresses, 
              paths, 
              amountToWrap.toString(), 
              slippageTolerance,
              deadline,
              overrides))
            .wait();
         
        }

        console.log(res);
  
       /*  const txnHash = res.transactionHash;
        const txnGasPrice = (await provider.getTransaction(txnHash)).gasPrice;
        const gasUsed = res.gasUsed;
        const networkFee = Number(txnGasPrice) * Number(gasUsed);
        let networkFeeETH = web3.utils.fromWei(String(networkFee));
        let networkFeeUSD = (Number(ethUSDPrice) * Number(networkFeeETH))
          .toFixed(2)
          .replace(/\d(?=(\d{3})+\.)/g, "$&,");
        networkFeeETH = networkFeeETH + " ETH";
        networkFeeUSD = "~$" + networkFeeUSD; */
  
        // return the txn results
        //res = { networkFeeETH, networkFeeUSD, txnHash };
        
        res = {networkFeeETH:0.002, networkFeeUSD:10, txnHash:res.transactionHash}
      } catch (error) {
        console.log(error);
        res = error;
      } 
    }
  
    return res;
  };
  