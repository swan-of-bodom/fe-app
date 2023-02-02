import { createSlice } from "@reduxjs/toolkit";
import { OptionWithPosition } from "../../types/options";

export enum DialogContentElem {
  Wallet = "Wallet",
  NetworkMismatch = "NetworkMismatch",
  Slippage = "Slippage",
  CloseOption = "CloseOption",
}

export interface UiState {
  dialogOpen: boolean;
  dialogContent: DialogContentElem;
  activeCloseOption?: OptionWithPosition;
}

export const ui = createSlice({
  name: "ui",
  initialState: {
    dialogOpen: false,
    dialogContent: DialogContentElem.Wallet,
  } as UiState,
  reducers: {
    toggleDialog: (state, action: { payload: Partial<UiState> }) => {
      state.dialogOpen = !!action.payload.dialogOpen;
      if (action.payload.dialogContent) {
        state.dialogContent = action.payload.dialogContent;
      }
      return state;
    },
    setCloseOptionState: (state, action: { payload: OptionWithPosition }) => {
      state.activeCloseOption = action.payload;
      return state;
    },
  },
});

export const { toggleDialog, setCloseOptionState } = ui.actions;
