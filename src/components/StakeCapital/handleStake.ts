import { AMM_METHODS, getTokenAddresses } from "../../constants/amm";
import { debug } from "../../utils/debugger";
import { Abi, AccountInterface } from "starknet";
import LpAbi from "../../abi/lptoken_abi.json";
import AmmAbi from "../../abi/amm_abi.json";
import { OptionType } from "../../types/options";
import { getBaseAmountUsd, getBaseAmountWei } from "../../utils/computations";
import { afterTransaction } from "../../utils/blockchain";
import { invalidateStake } from "../../queries/client";

export const handleStake = async (
  account: AccountInterface,
  amount: number,
  type: OptionType,
  setLoading: (v: boolean) => void
) => {
  debug(
    `Staking ${amount} into ${type === OptionType.Call ? "call" : "put"} pool`
  );
  setLoading(true);

  const baseAmount =
    type === OptionType.Call
      ? getBaseAmountWei(amount)
      : getBaseAmountUsd(amount);

  const { ETH_ADDRESS, USD_ADDRESS, MAIN_CONTRACT_ADDRESS } =
    getTokenAddresses();

  const approveCalldata = {
    contractAddress: type === OptionType.Call ? ETH_ADDRESS : USD_ADDRESS,
    entrypoint: AMM_METHODS.APPROVE,
    calldata: [MAIN_CONTRACT_ADDRESS, "0x" + baseAmount, 0],
  };

  const depositLiquidityCalldata = {
    contractAddress: MAIN_CONTRACT_ADDRESS,
    entrypoint: AMM_METHODS.DEPOSIT_LIQUIDITY,
    calldata: [
      type === OptionType.Call ? ETH_ADDRESS : USD_ADDRESS, // ETH pro call pool , USD pro put pool
      USD_ADDRESS,
      ETH_ADDRESS,
      type,
      "0x" + baseAmount,
      0,
    ],
  };
  debug("Depositing liquidity with calldata:", [
    approveCalldata,
    depositLiquidityCalldata,
  ]);
  const res = await account
    .execute([approveCalldata, depositLiquidityCalldata], [
      LpAbi,
      AmmAbi,
    ] as Abi[])
    .catch((e: Error) => {
      debug('"Stake capital" user rejected or failed');
      debug("error", e.message);
      return;
    });
  debug("Deposit liquidity response", res);

  if (res?.transaction_hash) {
    afterTransaction(res.transaction_hash, () => {
      invalidateStake();
      setLoading(false);
    });
  } else {
    setLoading(false);
  }
};
