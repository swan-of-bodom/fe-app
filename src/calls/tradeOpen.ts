import { UserBalance } from "./../types/wallet";
import {
  addTx,
  markTxAsDone,
  markTxAsFailed,
  showToast,
} from "./../redux/actions";
import { AMM_ADDRESS, AMM_METHODS } from "../constants/amm";
import { AccountInterface } from "starknet";
import { Option } from "../classes/Option";
import { debug } from "../utils/debugger";
import { getToApprove, shortInteger } from "../utils/computations";

import AmmAbi from "../abi/amm_abi.json";
import LpAbi from "../abi/lptoken_abi.json";
import { afterTransaction } from "../utils/blockchain";
import { invalidatePositions } from "../queries/client";
import { intToMath64x61 } from "../utils/units";
import { TransactionAction } from "../redux/reducers/transactions";
import { ToastType } from "../redux/reducers/ui";

export const approveAndTradeOpen = async (
  account: AccountInterface,
  option: Option,
  size: number,
  premia: bigint,
  balance: UserBalance,
  updateTradeState: ({
    failed,
    processing,
  }: {
    failed: boolean;
    processing: boolean;
  }) => void
): Promise<boolean> => {
  const toApprove = getToApprove(
    option.type,
    option.side,
    size,
    premia,
    option.strike
  );

  const tokenId = option.underlying.id;

  if (balance[tokenId] < toApprove) {
    const [has, needs] = [
      shortInteger(balance[tokenId].toString(10), option.digits),
      shortInteger(toApprove.toString(10), option.digits),
    ];
    debug({ size, premia, has, needs });
    showToast(
      `To open this position you need ${option.symbol}${needs.toFixed(
        4
      )}, but you only have ${option.symbol}${has.toFixed(4)}`,
      ToastType.Warn
    );
    throw Error("Not enough funds");
  }

  const approveArgs = {
    contractAddress: option.tokenAddress,
    entrypoint: AMM_METHODS.APPROVE,
    calldata: [AMM_ADDRESS, toApprove.toString(10), "0"],
  };

  // one hour from now
  const deadline = String(Math.round(new Date().getTime() / 1000) + 60 * 60);

  const calldata = [
    ...option.tradeCalldata(size),
    intToMath64x61(premia.toString(10), option.digits), // cubit
    "0", // cubit false
    deadline,
  ];

  debug("TRADE OPEN CALLDATA", calldata);

  const tradeOpenArgs = {
    contractAddress: AMM_ADDRESS,
    entrypoint: AMM_METHODS.TRADE_OPEN,
    calldata,
  };

  const res = await account
    .execute([approveArgs, tradeOpenArgs], [LpAbi, AmmAbi])
    .catch((e) => {
      debug("Trade open rejected or failed", e.message);
      throw Error("Trade open rejected or failed");
    });

  if (res?.transaction_hash) {
    const hash = res.transaction_hash;
    addTx(hash, option.id, TransactionAction.TradeOpen);
    afterTransaction(
      hash,
      () => {
        markTxAsDone(hash);
        invalidatePositions();
        updateTradeState({
          failed: false,
          processing: false,
        });
        showToast("Successfully opened position", ToastType.Success);
      },
      () => {
        markTxAsFailed(hash);
        updateTradeState({
          failed: true,
          processing: false,
        });
        showToast("Failed to open position", ToastType.Error);
      }
    );
  } else {
    throw Error("Trade open failed unexpectedly");
  }

  return true;
};
