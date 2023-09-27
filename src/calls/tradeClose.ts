import { AMM_ADDRESS, AMM_METHODS } from "../constants/amm";
import AmmAbi from "../abi/amm_abi.json";
import { AccountInterface } from "starknet";
import { OptionWithPosition } from "../classes/Option";
import { debug, LogTypes } from "../utils/debugger";
import { invalidatePositions } from "../queries/client";
import { afterTransaction } from "../utils/blockchain";
import { getPremiaWithSlippage } from "../utils/computations";
import {
  addTx,
  markTxAsDone,
  markTxAsFailed,
  showToast,
} from "../redux/actions";
import { TransactionAction } from "../redux/reducers/transactions";
import { ToastType } from "../redux/reducers/ui";

export const tradeClose = async (
  account: AccountInterface,
  option: OptionWithPosition,
  premia: bigint,
  size: number,
  isClosing: boolean
) => {
  try {
    // one hour from now
    const deadline = String(Math.round(new Date().getTime() / 1000) + 60 * 60);

    const premiaWithSlippage = getPremiaWithSlippage(
      BigInt(premia),
      option.side,
      isClosing
    ).toString(10);

    debug({ premiaWithSlippage, premia });

    const call = {
      contractAddress: AMM_ADDRESS,
      entrypoint: AMM_METHODS.TRADE_CLOSE,
      calldata: [...option.tradeCalldata(size), premiaWithSlippage, deadline],
    };

    debug("Executing following call:", call);
    const res = await account.execute(call, [AmmAbi]);
    if (res?.transaction_hash) {
      const hash = res.transaction_hash;
      addTx(hash, option.id, TransactionAction.TradeClose);
      afterTransaction(
        hash,
        () => {
          markTxAsDone(hash);
          invalidatePositions();
          showToast("Position closed successfully", ToastType.Success);
        },
        () => {
          markTxAsFailed(hash);
          showToast("Position closed failed", ToastType.Error);
        }
      );
    }
    return res;
  } catch (e) {
    debug(LogTypes.ERROR, e);
    return null;
  }
};
