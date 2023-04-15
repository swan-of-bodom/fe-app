import { ETH_DIGITS, USD_DIGITS } from "./../constants/amm";
import { UserBalance } from "./../types/wallet";
import {
  addTx,
  markTxAsDone,
  markTxAsFailed,
  showToast,
} from "./../redux/actions";
import { AMM_METHODS, getTokenAddresses } from "../constants/amm";
import { AccountInterface } from "starknet";
import { Option } from "../classes/Option";
import { debug } from "../utils/debugger";
import BN from "bn.js";
import { getToApprove, shortInteger } from "../utils/computations";

import AmmAbi from "../abi/amm_abi.json";
import LpAbi from "../abi/lptoken_abi.json";
import { afterTransaction } from "../utils/blockchain";
import { invalidatePositions } from "../queries/client";
import { digitsByType, isCall } from "../utils/utils";
import { intToMath64x61 } from "../utils/units";
import { TransactionActions } from "../redux/reducers/transactions";
import { ToastType } from "../redux/reducers/ui";

export const approveAndTradeOpen = async (
  account: AccountInterface,
  option: Option,
  size: number,
  premia: BN,
  balance: UserBalance,
  updateTradeState: ({
    failed,
    processing,
  }: {
    failed: boolean;
    processing: boolean;
  }) => void
): Promise<boolean> => {
  const { ETH_ADDRESS, USD_ADDRESS, MAIN_CONTRACT_ADDRESS } =
    getTokenAddresses();
  const { optionType, optionSide } = option.parsed;

  const toApprove = getToApprove(
    optionType,
    optionSide,
    size,
    premia,
    parseInt(option.parsed.strikePrice, 10)
  );

  if (isCall(optionType)) {
    // Call - make sure user has enough ETH
    if (balance.eth.lt(toApprove)) {
      const [has, needs] = [
        shortInteger(balance.eth.toString(10), ETH_DIGITS),
        shortInteger(toApprove.toString(10), ETH_DIGITS),
      ];
      showToast(
        `To open this position you need ETH${needs.toFixed(
          4
        )}, but you only have ETH${has.toFixed(4)}`,
        ToastType.Warn
      );
      throw Error("Not enough funds");
    }
  } else {
    // Put - make sure user has enough USD
    if (balance.usd.lt(toApprove)) {
      const [has, needs] = [
        shortInteger(balance.usd.toString(10), USD_DIGITS),
        shortInteger(toApprove.toString(10), USD_DIGITS),
      ];
      showToast(
        `To open this position you need $${needs.toFixed(
          4
        )}, but you only have $${has.toFixed(4)}`,
        ToastType.Warn
      );
      throw Error("Not enough funds");
    }
  }

  const approveArgs = {
    contractAddress: isCall(optionType) ? ETH_ADDRESS : USD_ADDRESS,
    entrypoint: AMM_METHODS.APPROVE,
    calldata: [MAIN_CONTRACT_ADDRESS, new BN(toApprove).toString(10), "0"],
  };

  debug("Trade open approve calldata", approveArgs);

  // one hour from now
  const deadline = String(Math.round(new Date().getTime() / 1000) + 60 * 60);

  const tradeOpenArgs = {
    contractAddress: MAIN_CONTRACT_ADDRESS,
    entrypoint: AMM_METHODS.TRADE_OPEN,
    calldata: [
      ...option.tradeCalldata(size),
      intToMath64x61(premia.toString(10), digitsByType(optionType)),
      deadline,
    ],
  };

  debug("Trade open trade calldata", tradeOpenArgs);

  const res = await account
    .execute([approveArgs, tradeOpenArgs], [LpAbi, AmmAbi])
    .catch((e) => {
      debug("Trade open rejected or failed", e.message);
      throw Error("Trade open rejected or failed");
    });

  debug("Done trading", res);

  if (res?.transaction_hash) {
    const hash = res.transaction_hash;
    addTx(hash, TransactionActions.TradeOpen);
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
