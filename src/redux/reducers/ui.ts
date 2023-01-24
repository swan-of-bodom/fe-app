import { createSlice } from "@reduxjs/toolkit";

export interface UiState {
  networkMismatchDialogOpen: boolean;
  walletConnectDialogOpen: boolean;
}

export const ui = createSlice({
  name: "ui",
  initialState: {
    networkMismatchDialogOpen: false,
    walletConnectDialogOpen: false,
  },
  reducers: {
    toggleNetworkMismatch: (state, action: { payload: boolean }) => {
      state.networkMismatchDialogOpen = action.payload;
      return state;
    },
    toggleWalletConnect: (state, action: { payload: boolean }) => {
      state.walletConnectDialogOpen = action.payload;
      return state;
    },
  },
});

export const { toggleNetworkMismatch, toggleWalletConnect } = ui.actions;
