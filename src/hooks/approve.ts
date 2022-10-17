import { AMM_METHODS, ETH_ADDRESS } from "../constants/amm";
import { AccountInterface } from "starknet";

export const approve = async (
  account: AccountInterface,
  address: string,
  amount: string
) => {
  try {
    const res = await account.execute({
      contractAddress: ETH_ADDRESS,
      entrypoint: AMM_METHODS.APPROVE,
      calldata: [address, amount, 0],
    });
    return res;
  } catch (e) {
    console.error(e);
    return null;
  }
};
