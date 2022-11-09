import { createSlice } from "@reduxjs/toolkit";
import { CompositeOption, RawOption } from "../../types/options";
import { isNonEmptyArray } from "../../utils/utils";

export enum FetchState {
  NotStarted = "not-started",
  Done = "done",
  Failed = "failed",
  Fetching = "fetching",
}

export const optionsList = createSlice({
  name: "optionsList",
  initialState: {
    rawOptionsList: [] as RawOption[],
    compositeOptionsList: [] as CompositeOption[],
    state: FetchState.NotStarted,
    balanceState: FetchState.NotStarted,
  },
  reducers: {
    setOptions: (state, action) => {
      const arr: RawOption[] = action.payload;
      isNonEmptyArray(arr) && (state.rawOptionsList = arr);
      return state;
    },
    setCompositeOptions: (state, action) => {
      const arr: CompositeOption[] = action.payload;
      isNonEmptyArray(arr) && (state.compositeOptionsList = arr);
      return state;
    },
    setFetchState: (state, action) => {
      state.state = action.payload;
    },
    setBalanceFetchState: (state, action) => {
      state.balanceState = action.payload;
    },
  },
});

export const {
  setOptions,
  setCompositeOptions,
  setFetchState,
  setBalanceFetchState,
} = optionsList.actions;
