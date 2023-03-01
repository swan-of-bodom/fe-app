import { AMM_METHODS, getTokenAddresses } from "../constants/amm";
import AmmAbi from "../abi/amm_abi.json";
import { AccountInterface } from "starknet";
import { OptionWithPosition } from "../types/options";
import { rawOptionToCalldata } from "../utils/parseOption";
import { debug, LogTypes } from "../utils/debugger";
import { invalidatePositions } from "../queries/client";
import { afterTransaction } from "../utils/blockchain";
import { fullSizeInt } from "../utils/conversions";
import { addTx, markTxAsDone } from "../redux/actions";
import { TransactionActions } from "../redux/reducers/transactions";

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
      const hash = res.transaction_hash;
      addTx(hash, TransactionActions.Settle);
      afterTransaction(res.transaction_hash, () => {
        markTxAsDone(hash);
        invalidatePositions();
      });
    }
    return res;
  } catch (e) {
    debug(LogTypes.ERROR, e);
    return null;
  }
};
