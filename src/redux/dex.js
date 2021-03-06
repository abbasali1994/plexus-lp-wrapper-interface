import { createSlice } from "@reduxjs/toolkit";
import { constants } from "../utils";

export const dexSlice = createSlice({
  name: "dex",
  initialState: {
    activeAction: "Generate",
    selectedDex: 0,
    newDex: 0,
    dexes: [
      { id: 0, name: constants.dexSushi },
      { id: 1, name: constants.dexUni },
    ],
  },
  reducers: {
    setActiveDex: (state, { payload }) => {
      const { selectedDex } = payload;
      state.selectedDex = selectedDex;
    },
    setNewDex: (state, { payload }) => {
      const { newDex } = payload;
      state.newDex = newDex;
    },
    setActiveAction: (state, { payload }) => {
      const { activeAction } = payload;
      state.activeAction = activeAction;
    },
    setDexesStats: (state, { payload }) => {
      const { uniStats, sushiStats } = payload;
      state.dexes[0].stats = sushiStats;
      state.dexes[1].stats = uniStats;
    },
  },
});

export const { setActiveDex, setNewDex, setActiveAction, setDexesStats } = dexSlice.actions;

export default dexSlice.reducer;
