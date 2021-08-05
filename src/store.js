import { configureStore,  getDefaultMiddleware } from '@reduxjs/toolkit';
import { persistReducer } from "redux-persist";
import localStorage from "redux-persist/lib/storage";

// reducers
import tokensReducer from "./redux/tokens";
import transactionsReducer from "./redux/transactions";
import walletReducer from "./redux/wallet";
import dexReducer from "./redux/dex";
import pricesReducer from './redux/prices';

// middleware
import logger from 'redux-logger';

const config = [{
  key: "wallet",
  storage: localStorage,
  whitelist: ['walletAddress']
},
{
  key: "dex",
  storage: localStorage,
  whitelist: ['dexes']
}
];
const persistedWallet = persistReducer(config[0], walletReducer);
const persistedDex = persistReducer(config[1], dexReducer);

export default configureStore({
  reducer: {
    wallet: persistedWallet,
    tokens: tokensReducer,
    transactions: transactionsReducer,
    dexes: persistedDex,
    prices: pricesReducer,
  },
  middleware: [ ...getDefaultMiddleware({
    serializableCheck: false,
  }), logger]
})