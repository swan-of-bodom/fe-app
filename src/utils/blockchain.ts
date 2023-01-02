import { Abi, Contract } from "starknet";
import { getProvider } from "./environment";
import { getTokenAddresses } from "../constants/amm";

import AmmAbi from "../abi/amm_abi.json";

export const getMainContract = (): Contract => {
  const provider = getProvider();
  const { MAIN_CONTRACT_ADDRESS } = getTokenAddresses();
  return new Contract(AmmAbi as Abi, MAIN_CONTRACT_ADDRESS, provider);
};

export const afterTransaction = (tx: string, cb: () => void) => {
  const provider = getProvider();
  provider?.waitForTransaction(tx).then(cb);
};
