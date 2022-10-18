import { AMM_METHODS, ETH_ADDRESS } from "../constants/amm";
import { AccountInterface } from "starknet";
import { toBN, toHex } from "starknet/utils/number";

export const approve = async (
  account: AccountInterface,
  address: string,
  amount: number
) => {
  try {
    const call = {
      contractAddress: ETH_ADDRESS,
      entrypoint: AMM_METHODS.APPROVE,
      calldata: [address, toHex(toBN(amount)), 0],
    };
    console.log("Executing following call:", call);
    const res = await account.execute(call);
    return res;
  } catch (e) {
    console.error(e);
    return null;
  }
};
