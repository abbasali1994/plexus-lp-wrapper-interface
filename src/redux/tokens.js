import { createSlice } from "@reduxjs/toolkit";
import { constants } from '../utils';

export const tokensSlice = createSlice({
  name: "tokens",
  initialState: {
    showSearch: false,
    searchCaller: "",
    inputToken: null,
    outputToken: null,
    lpToken1: null,
    lpToken2: null,
    showMax: false,
    inputTokenValue: '',
    lpToken1Value: '',
    lpToken2Value: '',
    lpToken1Amount: '',
    lpToken2Amount: '',
    inputTokenValueUSD: '',
    inputTokenValueUSDFormatted: '',
    totalLPTokens: '',
    networkFeeETH: '',
    networkFeeUSD: ''
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

        const tokenBal = token.tokenBal;
        const tokenUSDValue = token.tokenUSDValue;
        state.inputTokenValue = tokenBal;
        state.inputTokenValueUSD = tokenBal * tokenUSDValue;
        state.inputTokenValueUSDFormatted = "$" + state.inputTokenValueUSD.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        state.inputToken = token;
      }
      if (state.searchCaller === constants.outputToken) {
        
        state.outputToken = token;
      }
      if (state.searchCaller === constants.lpToken1) {
        
        const tokenUSDValue = token.tokenUSDValue;
        const inputHalfUSDValue  = state.inputTokenValueUSD / 2;
        state.lpToken1Amount = inputHalfUSDValue / tokenUSDValue;
        state.lpToken1Value = state.lpToken1Amount.toFixed(5) + " " +token.tokenSymbol.toUpperCase();
        state.lpToken1 = token;
      }
      if (state.searchCaller === constants.lpToken2) {
        const tokenUSDValue = token.tokenUSDValue;
        const inputHalfUSDValue  = state.inputTokenValueUSD / 2;
        state.lpToken2Amount = inputHalfUSDValue / tokenUSDValue;
        state.lpToken2Value = state.lpToken2Amount.toFixed(5) + " " +token.tokenSymbol.toUpperCase();
        state.lpToken2 = token;
      }

      if(state.inputToken !== null && state.lpToken1 !== null && state.lpToken2 !== null) {
        state.showMax = true;
      }

      // hide the modal
      state.showSearch = false;
    },
    resetState(state){
      state.showSearch = false;
      state.searchCaller = "";
      state.inputToken = null;
      state.lpToken1 = null;
      state.lpToken2 = null;
      state.showMax = false;
      state.inputTokenAmount = "";
      state.lpToken1Value = "";
      state.lpToken2Value = "";
      state.inputTokenValueUSD = "";
      state.inputTokenValueUSDFormatted = 0;
      state.totalLPTokens = "";
      state.networkFeeETH = "";
      state.networkFeeUSD = "";
    },
    setNewInputAmount(state, { payload }){

      const { inputTokenAmount } = payload;

      const inputToken = state.inputToken
      const lpToken1 =  state.lpToken1;
      const lpToken2 =  state.lpToken2;

      state.inputTokenValue = inputTokenAmount;
      state.inputTokenValueUSD = inputToken.tokenUSDValue * inputTokenAmount;
      state.inputTokenValueUSDFormatted = "$" + state.inputTokenValueUSD.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');

      const inputHalfUSDValue  = state.inputTokenValueUSD / 2;


      // for lp 1
      const token1USDValue = lpToken1.tokenUSDValue;
      const lpToken1Amount = inputHalfUSDValue / token1USDValue;
      state.lpToken1Value = lpToken1Amount.toFixed(5) + " " +lpToken1.tokenSymbol.toUpperCase();

       // for lp 2
       const token2USDValue = lpToken2.tokenUSDValue;
       const lpToken2Amount = inputHalfUSDValue / token2USDValue;
       state.lpToken2Value = lpToken2Amount.toFixed(5) + " " +lpToken2.tokenSymbol.toUpperCase();
 

    },
    // set max values
    setMax(state) {
      const inputToken = state.inputToken
      const lpToken1 =  state.lpToken1;
      const lpToken2 =  state.lpToken2;

      state.inputTokenValue = inputToken.tokenBal;
      state.inputTokenValueUSD = inputToken.tokenUSDValue * state.inputTokenValue;
      state.inputTokenValueUSDFormatted = "$" + state.inputTokenValueUSD.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');

      const inputHalfUSDValue  = state.inputTokenValueUSD / 2;


      // for lp 1
      const token1USDValue = lpToken1.tokenUSDValue;
      const lpToken1Amount = inputHalfUSDValue / token1USDValue;
      state.lpToken1Value = lpToken1Amount.toFixed(5) + " " +lpToken1.tokenSymbol.toUpperCase();

       // for lp 2
       const token2USDValue = lpToken2.tokenUSDValue;
       const lpToken2Amount = inputHalfUSDValue / token2USDValue;
       state.lpToken2Value = lpToken2Amount.toFixed(5) + " " +lpToken2.tokenSymbol.toUpperCase();
 

      // hide the max button
      state.showMax = false;
    },

    setNetworkValues(state, { payload}) {
      const { networkFeeETH, networkFeeUSD } = payload;
    
      state.networkFeeETH = networkFeeETH;
      state.networkFeeUSD = networkFeeUSD;

    },
    

  }
});

// Action creators are generated for each case reducer function
export const {  showSearchModal, hideSearchModal, setSelectedToken, clearTokens,  setMax, setNetworkValues, setNewInputAmount, resetState } = tokensSlice.actions;

export default tokensSlice.reducer;