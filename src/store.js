import { configureStore } from '@reduxjs/toolkit';

// reducers
import tokensReducer from "./redux/tokens";
import transactionsReducer from "./redux/transactions";
import dexReducer from "./redux/dex";

// middleware
import logger from 'redux-logger';

export default configureStore({
  reducer: {
    tokens: tokensReducer,
    transactions: transactionsReducer,
    dexes: dexReducer
  },
  middleware: [logger]
})