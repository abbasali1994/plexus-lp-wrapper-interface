import { createSlice } from "@reduxjs/toolkit";

export const errorsSlice = createSlice({
  name: "errors",
  initialState: {
    queryErrors: {
      uniswap: null,
      sushiswap: null,
    },
    tradeError: null,
    networkError: null,
  },
  reducers: {
    setTradeErrors: (state, { payload }) => {
      const { error } = payload;
      state.tradeError = error;
    },
    setNetworkErrors: (state, { payload }) => {
      const { error } = payload;
      state.networkError = error;
    },
    setQueryErrors: (state, { payload }) => {
      const { errors } = payload;
      state.queryErrors = errors;
    },
    resetErrors: (state) => {
      state.tradeError = null;
      state.queryErrors = {
        uniswap: null,
        sushiswap: null,
      };
    },
  },
});

export const {
  setTradeErrors,
  setQueryErrors,
  setNetworkErrors,
  resetErrors,
} = errorsSlice.actions;

export default errorsSlice.reducer;
