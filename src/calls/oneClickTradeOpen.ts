import {
  AMM_METHODS,
  BASE_MATH_64_61,
  getTokenAddresses,
} from "../constants/amm";
import { Abi, AccountInterface, InvokeFunctionResponse } from "starknet";
import { CompositeOption, OptionSide, OptionType } from "../types/options";
import { rawOptionToCalldata } from "../utils/parseOption";
import { debug } from "../utils/debugger";
import { getProvider } from "../utils/environment";
import BN from "bn.js";
import { getToApprove, PRECISION } from "../utils/computations";
import { toHex } from "starknet/utils/number";

import AmmAbi from "../abi/amm_abi.json";
import LpAbi from "../abi/lptoken_abi.json";

export const oneClickApproveAndTrade = async (
  account: AccountInterface,
  option: CompositeOption,
  size: number,
  optionType: OptionType,
  optionSide: OptionSide,
  premia: BN
): Promise<boolean> => {
  const provider = getProvider();
  const { ETH_ADDRESS, USD_ADDRESS, MAIN_CONTRACT_ADDRESS } =
    getTokenAddresses();

  if (!provider) {
    debug("Failed to get provider inside 'approveAndTrade'");
    return false;
  }

  const toApprove = getToApprove(optionType, optionSide, size, premia);

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
      debug("Trade open rejected or failed");
      success = false;
    });

  debug("Done trading, sucess:", success);

  return success;
};
