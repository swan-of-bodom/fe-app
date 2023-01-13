import { debug } from "../../utils/debugger";
import { QueryFunctionContext } from "react-query";
import { getUserPoolInfo } from "../../calls/getUserPoolInfo";
import { UserPoolInfo } from "../../types/pool";

export const fetchCapital = async ({
  queryKey,
}: QueryFunctionContext<[string, string]>): Promise<
  UserPoolInfo[] | undefined
> => {
  const address = queryKey[1];

  const userPools = await getUserPoolInfo(address);

  debug("Parsed pools", userPools);

  return userPools;
};
