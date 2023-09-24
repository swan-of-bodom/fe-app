import {
  AMM_METHODS,
  ETH_ADDRESS,
  ETH_DIGITS,
  ETH_USDC_CALL_ADDRESS,
  ETH_USDC_PUT_ADDRESS,
  USDC_ADDRESS,
  USDC_DIGITS,
} from "../constants/amm";
import { AMMContract } from "../utils/blockchain";
import { shortInteger } from "../utils/computations";
import { debug } from "../utils/debugger";
import BN from "bn.js";
import { uint256 } from "starknet";

export const lpoolBalance = async (lpoolAddress: string): Promise<BN> => {
  const balanceRes = await AMMContract.call(AMM_METHODS.GET_LOOP_BALANCE, [
    lpoolAddress,
  ]).catch((e: Error) => {
    debug(`Failed while calling ${AMM_METHODS.GET_LOOP_BALANCE}`, e.message);
    throw Error(e.message);
  });

  const converted = uint256.uint256ToBN(balanceRes[0]);
  return converted;
};

export const lpoolLimit = async (tokenAddress: string): Promise<BN> => {
  const limitRes = await AMMContract.call(AMM_METHODS.GET_MAX_LPOOL_BALANCE, [
    tokenAddress,
  ]).catch((e: Error) => {
    debug(
      `Failed while calling ${AMM_METHODS.GET_MAX_LPOOL_BALANCE}`,
      e.message
    );
    throw Error(e.message);
  });

  const converted = uint256.uint256ToBN(limitRes[0]);
  return converted;
};

type PoolLimit = {
  base: BN;
  converted: number;
  symbol: string;
};

export const poolLimit = async (lpoolAddress: string): Promise<PoolLimit> => {
  if (
    lpoolAddress !== ETH_USDC_CALL_ADDRESS &&
    lpoolAddress !== ETH_USDC_PUT_ADDRESS
  ) {
    // weird to address
    debug("wrong to address", lpoolAddress);
  }
  const [tokenAddress, decimals, symbol] =
    lpoolAddress === ETH_USDC_CALL_ADDRESS
      ? [ETH_ADDRESS, ETH_DIGITS, "ETH"]
      : [USDC_ADDRESS, USDC_DIGITS, "USDC"];

  const [balance, limit] = await Promise.all([
    lpoolBalance(lpoolAddress),
    lpoolLimit(tokenAddress),
  ]).catch((e) => {
    debug("Failed getting poolLimit", e);
    throw Error(e);
  });

  const _stakable = limit.sub(balance);
  const zero = new BN(0);
  const stakable = _stakable.gt(zero) ? _stakable : zero;
  const converted = shortInteger(stakable.toString(10), decimals);

  debug(
    `balance: ${balance.toString(10)}\nlimit:  ${limit.toString(
      10
    )}\nstakable: ${stakable}`
  );

  return {
    base: stakable,
    converted,
    symbol,
  };
};
