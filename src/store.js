import { configureStore } from '@reduxjs/toolkit';
import { persistReducer } from "redux-persist";
import localStorage from "redux-persist/lib/storage";

// reducers
import tokensReducer from "./redux/tokens";
import transactionsReducer from "./redux/transactions";
import walletReducer from "./redux/wallet";
import dexReducer from "./redux/dex";
import unwrapReducer from './redux/unwrap';

// middleware
import logger from 'redux-logger';

const config = {
  key: "wallet",
  storage: localStorage,
};
const persistedWallet = persistReducer(config, walletReducer);


export default configureStore({
  reducer: {
    wallet: persistedWallet,
    unwrap:unwrapReducer,
    tokens: tokensReducer,
    transactions: transactionsReducer,
    dexes: dexReducer
  },
  middleware: [logger]
})