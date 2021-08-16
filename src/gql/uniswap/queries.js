export const LP_UNISWAP_STATS = `
  query uniswapStats {
    uniswapFactory(id: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"){
      totalVolumeUSD
      totalLiquidityUSD
      pairCount
      txCount
    }
  }
`;
