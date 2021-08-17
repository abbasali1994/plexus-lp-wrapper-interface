export const LP_SUSHISWAP_STATS = `
  query sushiStats {
    factory(id: "0xc0aee478e3658e2610c5f7a4a2e1777ce9e4f2ac"){
      volumeUSD
      liquidityUSD
      pairCount
      txCount
      tokenCount
    }
  }
`;
