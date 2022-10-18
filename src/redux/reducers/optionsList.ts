import { createSlice } from "@reduxjs/toolkit";
import { RawOption } from "../../types/options";

export const optionsList = createSlice({
  name: "optionsList",
  initialState: {
    rawOptionsList: [] as RawOption[],
  },
  reducers: {
    set: (state, action) => {
      if (state.rawOptionsList.length > 0) {
        return state;
      }
      const arr: RawOption[] = action.payload;
      state.rawOptionsList = arr;
      return state;
    },
  },
});

export const { set } = optionsList.actions;
