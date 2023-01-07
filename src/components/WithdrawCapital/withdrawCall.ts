import { Abi, AccountInterface } from "starknet";
import { AMM_METHODS, getTokenAddresses } from "../../constants/amm";
import { OptionType } from "../../types/options";
import { debug } from "../../utils/debugger";
import AmmAbi from "../../abi/amm_abi.json";
import { getBaseAmountUsd, getBaseAmountWei } from "../../utils/conversions";
import { invalidateStake } from "../../queries/client";
import { afterTransaction } from "../../utils/blockchain";

// "pooled_token_addr",
// "quote_token_address",
// "base_token_address",
// "option_type",
// "lp_token_amount": "Uint256"

export const withdrawCall = async (
  account: AccountInterface,
  amount: number,
  type: OptionType,
  setProcessing: (b: boolean) => void
) => {
  setProcessing(true);
  const { ETH_ADDRESS, USD_ADDRESS, MAIN_CONTRACT_ADDRESS } =
    getTokenAddresses();

  const baseAmount =
    type === OptionType.Call
      ? getBaseAmountWei(amount)
      : getBaseAmountUsd(amount);

  const calldata = [
    type === OptionType.Call ? ETH_ADDRESS : USD_ADDRESS,
    USD_ADDRESS,
    ETH_ADDRESS,
    "0x" + type,
    "0x" + baseAmount,
    0,
  ];
  const withdraw = {
    contractAddress: MAIN_CONTRACT_ADDRESS,
    entrypoint: AMM_METHODS.WITHDRAW_LIQUIDITY,
    calldata,
  };
  debug(`Calling ${AMM_METHODS.WITHDRAW_LIQUIDITY}`, withdraw);
  const res = await account.execute(withdraw, [AmmAbi] as Abi[]).catch((e) => {
    debug("Withdraw rejected by user or failed\n", e.message);
    setProcessing(false);
  });

  if (res?.transaction_hash) {
    afterTransaction(res.transaction_hash, () => {
      invalidateStake();
      setProcessing(false);
    });
  }
};
