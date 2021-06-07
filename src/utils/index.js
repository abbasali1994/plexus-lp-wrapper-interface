// return a formatted wallet address
export const  formatAddress = (ethAddress) => {
    return ethAddress.substring(0,4).toUpperCase() + '....' + ethAddress.substring(38,42).toUpperCase()
}

export const constants = {
    inputToken: 'INPUT-TOKEN-SELECTOR',
    lpToken1: 'LP-TOKEN-1',
    lpToken2: 'LP-TOKEN-2',
    dexUni: 'Uniswap',
    dexSushi: 'Sushiswap'
}

export const tokenViewTypes = {
    inputToken: 'INPUT-TOKEN',
    selectLPPair: 'LP-PAIR-SELECT',
    supplyingLP: 'SUPPLYING-LP',
    generatingLP: 'GENERATING-LP',
    selectToken: 'SELECT-TOKEN',
    inputButton: 'INPUT-BUTTON',
    generateMoreLPsButton: 'GENERATE-MORE-LPS-BUTTON',
    mainInterface: 'MAIN',
    dashboardInterface: 'DASHBOARD'
};