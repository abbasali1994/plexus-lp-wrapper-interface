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
        tokenBal:  0
    }, 
    {
        tokenName:"Sushiswap", 
        tokenDisplayName: "Sushiswap", 
        tokenSymbol: "sushi", 
        tokenBal:  0
    }, 
    {
        tokenName:"Uniswap", 
        tokenDisplayName: "Uniswap", 
        tokenSymbol: "uni", 
        tokenBal:  0
    },{
        tokenName: "BNB", 
        tokenDisplayName: "BinanceCoin", 
        tokenSymbol: "bnb", 
        tokenBal: 0
    },
    {
        tokenName:"Atom", 
        tokenDisplayName: "Atom", 
        tokenSymbol: "atom", 
        tokenBal: 0
    }, 
    {
        tokenName:"Bat", 
        tokenDisplayName: "Bat", 
        tokenSymbol: "bat", 
        tokenBal:  0
    }, 
    {
        tokenName:"Dai",
        tokenDisplayName: "Dai", 
        tokenSymbol: "dai", 
        tokenBal:  0
    }, 
    {
        tokenName:"Doge", 
        tokenDisplayName: "DogeCoin", 
        tokenSymbol: "doge", 
        tokenBal:  0
    }, 
    {
        tokenName:"Tron", 
        tokenDisplayName: "Tron", 
        tokenSymbol: "trx", 
        tokenBal:  0
    }, 
    {
        tokenName:"Pax-Gold", 
        tokenDisplayName: "Pax", 
        tokenSymbol: "pax", 
        tokenBal:  0
    }, 
    {
        tokenName:"USDT", 
        tokenDisplayName: "USDT", 
        tokenSymbol: "usdt", 
        tokenBal:  0
    }, 
    {
        tokenName:"Ripple", 
        tokenDisplayName: "Xmr", 
        tokenSymbol: "xmr", 
        tokenBal:  0
    }, 
    {
        tokenName:"DashCoin", 
        tokenDisplayName: "Dash", 
        tokenSymbol: "dash", 
        tokenBal:  0
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

        if(!token.tokenIcon) token.tokenIcon = icon;
    });

    return tokens;
};

