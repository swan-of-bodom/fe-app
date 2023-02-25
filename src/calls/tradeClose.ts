import { ETH_DIGITS } from "./../constants/amm";
import { AMM_METHODS, getTokenAddresses } from "../constants/amm";
import AmmAbi from "../abi/amm_abi.json";
import { AccountInterface } from "starknet";
import { OptionWithPosition } from "../types/options";
import { rawOptionToCalldata } from "../utils/parseOption";
import { debug, LogTypes } from "../utils/debugger";
import { invalidatePositions } from "../queries/client";
import { afterTransaction } from "../utils/blockchain";
import { getPremiaWithSlippage, longInteger } from "../utils/computations";
import { Math64x61 } from "../types/units";
import BN from "bn.js";

export const tradeClose = async (
  account: AccountInterface,
  option: OptionWithPosition,
  premia: Math64x61,
  size: number,
  isClosing: boolean
) => {
  const { optionSide } = option.parsed;

  try {
    // one hour from now
    const deadline = String(Math.round(new Date().getTime() / 1000) + 60 * 60);

    const premiaWithSlippage = getPremiaWithSlippage(
      new BN(premia),
      optionSide,
      isClosing
    ).toString(10);

    debug({ premiaWithSlippage, premia });

    const call = {
      contractAddress: getTokenAddresses().MAIN_CONTRACT_ADDRESS,
      entrypoint: AMM_METHODS.TRADE_CLOSE,
      calldata: [
        ...rawOptionToCalldata(
          option.raw,
          longInteger(size, ETH_DIGITS).toString(10)
        ),
        premiaWithSlippage,
        deadline,
      ],
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
