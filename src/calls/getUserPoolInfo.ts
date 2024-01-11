import {
  BTC_USDC_CALL_ADDRESS,
  ETH_USDC_PUT_ADDRESS,
  BTC_USDC_PUT_ADDRESS,
} from "./../constants/amm";
import { debug } from "./../utils/debugger";
import {
  AMM_METHODS,
  ETH_USDC_CALL_ADDRESS,
  isMainnet,
} from "../constants/amm";
import { ResponseUserPoolInfo } from "../types/pool";
import { AMMContract } from "../utils/blockchain";
import { parseUserPoolInfo } from "../utils/poolParser/parsePool";
import { UserPoolInfo } from "../classes/Pool";
import { Contract } from "starknet";
import AuxAbi from "../abi/aux_abi.json";
import { provider } from "../network/provider";

const method = AMM_METHODS.GET_USER_POOL_INFOS;

const getUserPoolInfoAuxContract = async (
  address: string
): Promise<UserPoolInfo[]> => {
  const AuxContract = new Contract(
    AuxAbi,
    "0x051e4bb147f0cc73b9c06c4b155ff4986226091162d9f616097d5c77c13d9395",
    provider
  );

  const lpAddresses = [
    ETH_USDC_CALL_ADDRESS,
    ETH_USDC_PUT_ADDRESS,
    BTC_USDC_CALL_ADDRESS,
    BTC_USDC_PUT_ADDRESS,
  ];

  const promises = lpAddresses.map((lpAddress) =>
    AuxContract.call("get_user_pool_info", [address, lpAddress])
  );

  const res = await Promise.all(promises);

  console.log("HEEERERERERERE", res);

  const parsed = (res as ResponseUserPoolInfo[]).map((v) =>
    parseUserPoolInfo(v)
  );

  return parsed;
};

export const getUserPoolInfo = async (
  address: string
): Promise<UserPoolInfo[]> => {
  if (isMainnet) {
    return await getUserPoolInfoAuxContract(address);
  }
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
