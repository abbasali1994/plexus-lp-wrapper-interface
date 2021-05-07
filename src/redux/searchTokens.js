import { createSlice } from "@reduxjs/toolkit";

import { constants } from '../utils';

export const searchTokensSlice = createSlice({
  name: "searchTokens",
  initialState: {
    showSearch: false,
    searchCaller: "",
    inputToken: null,
    lpToken1: null,
    lpToken2: null
  },
  reducers: {
    showSearchModal: (state, action) => {
      const { showSearch, searchCaller } = action.payload;
      state.showSearch = showSearch;
      state.searchCaller = searchCaller;
    },
    hideSearchModal: (state, action) => {
      const { showSearch } = action.payload;
      state.showSearch = showSearch;
    },
    setSelectedToken: (state, action) => {
      const  token = action.payload;

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
    }
  }
});

// Action creators are generated for each case reducer function
export const {  showSearchModal, hideSearchModal, setSelectedToken, clearTokens } = searchTokensSlice.actions;

export default searchTokensSlice.reducer;