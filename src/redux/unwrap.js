import { createSlice } from "@reduxjs/toolkit";
import { navigate } from "hookrouter";
import { getAllTokens } from "../utils/token";

// mock data
const tokens = getAllTokens();
const token1 = tokens.find((token) => token.symbol === "eth");
const token2 = tokens.find((token) => token.symbol === "usdc");

export const unwrapSlice = createSlice({
  name: "unwrap",
  initialState: {
    selectedLpTokenPair: null,
    lpTokenPairs: {
      0: [
        {
          lpToken1: token1,
          lpToken2: token2,
        },
        {
          lpToken1: token2,
          lpToken2: token1,
        },
      ],
      1: [],
    },
    outputToken: null,
    outputTokenValue: null,
    outputTokenValueUSD: "",
    lpToken1: null,
    lpToken1Value: null,
    lpToken2: null,
    lpToken2Value: null,
    totalLPTokens: null,
    newTotalLPTokens: null,
  },
  reducers: {
    setOutputToken: (state, action) => {
      state.outputToken = action.payload;
    },
    setSelectedLpTokenPair: (state, action) => {
      const { selectedLpTokenPair, selectedDex } = action.payload;
      state.selectedLpTokenPair = selectedLpTokenPair;
      if (selectedLpTokenPair !== null) {
        const { lpToken1, lpToken2 } =
          state.lpTokenPairs[selectedDex][selectedLpTokenPair];
        state.lpToken1 = lpToken1;
        state.lpToken2 = lpToken2;
      }
    },
    resetUnwrapState(state) {
      state.selectedLpTokenPair = null;
      state.outputToken = null;
      state.outputTokenValue = null;
      state.outputTokenValueUSD = null;
      state.lpToken1 = null;
      state.lpToken2 = null;
      state.lpToken1Value = null;
      state.lpToken2Value = null;
      state.totalLPTokens = null;
      state.newTotalLPTokens = null;
      // the navigate to home
      navigate("/unwrap");
    },
    // for now we mock it
    setUnwrapTokensValue(state, { payload }) {
      const { outputToken } = payload;
      if (outputToken)
        state.outputTokenValue =
          "0.123645 " + outputToken.symbol.toUpperCase();
      state.outputTokenValueUSD = "~$4,623.45";
      state.lpToken1Value =
        "1.72806 " + state.lpToken1.symbol.toUpperCase();
      state.lpToken2Value =
        "3,659.99 " + state.lpToken2.symbol.toUpperCase();
      state.totalLPTokens = "4.5324";
      state.newTotalLPTokens = "0.04324";
      state.networkFeeETH = "0.008654 ETH";
      state.networkFeeUSD = "~$17.35";
      // mocked for now
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setUnwrapTokensValue,
  resetUnwrapState,
  setSelectedLpTokenPair,
  setOutputToken,
} = unwrapSlice.actions;

export default unwrapSlice.reducer;
