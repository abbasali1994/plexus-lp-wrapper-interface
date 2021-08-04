import { createSlice } from "@reduxjs/toolkit";

export const transactionsSlice = createSlice({
  name: "transactions",
  initialState: {
    showConfirm: false,
    showAwaitingTxn: false,
    showConfirmPrivacy: false,
    txnStatus: null,
    showTransactionSettings:false,
  },
  reducers: {
    showConfirmModal: (state, { payload }) => {
      const { showConfirm } = payload;
      state.showConfirm = showConfirm;
    },
    showTransactionSettings: (state, { payload }) => {
      const { showTransactionSettings } = payload;
      state.showTransactionSettings = showTransactionSettings;
    },
    showConfirmPrivacyModal: (state, { payload }) => {
      const { showConfirmPrivacy } = payload;
      state.showConfirmPrivacy = showConfirmPrivacy;
    },
    showAwaitingTxnModal: (state, { payload }) => {
      const { showAwaitingTxn } = payload;
      state.showAwaitingTxn = showAwaitingTxn;
    },
    setTxnStatus: (state, { payload }) => {
      const { txnStatus } = payload;
      state.txnStatus = txnStatus;
    },
    resetTxnState: (state) => {
      state.txnStatus = null;
      state.showConfirm = false;
      state.showAwaitingTxn = false;
    },
  },
});

export const {
  showConfirmModal,
  showAwaitingTxnModal,
  showConfirmPrivacyModal,
  showTransactionSettings,
  setTxnStatus,
  resetTxnState,
} = transactionsSlice.actions;

export default transactionsSlice.reducer;
