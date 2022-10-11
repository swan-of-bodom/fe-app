import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

import AmmAbi from "../abi/amm_abi.json";

export const useAmmContract = () => {
  return useContract({
    abi: AmmAbi as Abi,
    address:
      "0x031bc941e58ee989d346a3e12b2d367228c6317bb9533821ce7a29d487ae12bc",
  });
}
