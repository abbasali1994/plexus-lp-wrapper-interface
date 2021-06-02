import { createSlice } from "@reduxjs/toolkit";
import { constants } from '../utils';

export const dexSlice = createSlice({
    name: "dex",
    initialState: {
        selectedDex: 0,
        dexes: [{ id: 0, name: constants.dexSushi},
                { id: 1, name: constants.dexUni}]
    },
    reducers: {
        setActiveDex : (state, { payload }) => {
            const { selectedDex } = payload;
            state.selectedDex = selectedDex;
        }
    }
});

export const { setActiveDex } = dexSlice.actions;

export default dexSlice.reducer;