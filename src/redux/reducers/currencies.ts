import { createSlice } from "@reduxjs/toolkit";

export const currencies = createSlice({
  name: "currencies",
  initialState: {
    usd: 1,
    eth: 1324.21,
  },
  reducers: {
    set: (state, action) => {
      if (action?.payload?.eth) {
        state.eth = action?.payload?.eth;
      }
    },
  },
});

export const { set } = currencies.actions;
