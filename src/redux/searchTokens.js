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
    lpToken1Weight: 0,
    lpToken2Weight: 0
  },
  reducers: {
    showSearchModal: (state, action) => {
      const { showSearch, searchCaller } = action.payload;
      state.showSearch = showSearch;
      state.searchCaller = searchCaller;

      // reset the selected tokens
      if (state.searchCaller === constants.inputToken) {
        state.inputToken = null;
      }
    },
    hideSearchModal: (state, action) => {
      const { showSearch } = action.payload;
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

      // hide the modal
      state.showSearch = false;
    },
    clearTokens(state){
      state.searchCaller = "";
      state.inputToken = null;
      state.lpToken1 = null;
      state.lpToken2 = null;
    },
    setLPTokensWeight(state) {

    }
  }
});

// Action creators are generated for each case reducer function
export const {  showSearchModal, hideSearchModal, setSelectedToken, clearTokens } = searchTokensSlice.actions;

export default searchTokensSlice.reducer;