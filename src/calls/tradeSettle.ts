import { AMM_METHODS, getTokenAddresses } from "../constants/amm";
import AmmAbi from "../abi/amm_abi.json";
import { AccountInterface } from "starknet";
import { OptionWithPosition } from "../types/options";
import { rawOptionToCalldata } from "../utils/parseOption";
import { debug, LogTypes } from "../utils/debugger";
import { invalidatePositions } from "../queries/client";
import { afterTransaction } from "../utils/blockchain";
import { fullSizeInt } from "../utils/conversions";

export const tradeSettle = async (
  account: AccountInterface,
  option: OptionWithPosition
) => {
  try {
    const call = {
      contractAddress: getTokenAddresses().MAIN_CONTRACT_ADDRESS,
      entrypoint: AMM_METHODS.TRADE_SETTLE,
      calldata: rawOptionToCalldata(option.raw, fullSizeInt(option)),
    };
    debug("Executing following call:", call);
    const res = await account.execute(call, [AmmAbi]);
    if (res?.transaction_hash) {
      afterTransaction(res.transaction_hash, invalidatePositions);
    }
    return res;
  } catch (e) {
    debug(LogTypes.ERROR, e);
    return null;
  }
};
