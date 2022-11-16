import BN from "bn.js";
import {
  AMM_METHODS,
  ETH_BASE_VALUE,
  getTokenAddresses,
} from "../../constants/amm";
import { debug } from "../../utils/debugger";
import { Abi, AccountInterface } from "starknet";
import LpAbi from "../../abi/lptoken_abi.json";
import AmmAbi from "../../abi/amm_abi.json";
import { OptionType } from "../../types/options";
import { getProvider } from "../../utils/environment";

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

export const handleStake = async (
  account: AccountInterface,
  amount: number,
  setLoading: (v: boolean) => void
) => {
  debug("Staking", amount);
  setLoading(true);

  const provider = getProvider();

  if (!provider) {
    debug("Failed to get provider inside 'handleStake'");
    setLoading(false);
    return;
  }

  const wei = new BN(amount * precission)
    .mul(ETH_BASE_VALUE)
    .div(new BN(precission))
    .toString(16);

  const { ETH_ADDRESS, USD_ADDRESS, MAIN_CONTRACT_ADDRESS } =
    getTokenAddresses();
  //  /*
  const approveCalldata = {
    contractAddress: ETH_ADDRESS,
    entrypoint: AMM_METHODS.APPROVE,
    calldata: [MAIN_CONTRACT_ADDRESS, "0x" + wei, 0],
  };

  debug("Approve call", approveCalldata);

  const approveRes = await account
    .execute(approveCalldata, [LpAbi] as Abi[])
    .catch((e: Error) => {
      debug('"Approve stake" user rejected or failed');
      debug("error", e.message);
    });

  if (!approveRes?.transaction_hash) {
    debug("Approve did not return transaction_hash", approveRes);
    setLoading(false);
    return;
  }

  await provider.waitForTransaction(approveRes.transaction_hash);

  debug("Stake deposit approved");
  //*/
  const depositLiquidityCalldata = {
    contractAddress: MAIN_CONTRACT_ADDRESS,
    entrypoint: AMM_METHODS.DEPOSIT_LIQUIDITY,
    calldata: [
      ETH_ADDRESS, // ETH pro call pool , USD pro put pool
      USD_ADDRESS,
      ETH_ADDRESS,
      OptionType.Call,
      "0x" + wei,
      0,
    ],
  };
  debug("Depositing liquidity", depositLiquidityCalldata);
  const depositRes = await account
    .execute(depositLiquidityCalldata, [AmmAbi] as Abi[])
    .catch((e: Error) => {
      debug('"Stake capital - deposit liquidity" user rejected or failed');
      debug("error", e.message);
    });
  debug("Deposit liquidity res", depositRes);
  setLoading(false);
};
