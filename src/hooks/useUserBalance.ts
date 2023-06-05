import { UserBalance } from "./../types/wallet";
import { getUserBalance } from "./../calls/balanceOf";
import { useAccount } from "./useAccount";
import { QueryFunctionContext, useQuery } from "react-query";
import { QueryKeys } from "../queries/keys";
import { AccountInterface } from "starknet";

export const queryUserBalance = async ({
  queryKey,
}: QueryFunctionContext<[string, AccountInterface | undefined]>): Promise<
  UserBalance | undefined
> => {
  const account = queryKey[1];
  if (!account) {
    return;
  }
  return getUserBalance(account);
};

export const useUserBalance = (): UserBalance | undefined => {
  const account = useAccount();
  const { data } = useQuery([QueryKeys.userBalance, account], queryUserBalance);

  return data;
};
