import {
  AMM_METHODS,
  BASE_MATH_64_61,
  getTokenAddresses,
} from "../constants/amm";
import { Abi, AccountInterface } from "starknet";
import { CompositeOption, OptionSide, OptionType } from "../types/options";
import { rawOptionToCalldata } from "../utils/parseOption";
import { debug } from "../utils/debugger";
import BN from "bn.js";
import { getToApprove, PRECISION } from "../utils/computations";
import { toHex } from "starknet/utils/number";

import AmmAbi from "../abi/amm_abi.json";
import LpAbi from "../abi/lptoken_abi.json";

export const approveAndTradeOpen = async (
  account: AccountInterface,
  option: CompositeOption,
  size: number,
  optionType: OptionType,
  optionSide: OptionSide,
  premia: BN
): Promise<boolean> => {
  const { ETH_ADDRESS, USD_ADDRESS, MAIN_CONTRACT_ADDRESS } =
    getTokenAddresses();

  const toApprove = await getToApprove(
    optionType,
    optionSide,
    size,
    premia
  ).catch((e) => {
    debug("Getting amount to approve failed:", e.message);
    return null;
  });

  if (!toApprove) {
    return false;
  }

  const size64x61 = new BN(size * PRECISION)
    .mul(BASE_MATH_64_61)
    .div(new BN(PRECISION))
    .toString(10);

  const approveCalldata = {
    contractAddress: optionType === OptionType.Call ? ETH_ADDRESS : USD_ADDRESS,
    entrypoint: AMM_METHODS.APPROVE,
    calldata: [MAIN_CONTRACT_ADDRESS, toHex(new BN(toApprove)), 0],
  };

  const tradeOpenCalldata = {
    contractAddress: MAIN_CONTRACT_ADDRESS,
    entrypoint: AMM_METHODS.TRADE_OPEN,
    calldata: rawOptionToCalldata(option.raw, size64x61),
  };

  let success = true;

  await account
    .execute([approveCalldata, tradeOpenCalldata], [LpAbi, AmmAbi] as Abi[])
    .catch((e) => {
      debug("Trade open rejected or failed", e.message);
      success = false;
    });

  debug("Done trading, sucess:", success);

  return success;
};
