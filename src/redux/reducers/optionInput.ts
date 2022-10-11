import { createSlice } from "@reduxjs/toolkit";

export const optionInputSlice = createSlice({
  name: "optionInput",
  initialState: {
    maturity: "",
    strike: "",
  },
  reducers: {
    set: (state, action) => {
      const { maturity, strike } = action.payload;
      state.maturity = maturity;
      state.strike = strike;
    },
  },
});

export const { set } = optionInputSlice.actions;
