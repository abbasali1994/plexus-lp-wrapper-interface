import { configureStore } from '@reduxjs/toolkit';

// reducers
import searchTokensReducer from "./redux/searchTokens";
import transactionsReducer from "./redux/transactions";
import dexReducer from "./redux/dex";

// middleware
import logger from 'redux-logger';

export default configureStore({
  reducer: {
    searchTokens: searchTokensReducer,
    transactions: transactionsReducer,
    dexes: dexReducer
  },
  middleware: [logger]
})