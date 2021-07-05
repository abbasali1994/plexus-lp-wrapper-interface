import { createSlice } from "@reduxjs/toolkit";

export const walletSlice = createSlice({
  name: "wallet",
  initialState: {
    walletAddress: null,
  },
  reducers: {
    setWalletAddress: (state, { payload }) => {
      const { walletAddress } = payload;
      state.walletAddress = walletAddress;
    },
  },
});

export const { setWalletAddress } = walletSlice.actions;

export default walletSlice.reducer;
