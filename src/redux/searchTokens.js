import { createSlice } from "@reduxjs/toolkit";

import { constants } from '../utils';

export const searchTokensSlice = createSlice({
  name: "searchTokens",
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
    },
    // for now we spoof it
    setTokensValue(state, { payload}) {
      const { input, lp1, lp2 } = payload;

      state.inputTokenValue  = input;
      state.lpToken1Value = lp1;
      state.lpToken2Value = lp2;

      // hide the show max button
      state.showMax = false;
    }
  }
});

// Action creators are generated for each case reducer function
export const {  showSearchModal, hideSearchModal, setSelectedToken, clearTokens,  setTokensValue } = searchTokensSlice.actions;

export default searchTokensSlice.reducer;