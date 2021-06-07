import { createSlice } from "@reduxjs/toolkit";
import { constants } from '../utils';

// navigate
import { navigate } from 'hookrouter';

export const tokensSlice = createSlice({
  name: "tokens",
  initialState: {
    showSearch: false,
    searchCaller: "",
    inputToken: null,
    lpToken1: null,
    lpToken2: null,
    showMax: false,
    inputTokenValue: '',
    lpToken1Value: '',
    lpToken2Value: '',
    inputTokenValueUSD: '',
    lpToken1ValueUSD: '',
    lpToken2ValueUSD: '',
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
      const  token = payload;

      if (state.searchCaller === constants.inputToken) {
        state.inputToken = token;
      }
      if (state.searchCaller === constants.lpToken1) {
        state.lpToken1 = token;
      }
      if (state.searchCaller === constants.lpToken2) {
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
      state.inputTokenValue = "";
      state.lpToken1Value = "";
      state.lpToken2Value = "";
      state.inputTokenValueUSD = "";
      state.lpToken1ValueUSD = "";
      state.lpToken2ValueUSD = "";
      state.totalLPTokens = "";
      state.networkFeeETH = "";
      state.networkFeeUSD = "";

      // the navigate to home
      navigate('/');
    },
    // for now we mock it
    setTokensValue(state, { payload}) {
      const { input, lp1, lp2 } = payload;

      state.inputTokenValue  = input;
      state.lpToken1Value = lp1;
      state.lpToken2Value = lp2;

      // mocked for now
      state.inputTokenValueUSD = "~$4,623.45";
      state.lpToken1ValueUSD = "~$10,000.67";
      state.lpToken2ValueUSD = "~$9,877.57";
      state.totalLPTokens = "4.5324";
      state.networkFeeETH = "0.008654 ETH";
      state.networkFeeUSD = "~$17.35";

      // hide the max button
      state.showMax = false;
    }
  }
});

// Action creators are generated for each case reducer function
export const {  showSearchModal, hideSearchModal, setSelectedToken, clearTokens,  setTokensValue, resetState } = tokensSlice.actions;

export default tokensSlice.reducer;