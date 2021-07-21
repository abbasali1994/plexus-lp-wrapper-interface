import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getTokenUSDPrices = createAsyncThunk('prices/getTokenUSDPrices', async(tokens) => {
      return fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${tokens}&vs_currencies=usd`).then((res) => 
        res.json()
      )
});

export const getGasPrices = createAsyncThunk('prices/getGasPrices', async() => {
  return fetch(`https://www.gasnow.org/api/v3/gas/price?utm_source=:plexus`).then((res) => 
    res.json()
  )
});

const pricesSlice = createSlice({
  name: "prices",
  initialState: {
    status: null,
    pricesUSD: {},
    gasPrices: {}
  },
  extraReducers: {
    [getTokenUSDPrices.pending]: (state, _action) => {
        state.status = 'loading';
    },
    [getTokenUSDPrices.fulfilled]: (state, { payload }) => {
        state.pricesUSD = payload;
        state.status = 'success';
    },
    [getTokenUSDPrices.rejected]: (state, _action) => {
        state.status = 'failed';
    },

    [getGasPrices.pending]: (state, _action) => {
        state.status = 'loading';
    },
    [getGasPrices.fulfilled]: (state, { payload }) => {
        state.gasPrices = payload.data;
        state.status = 'success';
    },
    [getGasPrices.rejected]: (state, _action) => {
        state.status = 'failed';
    },
  },
});


export default pricesSlice.reducer;