import { ethers } from "ethers";
import { constants } from '.';
// dex contract abis
import UniswapV2FactoryABI from "../helpers/abis/uniswapV2Factory.json";
import SushiFactoryABI from "../helpers/abis/sushiFactory.json";

import {
    uniV2FactoryContractAddress,
    sushiFactoryContractAddress,
  } from "../helpers/contracts";

import { getEthersProvider } from "./wallet";

export const numberToWei = (number, decimals) => {

    let numberToWei = undefined;

    if(decimals === 18) {
        numberToWei = ethers.utils.parseUnits(number, `ether`);
    }

    if(decimals === 6) {
        numberToWei = ethers.utils.parseUnits(number, 'mwei');
    }

   
    return numberToWei;
}


export const numberFromWei = (number, decimals) => {

   
    let numberFromWei = undefined;

    if(decimals === 18) {
        numberFromWei = ethers.utils.formatUnits(number, `ether`);
    }

    if(decimals === 6) {
        numberFromWei = ethers.utils.formatUnits(number, 'mwei');
    }

    
    return numberFromWei;
}

export const checkSumAddress = (address) => ethers.utils.getAddress(address);


export const checkIfPairExists = async ( dex, token1Address, token2Address) => {
    let dexPairAddress = constants.ZERO_ADDRESS;
    const provider = getEthersProvider();
  
    if (provider !== null) {
      try {

        if (dex === constants.dexUni) {
            const uniV2FactoryContract = new ethers.Contract(
                uniV2FactoryContractAddress,
                UniswapV2FactoryABI,
                provider
            );
    
            const pairAddress = await uniV2FactoryContract.getPair(token1Address, token2Address);
            const uniPairExists = pairAddress === constants.ZERO_ADDRESS ? false : true;
    
            if (uniPairExists) {
                dexPairAddress = pairAddress;
            }
        }

        if (dex === constants.dexSushi) {
            const sushiFactoryContract = new ethers.Contract(
                sushiFactoryContractAddress,
                SushiFactoryABI,
                provider
            );
    
            const pairAddress = await sushiFactoryContract.getPair(token1Address, token2Address);

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
