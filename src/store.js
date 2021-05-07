import { configureStore } from '@reduxjs/toolkit';

import searchTokensReducer from "./redux/searchTokens";

export default configureStore({
  reducer: {
    searchTokens: searchTokensReducer
  }
})