import { createSlice } from "@reduxjs/toolkit";
import { getUsedNetwork } from "../../utils/environment";

export enum Envs {
  Devnet = "Devnet",
  Testnet = "Testnet",
  Mainnet = "Mainnet",
}

type EnvironmentSwitchAction = {
  type: string;
  payload: Envs;
};

export const environmentSwitch = createSlice({
  name: "environment",
  initialState: {
    currentEnv: getUsedNetwork(),
  },
  reducers: {
    setEnv: (state, action: EnvironmentSwitchAction) => {
      state.currentEnv = action.payload;
      return state;
    },
  },
});

export const { setEnv } = environmentSwitch.actions;
