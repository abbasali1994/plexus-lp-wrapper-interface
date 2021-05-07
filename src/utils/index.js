// return a formatted wallet address
export const  formatAddress = (ethAddress) => {
    return ethAddress.substring(0,4).toUpperCase() + '....' + ethAddress.substring(38,42).toUpperCase()
}