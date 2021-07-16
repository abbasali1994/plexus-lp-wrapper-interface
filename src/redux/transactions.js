import { createSlice } from "@reduxjs/toolkit";

export const transactionsSlice = createSlice({
    name: "transactions",
    initialState: {
        showConfirm: false,
        showAwaitingTxn: false,
        txnStatus: null,
    },
    reducers: {
        showConfirmModal: (state, { payload }) => {
            const { showConfirm } = payload;
            state.showConfirm = showConfirm;
        },
        showAwaitingTxnModal: (state, { payload }) => {
            const { showAwaitingTxn } = payload;
            state.showAwaitingTxn = showAwaitingTxn;
        },
        setTxnStatus: (state, { payload }) => {
            const { txnStatus } = payload;
            state.txnStatus = txnStatus;
        }
    }
});

export const { showConfirmModal, showAwaitingTxnModal, setTxnStatus } = transactionsSlice.actions;

export default transactionsSlice.reducer;