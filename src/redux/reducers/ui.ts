import { createSlice } from "@reduxjs/toolkit";
import { OptionWithPosition } from "../../types/options";

export enum DialogContentElem {
  Wallet = "Wallet",
  NetworkMismatch = "NetworkMismatch",
  Slippage = "Slippage",
  CloseOption = "CloseOption",
}

export enum ToastType {
  Warn = "warn",
  Info = "info",
  Success = "success",
  Error = "error",
}

export type ToastState = {
  message: string;
  open: boolean;
  type: ToastType;
};

export interface UiState {
  dialogOpen: boolean;
  dialogContent: DialogContentElem;
  toastState: ToastState;
  activeCloseOption?: OptionWithPosition;
}

export const ui = createSlice({
  name: "ui",
  initialState: {
    dialogOpen: false,
    dialogContent: DialogContentElem.Wallet,
    toastState: { message: "", type: ToastType.Info, open: false },
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
    setToastState: (state, action: { payload: Partial<ToastState> }) => {
      state.toastState = { ...state.toastState, ...action.payload };
      return state;
    },
  },
});

export const { toggleDialog, setCloseOptionState, setToastState } = ui.actions;
