import BN from "bn.js";
import {
  AMM_METHODS,
  ETH_BASE_VALUE,
  USD_BASE_VALUE,
  getTokenAddresses,
} from "../../constants/amm";
import { debug } from "../../utils/debugger";
import { Abi, AccountInterface } from "starknet";
import LpAbi from "../../abi/lptoken_abi.json";
import AmmAbi from "../../abi/amm_abi.json";
import { OptionType } from "../../types/options";

/*

func deposit_liquidity{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
    pooled_token_addr: Address,
    quote_token_address: Address,
    base_token_address: Address,
    option_type: OptionType,
    amount: Uint256
) {
pro call ETH, USD, ETH, 0, AMOUNT_in_wei
pro put USD, USD, ETH, 0, AMOUNT_in_usd_base

*/

const precission = 1000;

const getBaseAmountWei = (amount: number) =>
  new BN(amount * precission)
    .mul(ETH_BASE_VALUE)
    .div(new BN(precission))
    .toString(16);

const getBaseAmountUsd = (amount: number) =>
  new BN(amount * precission)
    .mul(USD_BASE_VALUE)
    .div(new BN(precission))
    .toString(16);

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
  const multicall = await account
    .execute([approveCalldata, depositLiquidityCalldata], [
      LpAbi,
      AmmAbi,
    ] as Abi[])
    .catch((e: Error) => {
      debug('"Stake capital" user rejected or failed');
      debug("error", e.message);
      return e;
    });
  debug("Deposit liquidity response", multicall);
  setLoading(false);
};
