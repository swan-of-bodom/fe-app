import { createSlice } from "@reduxjs/toolkit";

export enum DialogContentElem {
  Wallet = "Wallet",
  NetworkMismatch = "NetworkMismatch",
  Slippage = "Slippage",
}

export interface UiState {
  dialogOpen: boolean;
  dialogContent: DialogContentElem;
}

export const ui = createSlice({
  name: "ui",
  initialState: {
    dialogOpen: false,
    dialogContent: DialogContentElem.Wallet,
  },
  reducers: {
    toggleDialog: (state, action: { payload: Partial<UiState> }) => {
      state.dialogOpen = !!action.payload.dialogOpen;
      if (action.payload.dialogContent) {
        state.dialogContent = action.payload.dialogContent;
      }
      return state;
    },
  },
});

export const { toggleDialog } = ui.actions;
