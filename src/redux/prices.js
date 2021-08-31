import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getTokenUSDPrices = createAsyncThunk(
  "prices/getTokenUSDPrices",
  async (tokens) => {
    return fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${tokens}&vs_currencies=usd`
    ).then((res) => res.json());
  }
);

export const getGasPrices = createAsyncThunk(
  "prices/getGasPrices",
  async () => {
    return fetch(
      `https://www.gasnow.org/api/v3/gas/price?utm_source=:plexus`
    ).then((res) => res.json());
  }
);

const pricesSlice = createSlice({
  name: "prices",
  initialState: {
    coinGeckoApiStatus: null,
    gasNowStatus: null,
    pricesUSD: {},
    gasPrices: {},
  },
  reducers: {
    updateTokenPrice: (state, { payload }) => {
      console.log(payload)
      state.pricesUSD = { ...state.pricesUSD, ...payload };
    },
  },
  extraReducers: {
    [getTokenUSDPrices.pending]: (state, _action) => {
      state.coinGeckoApiStatus = "loading";
    },
    [getTokenUSDPrices.fulfilled]: (state, { payload }) => {
      state.pricesUSD = payload;
      state.coinGeckoApiStatus = "success";
    },
    [getTokenUSDPrices.rejected]: (state, _action) => {
      state.coinGeckoApiStatus = "failed";
    },

    [getGasPrices.pending]: (state, _action) => {
      state.gasNowStatus = "loading";
    },
    [getGasPrices.fulfilled]: (state, { payload }) => {
      state.gasPrices = payload.data;
      state.gasNowStatus = "success";
    },
    [getGasPrices.rejected]: (state, _action) => {
      state.gasNowStatus = "failed";
    },
  },
});

export const { updateTokenPrice } = pricesSlice.actions;

export default pricesSlice.reducer;
