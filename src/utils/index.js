// return a formatted wallet address
export const  formatAddress = (ethAddress) => {
    return ethAddress.substring(0,4).toUpperCase() + '....' + ethAddress.substring(38,42).toUpperCase()
}

export const constants = {
    outputToken: 'OUTPUT-TOKEN-SELECTOR',
    inputToken: 'INPUT-TOKEN-SELECTOR',
    lpToken1: 'LP-TOKEN-1',
    lpToken2: 'LP-TOKEN-2',
    dexUni: 'Uniswap',
    dexSushi: 'Sushiswap',
    width: {
        mobile: 1024
    }
}

export const tokenViewTypes = {
    outputToken: 'OUTPUT-TOKEN',
    remixToken: 'REMIX-TOKEN',
    inputToken: 'INPUT-TOKEN',
    selectLPPair: 'LP-PAIR-SELECT',
    supplyingLP: 'SUPPLYING-LP',
    generatingLP: 'GENERATING-LP',
    selectToken: 'SELECT-TOKEN',
    inputButton: 'INPUT-BUTTON',
    outputButton: 'OUTPUT-BUTTON',
    remixButton: 'REMIX-BUTTON',
    generateMoreLPsButton: 'GENERATE-MORE-LPS-BUTTON',
    unwrapMoreLPsButton: 'UNWRAP-MORE-LPS-BUTTON',
    remixMoreLPsButton: 'REMIX-MORE-LPS-BUTTON',
    mainInterface: 'MAIN',
    dashboardInterface: 'DASHBOARD'
};