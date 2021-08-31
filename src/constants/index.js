export const networks = {
  1: "mainnet",
  42: "kovan",
  56: "binance",
  137: "matic",
};

export const addresses = {
  tokens: {
    USDT: {
      mainnet: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      kovan: "0xf3e0d7bF58c5d455D31ef1c2d5375904dF525105",
      binance: "0x55d398326f99059ff775485246999027b3197955",
      matic: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
    },
    DAI: {
      mainnet: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      kovan: "0xfdf7f21eda1fb8aebed2fc8b0e8f72a8f17cf823",
      binance: "0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3",
      matic: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
    },
    USDC: {
      mainnet: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      kovan: "0x7079f3762805cff9c979a5bdc6f5648bcfee76c8",
      binance: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
      matic: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
    },
    WETH: {
      mainnet: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      kovan: "0xf3a6679b266899042276804930b3bfbaf807f15b",
      binance: "0x2170ed0880ac9a755fd29b2688956bd959f933f8",
      matic: "0x8cc8538d60901d19692F5ba22684732Bc28F54A3",
    },
    aDAI: {
      mainnet: "0x028171bCA77440897B824Ca71D1c56caC55b68A3",
      kovan: "0xfc54861772473cf00df8be1f5f7301bdf82020cd",
      binance: "0xbb391b4f25cad95eb29a32a3254c4bfea09716fe",
      matic: "",
    },
    FARM: {
      mainnet: "0xa0246c9032bC3A600820415aE600c6388619A14D",
      kovan: "0x616b966172708ab51aeef34b7d30d24f8af68e71",
      binance: "",
      matic: "",
      description: "Harvest.Finance: FARM Token",
    },
    PICKLE: {
      mainnet: "0x429881672B9AE42b8EbA0E26cD9C73711b891Ca5",
      kovan: "0x96c9d3e5f8899c8080d10341ab837f9c9ceb2da5",
      binance: "",
      matic: "",
      description: "PICKLE.Finance: PICKLE Token",
    },
    vBNT: {
      mainnet: "0x48Fb253446873234F2fEBbF9BdeAA72d9d387f94",
      kovan: "0x8d2e44e54ff89c255bf5e1774cd56b46f6854c26",
      binance: "",
      matic: "",
      description: "Bancor: vBNT Token",
    },
    pUNI_V2: {
      mainnet: "0x09FC573c502037B149ba87782ACC81cF093EC6ef",
      kovan: "0x09FC573c502037B149ba87782ACC81cF093EC6ef",
      binance: "",
      matic: "",
      description: "PickleJar: Pickling Uniswap V2 (pUNI-V2) Token",
    },
    UNI_V2: {
      mainnet: "0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852",
      kovan: "0x92FacdfB69427CffC1395a7e424AeA91622035Fc",
      binance: "",
      matic: "",
      description: "Uniswap V2: ETH/USDT LP (UNI-V2) Token",
    },
    SUSHI: {
      mainnet: "0x6b3595068778dd592e39a122f4f5a5cf09c90fe2",
      kovan: "",
      binance: "",
      matic: "",
      description: "",
    },
    COMP: {
      mainnet: "0xc00e94Cb662C3520282E6f5717214004A7f26888",
      kovan: "",
      binance: "",
      matic: "",
      description: "",
    },
  },
};

export const swaps = {
  uniswapRouter: {
    mainnet: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
    kovan: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
  },

  uniswapFactory: {
    mainnet: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
    kovan: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
  },

  sushiswapRouter: {
    mainnet: "0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F",
    kovan: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
  },

  sushiswapFactory: {
    mainnet: "0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac",
    kovan: "0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac",
  },

  pancakeswapRouter: {
    binance: "0x05fF2B0DB69458A0750badebc4f9e13aDd608C7F",
  },
  pancakeswapFactory: {
    binance: "0xBCfCcbde45cE874adCB698cC183deBcF17952812",
  },

  quickswapRouter: {
    matic: "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
  },
  quickswapFactory: {
    matic: "0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32",
  },
};
