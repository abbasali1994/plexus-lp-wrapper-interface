import { createSlice } from "@reduxjs/toolkit";

export const walletSlice = createSlice({
  name: "wallet",
  initialState: {
    walletAddress: null,
    balances: {},
  },
  reducers: {
    setWalletAddress: (state, { payload }) => {
      const { walletAddress } = payload;
      state.walletAddress = walletAddress;
    },
    setWalletBalance: (state, { payload }) => {
      const { key } = payload;
      if(!state.balances[key]) state.balances[key] = {}
      state.balances[key] = payload;
    },
    setWalletUSDValue: (state, { payload }) => {
      const { key, usdValue } = payload;
      state.balances[key].usdValue = usdValue;
    },
  },
});

export const { setWalletAddress, setWalletBalance, setWalletUSDValue } =
  walletSlice.actions;

export default walletSlice.reducer;
