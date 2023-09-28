import { debug } from "./../utils/debugger";
import { AMM_METHODS } from "../constants/amm";
import { ResponseUserPoolInfo } from "../types/pool";
import { AMMContract } from "../utils/blockchain";
import { parseUserPoolInfo } from "../utils/poolParser/parsePool";
import { UserPoolInfo } from "../classes/Pool";

const method = AMM_METHODS.GET_USER_POOL_INFOS;

export const getUserPoolInfo = async (
  address: string
): Promise<UserPoolInfo[]> => {
  debug({ method, address, AMMContract });
  const res = await AMMContract.call(method, [address]).catch((e: string) => {
    debug(`Failed while calling ${method}\n`, e);
    throw Error(`Failed while calling ${method}`);
  });

  const parsed = (res as ResponseUserPoolInfo[]).map((v) =>
    parseUserPoolInfo(v)
  );

  return parsed;
};
