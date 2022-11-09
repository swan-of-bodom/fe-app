import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

import AmmAbi from "../abi/amm_abi.json";
import { getTokenAddresses } from "../constants/amm";

export const useAmmContract = () =>
  useContract({
    abi: AmmAbi as Abi,
    address: getTokenAddresses().MAIN_CONTRACT_ADDRESS,
  });
