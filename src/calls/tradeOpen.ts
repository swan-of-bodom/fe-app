import { AMM_METHODS, getTokenAddresses } from "../constants/amm";
import { Abi, AccountInterface } from "starknet";
import { CompositeOption, OptionSide, OptionType } from "../types/options";
import { rawOptionToCalldata } from "../utils/parseOption";
import { debug } from "../utils/debugger";
import BN from "bn.js";
import { getToApprove } from "../utils/computations";
import { convertSizeToInt } from "../utils/conversions";

import AmmAbi from "../abi/amm_abi.json";
import LpAbi from "../abi/lptoken_abi.json";
import { afterTransaction } from "../utils/blockchain";
import { invalidatePositions } from "../queries/client";
import { isCall } from "../utils/utils";

export const approveAndTradeOpen = async (
  account: AccountInterface,
  option: CompositeOption,
  size: number,
  optionType: OptionType,
  optionSide: OptionSide,
  premia: BN,
  cb: () => void
): Promise<boolean> => {
  const { ETH_ADDRESS, USD_ADDRESS, MAIN_CONTRACT_ADDRESS } =
    getTokenAddresses();

  const toApprove = getToApprove(
    optionType,
    optionSide,
    size,
    premia,
    parseInt(option.parsed.strikePrice, 10)
  );

  debug("to Approve:", {
    size,
    premia: new BN(premia).toString(10),
    toApprove: new BN(toApprove!).toString(10),
  });

  if (!toApprove) {
    throw Error("Failed getting to approve");
  }

  const convertedSize = convertSizeToInt(size, optionType);

  const approveCalldata = {
    contractAddress: isCall(optionType) ? ETH_ADDRESS : USD_ADDRESS,
    entrypoint: AMM_METHODS.APPROVE,
    calldata: [MAIN_CONTRACT_ADDRESS, new BN(toApprove).toString(10), "0"],
  };

  debug("Trade open approve calldata", approveCalldata);

  const tradeOpenCalldata = {
    contractAddress: MAIN_CONTRACT_ADDRESS,
    entrypoint: AMM_METHODS.TRADE_OPEN,
    calldata: rawOptionToCalldata(option.raw, convertedSize),
  };

  debug("Trade open trade calldata", tradeOpenCalldata);

  const res = await account
    .execute([approveCalldata, tradeOpenCalldata], [LpAbi, AmmAbi] as Abi[])
    .catch((e) => {
      debug("Trade open rejected or failed", e.message);
      throw Error("Trade open rejected or failed");
    });

  debug("Done trading", res);

  if (res?.transaction_hash) {
    afterTransaction(res.transaction_hash, () => {
      invalidatePositions();
      cb();
    });
  } else {
    throw Error("Trade open failed unexpectedly");
  }

  return true;
};
