import { addTx, markTxAsDone, markTxAsFailed } from "./../redux/actions";
import { AMM_METHODS, getTokenAddresses } from "../constants/amm";
import { AccountInterface } from "starknet";
import { Option } from "../types/options";
import { rawOptionToCalldata } from "../utils/parseOption";
import { debug } from "../utils/debugger";
import BN from "bn.js";
import {
  getPremiaWithSlippage,
  getToApprove,
  longInteger,
} from "../utils/computations";
import { convertSizeToInt } from "../utils/conversions";

import AmmAbi from "../abi/amm_abi.json";
import LpAbi from "../abi/lptoken_abi.json";
import { afterTransaction } from "../utils/blockchain";
import { invalidatePositions } from "../queries/client";
import { digitsByType, isCall } from "../utils/utils";
import { intToMath64x61 } from "../utils/units";
import { TransactionActions } from "../redux/reducers/transactions";

export const approveAndTradeOpen = async (
  account: AccountInterface,
  option: Option,
  size: number,
  premia: BN,
  cb: () => void
): Promise<boolean> => {
  const { ETH_ADDRESS, USD_ADDRESS, MAIN_CONTRACT_ADDRESS } =
    getTokenAddresses();
  const { optionType, optionSide } = option.parsed;

  debug("Approve and TradeOpen", {
    size: longInteger(size, 18).toString(10),
    premia: premia.toString(10),
  });

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

  const convertedSize = convertSizeToInt(size);

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
      ...rawOptionToCalldata(option.raw, convertedSize),
      intToMath64x61(
        getPremiaWithSlippage(premia, optionSide, false).toString(10),
        digitsByType(optionType)
      ),
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
        cb();
      },
      () => {
        markTxAsFailed(hash);
        cb();
      }
    );
  } else {
    throw Error("Trade open failed unexpectedly");
  }

  return true;
};
