import { createSlice } from "@reduxjs/toolkit";

export const searchTokensSlice = createSlice({
  name: "searchTokens",
  initialState: {
    showSearch: false
  },
  reducers: {
    showSearchModal: (state, action) => {
      state.showSearch = action.payload;
    }
  }
});

// Action creators are generated for each case reducer function
export const {  showSearchModal } = searchTokensSlice.actions;

export default searchTokensSlice.reducer;