import { constants } from "../utils"
import { calcMaxAmountOuts, fetchBestTrades } from "../utils/wallet"

const mockBestTrades = async () => {
    const token1Data ={
      name: "USDT",
      address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
      symbol: "usdt",
      decimals: 6,
    }
    const token2Data = {
      name: "USDC",
      address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      symbol: "usdc",
      decimals: 6,
    }
    const token3Data ={
      name: "PICKLE",
      address: "0x429881672b9ae42b8eba0e26cd9c73711b891ca5",
      symbol: "pickle",
      decimals: 18,
    }
    
    fetchBestTrades(constants.dexSushi,10,token1Data,token2Data)
    fetchBestTrades(constants.dexSushi,10,token3Data,token2Data)
    calcMaxAmountOuts(constants.dexUni,10,token3Data,token2Data)
    calcMaxAmountOuts(constants.dexUni,10,token1Data,token2Data)
    calcMaxAmountOuts(constants.dexSushi,10,token1Data,token2Data)
    calcMaxAmountOuts(constants.dexSushi,10,token3Data,token2Data)
  }
  
mockBestTrades();