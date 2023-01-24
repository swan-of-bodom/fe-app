import { Abi, Contract } from "starknet";
import { getTokenAddresses } from "../constants/amm";

import AmmAbi from "../abi/amm_abi.json";
import { store } from "../redux/store";

export const getMainContract = (): Contract => {
  const provider = store.getState().network.provider;
  const { MAIN_CONTRACT_ADDRESS } = getTokenAddresses();
  return new Contract(AmmAbi as Abi, MAIN_CONTRACT_ADDRESS, provider);
};

export const afterTransaction = (tx: string, cb: () => void) => {
  const provider = store.getState().network.provider;
  provider.waitForTransaction(tx).then(cb);
};
