import { createSlice } from "@reduxjs/toolkit";
import { retrieveSettings } from "../../utils/settings";
import { NetworkState } from "../../types/network";
import { getProviderByNetwork } from "../../network/provider";

const getInitialNetworkState = (): NetworkState => {
  const networkName = retrieveSettings().network;
  const provider = getProviderByNetwork(networkName);

  return {
    wallet: undefined,
    provider,
    network: {
      name: networkName,
    },
  };
};

export const network = createSlice({
  name: "network",
  initialState: getInitialNetworkState(),
  reducers: {
    updateNetworkState: (state, action: { payload: Partial<NetworkState> }) => {
      state = { ...state, ...action.payload };
      return state;
    },
  },
});

export const { updateNetworkState } = network.actions;
