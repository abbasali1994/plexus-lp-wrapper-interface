import { createSlice } from "@reduxjs/toolkit";
import { constants } from "../utils";
import { formatAmount } from "../utils/display";

export const tokensSlice = createSlice({
  name: "tokens",
  initialState: {
    showSearch: false,
    searchCaller: "",
    inputToken: null,
    outputToken: null,
    selectedLpTokenPair: null,
    newPair: null,
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
    newLPTokens: "",
    wrapPaths: [],
    unwrapPaths: [],
    slippageTolerance: 5,
    deadline: 0 // set a deadline of 30 seconds
  },
  reducers: {
    setSearchCaller: (state, action) => {
      const { searchCaller } = action.payload;
      state.searchCaller = searchCaller;
    },
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
        state.lpToken1Amount = Number((inputHalfUSDValue / tokenUSDValue).toFixed(7));
        state.lpToken1Value =
          state.lpToken1Amount.toFixed(5) + " " + token.symbol.toUpperCase();
        state.lpToken1 = token;
      }
      if (state.searchCaller === constants.lpToken2) {
        const tokenUSDValue = token.tokenUSDValue;
        const inputHalfUSDValue = state.inputTokenValueUSD / 2;
        state.lpToken2Amount = Number((inputHalfUSDValue / tokenUSDValue).toFixed(7));
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
      state.newPair = null;
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
      state.wrapPaths = [];
      state.unwrapPaths = [];
      state.slippageTolerance = 1;
      state.deadline =  Math.floor(new Date().getTime() / 1000) + 30;
    },
    setPaths(state, { payload }) {
      const { type, paths } = payload;

      if(type === constants.wrapPaths) {
        state.wrapPaths = paths;
      }
      if(type === constants.unwrapPaths) {
        state.unwrapPaths = paths;
      }

    },
    setSlippageTolerance(state, { payload }) {
      state.slippageTolerance = payload;
    },
    setTransactionDeadline(state, { payload }) {
      state.deadline = payload;
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
      const lpToken1Amount = Number((inputHalfUSDValue / token1USDValue).toFixed(7));
      state.lpToken1Amount = lpToken1Amount;
      state.lpToken1Value =
        lpToken1Amount.toFixed(5) + " " + lpToken1.symbol.toUpperCase();

      // for lp 2
      const token2USDValue = lpToken2.tokenUSDValue;
      const lpToken2Amount = Number((inputHalfUSDValue / token2USDValue).toFixed(7));
      state.lpToken2Amount = lpToken2Amount;
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
    setRemixValues(state, { payload }) {
      const { pair } = payload;
      const { selectedLpTokenPair, lpToken1, lpToken2 } = state;
      const { reserveUSD, totalSupply } = pair;

      // USD equivalent of current lp pair tokens
      const USDAmount =
        selectedLpTokenPair.lpTokenPrice *
        selectedLpTokenPair.liquidityTokenBalance;
      const newPairTokenPrice =
        parseFloat(reserveUSD) / parseFloat(totalSupply);

      state.lpToken1Amount = USDAmount / 2 / parseFloat(lpToken1.tokenUSDValue);
      state.lpToken1Value =
        formatAmount(state.lpToken1Amount) +
        " " +
        lpToken1.symbol.toUpperCase();

      state.lpToken2Amount = USDAmount / 2 / parseFloat(lpToken2.tokenUSDValue);
      state.lpToken2Value =
        formatAmount(state.lpToken2Amount) +
        " " +
        lpToken2.symbol.toUpperCase();

      state.newPair = pair;
      state.newLPTokens = parseFloat(USDAmount) / parseFloat(newPairTokenPrice);
    },
    //Set Unwrap
    setUnwrapValues(state) {
      const { selectedLpTokenPair, outputToken } = state;
      const USDAmount =
        selectedLpTokenPair.lpTokenPrice *
        selectedLpTokenPair.liquidityTokenBalance;
      const outputTokenAmount = USDAmount / outputToken.tokenUSDValue;
      state.outputTokenValue =
        formatAmount(outputTokenAmount) +
        " " +
        outputToken.symbol.toUpperCase();
      state.outputTokenValueUSD = USDAmount;
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
  setSearchCaller,
  setRemixValues,
  setUnwrapValues,
  setNetworkValues,
  setNewInputAmount,
  setPaths,
  setSlippageTolerance,
  setTransactionDeadline,
  updateInputTokenAmount,
  resetState,
} = tokensSlice.actions;

export default tokensSlice.reducer;
