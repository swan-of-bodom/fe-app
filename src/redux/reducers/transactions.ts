import { createSlice } from "@reduxjs/toolkit";
import { constants } from "starknet";

export enum TransactionActions {
  TradeOpen = "TradeOpen",
  TradeClose = "TradeClose",
  Stake = "Stake",
  Withdraw = "Withdraw",
  Settle = "Settle",
}

export enum TransactionStatus {
  Pending = "Pending",
  Success = "Success",
  Failed = "Failed",
}

export interface Transaction {
  action: TransactionActions;
  hash: string;
  timestamp: number;
  finishedTimestamp?: number;
  status: TransactionStatus;
  chainId: constants.StarknetChainId;
}

export const txs = createSlice({
  name: "ui",
  initialState: [] as Transaction[],
  reducers: {
    addTxReducer: (state, action: { payload: Transaction }) => {
      state.push(action.payload);
      return state;
    },
    setTxStatusReducer: (
      state,
      action: { payload: { hash: string; status: TransactionStatus } }
    ) => {
      const tx = state.find((tx) => tx.hash === action.payload.hash);
      if (tx) {
        const timestamp = new Date().getTime();

        tx.status = action.payload.status;
        tx.finishedTimestamp = timestamp;
      }
      return state;
    },
  },
});

export const { addTxReducer, setTxStatusReducer } = txs.actions;
