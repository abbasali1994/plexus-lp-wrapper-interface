import { createSlice } from "@reduxjs/toolkit";

export const transactionsSlice = createSlice({
    name: "transactions",
    initialState: {
        showConfirm: false,
        showAwaitingTxn: false,
    },
    reducers: {
        showConfirmModal: (state, { payload }) => {
            console.log(payload);
            const { showConfirm } = payload;
            state.showConfirm = showConfirm;
        },
        showAwaitingTxnModal: (state, { payload }) => {
            console.log(payload);
            const { showAwaitingTxn } = payload;
            state.showAwaitingTxn = showAwaitingTxn;
        }
    }
});

export const { showConfirmModal, showAwaitingTxnModal } = transactionsSlice.actions;

export default transactionsSlice.reducer;