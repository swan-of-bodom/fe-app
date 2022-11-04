import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";
import LpAbi from "../abi/lptoken_abi.json";
import { getTokenAddresses } from "../constants/amm";

export const useLpContract = () => {
  return useContract({
    abi: LpAbi as Abi,
    address: getTokenAddresses().LPTOKEN_CONTRACT_ADDRESS,
  });
};
