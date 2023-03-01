import { createSlice } from "@reduxjs/toolkit";

export enum TransactionActions {
  TradeOpen = "TradeOpen",
  TradeClose = "TradeClose",
  Stake = "Stake",
  Withdraw = "Withdraw",
  Settle = "Settle",
}

export interface Transaction {
  action: TransactionActions;
  hash: string;
  timestamp: number;
  finishedTimestamp?: number;
  done: boolean;
}

export const txs = createSlice({
  name: "ui",
  initialState: [] as Transaction[],
  reducers: {
    addTxReducer: (state, action: { payload: Transaction }) => {
      state.push(action.payload);
      return state;
    },
    markTxAsDoneReducer: (state, action: { payload: string }) => {
      const tx = state.find((tx) => tx.hash === action.payload);
      if (tx) {
        const timestamp = new Date().getTime();

        tx.done = true;
        tx.finishedTimestamp = timestamp;
      }
      return state;
    },
  },
});

export const { addTxReducer, markTxAsDoneReducer } = txs.actions;
