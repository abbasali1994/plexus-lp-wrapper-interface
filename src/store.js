import { configureStore } from '@reduxjs/toolkit';

import searchTokensReducer from "./redux/searchTokens";
import logger from 'redux-logger';

export default configureStore({
  reducer: {
    searchTokens: searchTokensReducer,
  },
  middleware: [logger]
})