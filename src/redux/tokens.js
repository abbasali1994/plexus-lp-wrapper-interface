import { createSlice } from "@reduxjs/toolkit";
import { constants } from "../utils";

export const tokensSlice = createSlice({
  name: "tokens",
  initialState: {
    showSearch: false,
    searchCaller: "",
    inputToken: null,
    outputToken: null,
    selectedLpTokenPair: null,
    lpToken1: null,
    lpToken2: null,
    showMax: false,
    inputTokenValue: "",
    outputTokenValue: "",
    lpToken1Value: "",
    lpToken2Value: "",
    lpToken1Amount: "",
    lpToken2Amount: "",
    inputTokenValueUSD: "",
    inputTokenValueUSDFormatted: "",
    totalLPTokens: "",
    networkFeeETH: "",
    networkFeeUSD: "",
    txnHash: "",
  },
  reducers: {
    showSearchModal: (state, action) => {
      const { showSearch, searchCaller } = action.payload;
      state.showSearch = showSearch;
      state.searchCaller = searchCaller;
    },
    hideSearchModal: (state, { payload }) => {
      const { showSearch } = payload;
      state.showSearch = showSearch;
    },
    setSelectedToken: (state, { payload }) => {
      const token = payload;

      if (state.searchCaller === constants.inputToken) {
        const tokenBal = token.balance;
        const tokenUSDValue = token.tokenUSDValue;
        state.inputTokenValue = tokenBal;
        state.inputTokenValueUSD = tokenBal * tokenUSDValue;
        state.inputTokenValueUSDFormatted =
          "$" +
          state.inputTokenValueUSD
            .toFixed(2)
            .replace(/\d(?=(\d{3})+\.)/g, "$&,");
        state.inputToken = token;
      }
      if (state.searchCaller === constants.outputToken) {
        state.outputToken = token;
      }
      if (state.searchCaller === constants.lpToken1) {
        const tokenUSDValue = token.tokenUSDValue;
        const inputHalfUSDValue = state.inputTokenValueUSD / 2;
        state.lpToken1Amount = inputHalfUSDValue / tokenUSDValue;
        state.lpToken1Value =
          state.lpToken1Amount.toFixed(5) + " " + token.symbol.toUpperCase();
        state.lpToken1 = token;
      }
      if (state.searchCaller === constants.lpToken2) {
        const tokenUSDValue = token.tokenUSDValue;
        const inputHalfUSDValue = state.inputTokenValueUSD / 2;
        state.lpToken2Amount = inputHalfUSDValue / tokenUSDValue;
        state.lpToken2Value =
          state.lpToken2Amount.toFixed(5) + " " + token.symbol.toUpperCase();
        state.lpToken2 = token;
      }

      if (
        state.inputToken !== null &&
        state.lpToken1 !== null &&
        state.lpToken2 !== null
      ) {
        state.showMax = true;
      }

      // hide the modal
      state.showSearch = false;
    },
    resetState(state) {
      state.showSearch = false;
      state.searchCaller = "";
      state.inputToken = null;
      state.outputToken = null;
      state.selectedLpTokenPair = null;
      state.lpToken1 = null;
      state.lpToken2 = null;
      state.showMax = false;
      state.inputTokenValue = "";
      state.outputTokenValue = "";
      state.lpToken1Value = "";
      state.lpToken2Value = "";
      state.lpToken1Amount = "";
      state.lpToken2Amount = "";
      state.inputTokenValueUSD = "";
      state.inputTokenValueUSDFormatted = "";
      state.totalLPTokens = "";
      state.networkFeeETH = "";
      state.networkFeeUSD = "";
      state.txnHash = "";
      state.newLPTokens = "";
    },
    updateInputTokenAmount(state, { payload }) {
      const { inputTokenAmount } = payload;
      const inputToken = state.inputToken;

      state.inputTokenValue = inputTokenAmount;
      state.inputTokenValueUSD = inputToken.tokenUSDValue * inputTokenAmount;
      state.inputTokenValueUSDFormatted =
        "~$" +
        state.inputTokenValueUSD.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
    },
    setNewInputAmount(state, { payload }) {
      const { inputTokenAmount } = payload;
      const inputToken = state.inputToken;
      const lpToken1 = state.lpToken1;
      const lpToken2 = state.lpToken2;

      state.inputTokenValue = inputTokenAmount;
      state.inputTokenValueUSD = inputToken.tokenUSDValue * inputTokenAmount;
      state.inputTokenValueUSDFormatted =
        "~$" +
        state.inputTokenValueUSD.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");

      const inputHalfUSDValue = state.inputTokenValueUSD / 2;

      // for lp 1
      const token1USDValue = lpToken1.tokenUSDValue;
      const lpToken1Amount = inputHalfUSDValue / token1USDValue;
      state.lpToken1Value =
        lpToken1Amount.toFixed(5) + " " + lpToken1.symbol.toUpperCase();

      // for lp 2
      const token2USDValue = lpToken2.tokenUSDValue;
      const lpToken2Amount = inputHalfUSDValue / token2USDValue;
      state.lpToken2Value =
        lpToken2Amount.toFixed(5) + " " + lpToken2.symbol.toUpperCase();

      //for max button
      if (
        !state.showMax &&
        state.inputToken !== null &&
        state.lpToken1 !== null &&
        state.lpToken2 !== null &&
        state.inputToken.balance > inputTokenAmount
      ) {
        state.showMax = true;
      }
    },
    setSelectedLpTokenPair: (state, action) => {
      const { selectedLpTokenPair } = action.payload;
      state.selectedLpTokenPair = selectedLpTokenPair;
    },
    // set max values
    setMax(state) {
      const inputToken = state.inputToken;
      const lpToken1 = state.lpToken1;
      const lpToken2 = state.lpToken2;

      state.inputTokenValue = inputToken.balance;
      state.inputTokenValueUSD =
        inputToken.tokenUSDValue * state.inputTokenValue;
      state.inputTokenValueUSDFormatted =
        "$" +
        state.inputTokenValueUSD.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");

      const inputHalfUSDValue = state.inputTokenValueUSD / 2;

      // for lp 1
      const token1USDValue = lpToken1.tokenUSDValue;
      const lpToken1Amount = inputHalfUSDValue / token1USDValue;
      state.lpToken1Value =
        lpToken1Amount.toFixed(5) + " " + lpToken1.symbol.toUpperCase();

      // for lp 2
      const token2USDValue = lpToken2.tokenUSDValue;
      const lpToken2Amount = inputHalfUSDValue / token2USDValue;
      state.lpToken2Value =
        lpToken2Amount.toFixed(5) + " " + lpToken2.symbol.toUpperCase();

      // hide the max button
      state.showMax = false;
    },
    setNetworkValues(state, { payload }) {
      const { networkFeeETH, networkFeeUSD, txnHash } = payload;

      state.networkFeeETH = networkFeeETH;
      state.networkFeeUSD = networkFeeUSD;
      state.txnHash = txnHash;
    },

    //Mock Remix
    setRemixValues(state) {
      const lpToken1 = state.lpToken1;
      const lpToken2 = state.lpToken2;
      state.lpToken1Amount = 1.2345;
      state.lpToken1Value = 1.2345 + " " + lpToken1.symbol.toUpperCase();
      state.lpToken2Amount = 4.5678;
      state.lpToken2Value = 4.5678 + " " + lpToken2.symbol.toUpperCase();

      state.newLPTokens = 6.7891;
    },
    //Mock Unwrap
    setUnwrapValues(state) {
      const outputToken = state.outputToken;
      state.outputTokenValue = 6.7891 + " " + outputToken.symbol.toUpperCase();
      state.outputTokenValueUSD = 1.2345;
      state.newLPTokens = 6.7891;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  showSearchModal,
  hideSearchModal,
  setSelectedLpTokenPair,
  setSelectedToken,
  clearTokens,
  setMax,
  setRemixValues,
  setUnwrapValues,
  setNetworkValues,
  setNewInputAmount,
  updateInputTokenAmount,
  resetState,
} = tokensSlice.actions;

export default tokensSlice.reducer;
