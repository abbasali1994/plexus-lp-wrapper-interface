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
          volumeUSD,
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
`

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
`

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
`

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
`

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
  `