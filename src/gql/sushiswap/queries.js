export const graphAPIEndpoints = {
  masterchef: 'https://api.thegraph.com/subgraphs/name/sushiswap/master-chef',
  bar: 'https://api.thegraph.com/subgraphs/name/sushiswap/sushi-bar',
  timelock: 'https://api.thegraph.com/subgraphs/name/sushiswap/sushi-timelock',
  maker: 'https://api.thegraph.com/subgraphs/name/sushiswap/sushi-maker',
  exchange: 'https://api.thegraph.com/subgraphs/name/sushiswap/exchange',
  exchange_v1: 'https://api.thegraph.com/subgraphs/name/jiro-ono/sushiswap-v1-exchange',
  blocklytics: 'https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks',
  lockup: 'https://api.thegraph.com/subgraphs/name/matthewlilley/lockup',
}; 

export const UserSwaps = {
  properties: [
      'id',
      'timestamp',
      'transaction',
      "pair { id, reserve0, reserve1, reserveUSD, token0 { id, symbol, derivedETH },token0Price,token1Price, token1 { id, symbol, derivedETH }, totalSupply }",
      'amount0In',
      'amount1In',
      'amount0Out',
      'amount1Out',
      'to',
      'amountUSD',
  ],
};

export const UserPositions = {
  properties: [
    "id",
    "pair { id, reserve0, reserve1, reserveUSD, token0 { id, symbol, derivedETH },token0Price,token1Price, token1 { id, symbol, derivedETH }, totalSupply }",
    "liquidityTokenBalance",
  ],
};