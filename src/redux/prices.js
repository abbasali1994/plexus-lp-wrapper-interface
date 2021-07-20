import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getTokenUSDPrices = createAsyncThunk('prices/getTokenUSDPrices', async(tokens) => {
      return fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${tokens}&vs_currencies=usd`).then((res) => 
        res.json()
      )
})

const pricesSlice = createSlice({
  name: "prices",
  initialState: {
    status: null,
    pricesUSD: {}
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
  },
});


export default pricesSlice.reducer;