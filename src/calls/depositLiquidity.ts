import { AMM_METHODS, getTokenAddresses } from "../constants/amm";
import { debug } from "../utils/debugger";
import { AccountInterface } from "starknet";
import LpAbi from "../abi/lptoken_abi.json";
import AmmAbi from "../abi/amm_abi.json";
import { OptionType } from "../types/options";
import { afterTransaction } from "../utils/blockchain";
import { currencyAddresByType } from "../utils/utils";

export const depositLiquidity = async (
  account: AccountInterface,
  size: string,
  type: OptionType,
  ok: () => void,
  nok: () => void
): Promise<void> => {
  const { USD_ADDRESS, ETH_ADDRESS, MAIN_CONTRACT_ADDRESS } =
    getTokenAddresses();

  const currencyAddress = currencyAddresByType(type);

  const approveCalldata = {
    contractAddress: currencyAddress,
    entrypoint: AMM_METHODS.APPROVE,
    calldata: [MAIN_CONTRACT_ADDRESS, size, "0"],
  };

  const depositLiquidityCalldata = {
    contractAddress: MAIN_CONTRACT_ADDRESS,
    entrypoint: AMM_METHODS.DEPOSIT_LIQUIDITY,
    calldata: [currencyAddress, USD_ADDRESS, ETH_ADDRESS, type, size, "0"],
  };

  debug("Depositing liquidity with calldata:", [
    approveCalldata,
    depositLiquidityCalldata,
  ]);

  const res = await account
    .execute([approveCalldata, depositLiquidityCalldata], [LpAbi, AmmAbi])
    .catch((e: Error) => {
      debug('"Stake capital" user rejected or failed');
      debug("error", e.message);
    });

  if (res?.transaction_hash) {
    afterTransaction(res.transaction_hash, () => {
      // everything done - OK callback
      ok();
    });
  } else {
    // transaction was not successfully created (no txhash)
    // NotOK callback
    nok();
  }
};
