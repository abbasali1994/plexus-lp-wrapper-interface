import { createSlice } from "@reduxjs/toolkit";
import { constants } from "../utils";

export const dexSlice = createSlice({
    name: "dex",
    initialState: {
    activeAction: null,
        selectedDex: 0,
        dexes: [{ id: 0, name: constants.dexSushi},
                { id: 1, name: constants.dexUni}]
    },
    reducers: {
        setActiveDex : (state, { payload }) => {
            const { selectedDex } = payload;
            state.selectedDex = selectedDex;
    },
    setActiveAction: (state, { payload }) => {
      const { activeAction } = payload;
      state.activeAction = activeAction;
    }
  }
});

export const { setActiveDex, setActiveAction } = dexSlice.actions;

export default dexSlice.reducer;
