export const LP_POSITION_QUERY = `
  query lpPositions($user: String) {
    positions(where: {owner: $user}) {
      id,
      owner,
      pool {
        id
      }
      token0 {
        id,
        name,
        symbol
      }
      token1 {
        id,
        name,
        symbol
      }
      liquidity
    }
  }
`;

export const LP_TRANSACTIONS = `
  query transactions($user: String) {
    mints(where: { origin: $user }, orderBy: timestamp, orderDirection: desc) {
      id,
      transaction {
        id,
        blockNumber
      }
      timestamp,
      pool {
        id
      }
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
      sender,
      origin
      amount0,
      amount1,
      amountUSD
    }
    burns(where: { owner: $user }, orderBy: timestamp, orderDirection: desc) {
      id,
      transaction {
        id,
        blockNumber
      }
      timestamp,
      pool {
        id
      }
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
      owner,
      origin,
      amount0,
      amount1,
      amountUSD
    }
    received: swaps(where: { recipient: $user }, orderBy: timestamp, orderDirection: desc) {
      id,
      transaction {
        id,
        blockNumber
      }
      timestamp,
      pool {
        id
      }
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
      sender,
      recipient,
      origin
      amount0,
      amount1,
      amountUSD
    }
    sent: swaps(where: { sender: $user }, orderBy: timestamp, orderDirection: desc) {
      id,
      transaction {
        id,
        blockNumber
      }
      timestamp,
      pool {
        id
      }
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
      sender,
      recipient,
      origin
      amount0,
      amount1,
      amountUSD
    }
  }
`;

export const LP_TRANSACTION_RECEIVE = `
  query receivedTransaction($user: String) {
    swaps(where: {
      recipient: $user
    }) {
      id,
      transaction {
        id,
        blockNumber
      }
      timestamp,
      pool {
        id
      }
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
      sender,
      recipient,
      origin
      amount0,
      amount1,
      amountUSD
    }
  }
`;

export const LP_UNISWAPV3_STATS = `
  query uniswapStats {
    factory(id: "0x1F98431c8aD98523631AE4a59f267346ea31F984") {
      poolCount,
      totalVolumeUSD,
      totalValueLockedUSD,
      totalFeesUSD
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
