import { createSlice } from "@reduxjs/toolkit";

export const transactionsSlice = createSlice({
    name: "transactions",
    initialState: {
        showConfirm: false,
    },
    reducers: {
        showConfirmModal: (state, { payload }) => {
            const { showConfirm } = payload;
            state.showConfirm = showConfirm;
        },
        hideConfirmModal: (state, { payload }) => {
            const { showConfirm } = payload;
            state.showConfirm = showConfirm;
        },
    }
});

export const { showConfirmModal,  hideConfirmModal } = transactionsSlice.actions;

export default transactionsSlice.reducer;