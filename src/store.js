import { configureStore } from '@reduxjs/toolkit';

// reducers
import tokensReducer from "./redux/tokens";
import transactionsReducer from "./redux/transactions";
import walletReducer from "./redux/wallet";
import dexReducer from "./redux/dex";
import unwrapReducer from './redux/unwrap';
// middleware
import logger from 'redux-logger';

export default configureStore({
  reducer: {
    wallet: walletReducer,
    unwrap:unwrapReducer,
    tokens: tokensReducer,
    transactions: transactionsReducer,
    dexes: dexReducer
  },
  middleware: [logger]
})