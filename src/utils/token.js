const tokens=[
    {
        tokenName: "Ethereum", 
        tokenDisplayName: "Ethereum", 
        tokenSymbol: "eth", 
        tokenBal: 3.45612
    },
    {
        tokenName:"USDC", 
        tokenDisplayName: "USDCoin", 
        tokenSymbol: "usdc", 
        tokenBal: 0
    }, 
    {
        tokenName:"Wrapped-Bitcoin", 
        tokenDisplayName: "Wrapped BTC", 
        tokenSymbol: "wbtc", 
        tokenBal:  0
    }, 
    {
        tokenName:"Badger-Dao",
        tokenDisplayName: "Badger", 
        tokenSymbol: "badger", 
        tokenBal:  0
    }, 
    {
        tokenName:"Aave", 
        tokenDisplayName: "Aave", 
        tokenSymbol: "aave", 
        tokenBal:  0
    }, 
    {
        tokenName:"Pickle-Finance", 
        tokenDisplayName: "Pickle", 
        tokenSymbol: "pickle", 
        tokenBal:  "0.00"
    }, 
    {
        tokenName:"Sushiswap", 
        tokenDisplayName: "Sushiswap", 
        tokenSymbol: "sushi", 
        tokenBal:  "0.00"
    }, 
    {
        tokenName:"Uniswap", 
        tokenDisplayName: "Uniswap", 
        tokenSymbol: "uni", 
        tokenBal:  "0.00"
    }];


export const getAllTokens = () => {


    tokens.forEach( token => {

        let icon = null;

        try {
            icon = require(`../assets/icons/${token.tokenName.toLowerCase()}.png`).default;
        }
        catch (e) {
            try {
                icon = require(`cryptocurrency-icons/svg/color/${token.tokenSymbol}.svg`).default;
            }
            catch (e1) {
                icon = require(`cryptocurrency-icons/svg/color/generic.svg`).default;
            }
            
        }

        token.tokenIcon = icon;
    });

    return tokens;

}