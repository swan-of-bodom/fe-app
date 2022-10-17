import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

import AmmAbi from "../abi/amm_abi.json";
import { MAIN_CONTRACT_ADDRESS } from "../constants/amm";

export const useAmmContract = () => {
  return useContract({
    abi: AmmAbi as Abi,
    address: MAIN_CONTRACT_ADDRESS,
  });
};
