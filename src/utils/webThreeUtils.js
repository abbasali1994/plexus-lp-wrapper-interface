// get web3
import { getWeb3 } from './wallet';

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
