export const LP_POSITION_QUERY = `
  query lpPositions($user: String) {
    user(id: $user) {
      usdSwapped,
      liquidityPositions {
        id,
        liquidityTokenBalance,
        pair {
          id,
          token0 {
            id,
            name,
            symbol
          },
          token1 {
            id,
            name,
            symbol
          },
          reserve0,
          reserve1,
          totalSupply,
          reserveETH,
          reserveUSD,
          token0Price,
          token1Price,
          volumeUSD
        }
      }
    }
  }
`;

export const LP_TRANSACTION_MINT = `
  query mintsTransaction($user: String) {
    mints(where: {
      to: $user
    }) {
      id,
      transaction {
        id,
        blockNumber
      }
      timestamp,
      pair {
        id,
        token0 {
          id,
          name,
          symbol
        },
        token1 {
          id,
          name,
          symbol
        },
        reserve0,
        reserve1,
        totalSupply,
        reserveETH,
        reserveUSD,
        token0Price,
        token1Price,
        volumeUSD
      },
      to,
      liquidity,
      sender,
      amount0,
      amount1,
      amountUSD,
      feeTo,
      feeLiquidity
    }
  }
`;

export const LP_TRANSACTION_BURN = `
  query burnsTransaction($user: String) {
    burns(where: {
      sender: $user
    }) {
      id,
      transaction {
        id,
        blockNumber
      }
      timestamp,
      pair {
        id,
        token0 {
          id,
          name,
          symbol
        },
        token1 {
          id,
          name,
          symbol
        },
        reserve0,
        reserve1,
        totalSupply,
        reserveETH,
        reserveUSD,
        token0Price,
        token1Price,
        volumeUSD
      },
      to,
      liquidity,
      sender,
      amount0,
      amount1,
      amountUSD,
      feeTo,
      feeLiquidity
    }
  }
`;

export const LP_TRANSACTION_SEND = `
  query sentTransaction($user: String) {
    swaps(where: {
      sender: $user
    }) {
      id,
      transaction {
        id,
        blockNumber
      }
      timestamp,
      pair {
        id,
        token0 {
          id,
          name,
          symbol
        },
        token1 {
          id,
          name,
          symbol
        },
        reserve0,
        reserve1,
        totalSupply,
        reserveETH,
        reserveUSD,
        token0Price,
        token1Price,
        volumeUSD
      },
      sender,
      to,
      amount0In,
      amount1In,
      amount0Out,
      amount1Out,
      amountUSD
    }
  }
`;

// export const LP_TRANSACTION_RECEIVE = `
//   query receivedTransaction($user: String) {
//     swaps(where: {
//       to: $user
//     }) {
//       id,
//       transaction {
//         id,
//         blockNumber
//       }
//       timestamp,
//       pair {
//         id,
//         token0 {
//           id,
//           name,
//           symbol
//         },
//         token1 {
//           id,
//           name,
//           symbol
//         },
//         reserve0,
//         reserve1,
//         totalSupply,
//         reserveETH,
//         reserveUSD,
//         token0Price,
//         token1Price,
//         volumeUSD
//       },
//       sender,
//       to,
//       amount0In,
//       amount1In,
//       amount0Out,
//       amount1Out,
//       amountUSD
//     }
//   }
//   `;

export const LP_PAIR_DETAILS = `
  query pairDetails($pair: String) {
    pair(id: $pair){
        id,
        token0 {
          id,
          name,
          symbol
        },
        token1 {
          id,
          name,
          symbol
        },
        reserve0,
        reserve1,
        totalSupply,
        reserveETH,
        reserveUSD,
        token0Price,
        token1Price,
        volumeUSD
      }
   }`;

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

export const LP_TOKENS = `
  query tokens($skip: Int!) {
    tokens(first: 1000, skip: $skip) {
      id
      name
      symbol
    }
  }
`;

export const LP_TRANSACTIONS = `
  query transactions($user: String) {
    mints(where: { to: $user }, orderBy: timestamp, orderDirection: desc) {
      id,
      transaction {
        id,
        blockNumber
      }
      timestamp,
      pair {
        id,
        token0 {
          id,
          name,
          symbol
        },
        token1 {
          id,
          name,
          symbol
        },
        reserve0,
        reserve1,
        totalSupply,
        reserveETH,
        reserveUSD,
        token0Price,
        token1Price,
        volumeUSD
      },
      to,
      liquidity,
      sender,
      amount0,
      amount1,
      amountUSD,
      feeTo,
      feeLiquidity
    }
    burns(where: { sender: $user }, orderBy: timestamp, orderDirection: desc) {
      id,
      transaction {
        id,
        blockNumber
      }
      timestamp,
      pair {
        id,
        token0 {
          id,
          name,
          symbol
        },
        token1 {
          id,
          name,
          symbol
        },
        reserve0,
        reserve1,
        totalSupply,
        reserveETH,
        reserveUSD,
        token0Price,
        token1Price,
        volumeUSD
      },
      to,
      liquidity,
      sender,
      amount0,
      amount1,
      amountUSD,
      feeTo,
      feeLiquidity
    }
    received: swaps(where: { to: $user }, orderBy: timestamp, orderDirection: desc) {
      id,
      transaction {
        id,
        blockNumber
      }
      timestamp,
      pair {
        id,
        token0 {
          id,
          name,
          symbol
        },
        token1 {
          id,
          name,
          symbol
        },
        reserve0,
        reserve1,
        totalSupply,
        reserveETH,
        reserveUSD,
        token0Price,
        token1Price,
        volumeUSD
      },
      sender,
      to,
      amount0In,
      amount1In,
      amount0Out,
      amount1Out,
      amountUSD
    }
    sent: swaps(where: { sender: $user }, orderBy: timestamp, orderDirection: desc) {
      id,
      transaction {
        id,
        blockNumber
      }
      timestamp,
      pair {
        id,
        token0 {
          id,
          name,
          symbol
        },
        token1 {
          id,
          name,
          symbol
        },
        reserve0,
        reserve1,
        totalSupply,
        reserveETH,
        reserveUSD,
        token0Price,
        token1Price,
        volumeUSD
      },
      sender,
      to,
      amount0In,
      amount1In,
      amount0Out,
      amount1Out,
      amountUSD
    }
  }
`;

export const LP_TRANSACTION_RECEIVE = `
  query receivedTransaction($user: String) {
    swaps(where: {
      to: $user
    }) {
      id,
      transaction {
        id,
        blockNumber
      }
      timestamp,
      pair {
        id,
        token0 {
          id,
          name,
          symbol
        },
        token1 {
          id,
          name,
          symbol
        },
        reserve0,
        reserve1,
        totalSupply,
        reserveETH,
        reserveUSD,
        token0Price,
        token1Price,
        volumeUSD
      },
      sender,
      to,
      amount0In,
      amount1In,
      amount0Out,
      amount1Out,
      amountUSD
    }
  }
`;
