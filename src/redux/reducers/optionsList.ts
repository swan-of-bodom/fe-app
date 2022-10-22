import { createSlice } from "@reduxjs/toolkit";
import { RawOption } from "../../types/options";

export const enum OptionsListFetchState {
  NotStarted,
  Done,
  Failed,
  Fetching,
}

export const optionsList = createSlice({
  name: "optionsList",
  initialState: {
    rawOptionsList: [] as RawOption[],
    state: OptionsListFetchState.NotStarted,
  },
  reducers: {
    setOptions: (state, action) => {
      if (state.rawOptionsList.length > 0) {
        return state;
      }
      const arr: RawOption[] = action.payload;
      state.rawOptionsList = arr;
      return state;
    },
    setFetchState: (state, action) => {
      state.state = action.payload;
    },
  },
});

export const { setOptions, setFetchState } = optionsList.actions;
