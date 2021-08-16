// get web3
import { getWeb3 } from './wallet';
import { constants } from '.';

// dex contract abis
import UniswapV2FactoryABI from "../helpers/abis/uniswapV2Factory.json";
import SushiFactoryABI from "../helpers/abis/sushiFactory.json";

import {
    uniV2FactoryContractAddress,
    sushiFactoryContractAddress,
  } from "../helpers/contracts";

export const numberToWei = (number, decimals) => {

    const web3 = getWeb3();
    let numberToWei = undefined;

    if(web3 !== null) {

        if(decimals === 18) {
            numberToWei = web3.utils.toWei(number);
        }
    
        if(decimals === 6) {
            numberToWei = web3.utils.toWei(number, 'mwei');
        }

    }
   
    return numberToWei;
}


export const numberFromWei = (number, decimals) => {

    const web3 = getWeb3();
    let numberFromWei = undefined;

    if(web3 !== null) {

        if(decimals === 18) {
            numberFromWei = web3.utils.fromWei(number);
        }
    
        if(decimals === 6) {
            numberFromWei = web3.utils.fromWei(number, 'mwei');
        }

    }
   
    return numberFromWei;
}

export const checkSumAddress =(address) => {
    const web3 = getWeb3();
    return web3 !== null? web3.utils.toChecksumAddress(address) : undefined;
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
