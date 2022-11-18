import { Abi, AccountInterface } from "starknet";
import {
  AMM_METHODS,
  ETH_BASE_VALUE,
  getTokenAddresses,
} from "../../constants/amm";
import { OptionType } from "../../types/options";
import { debug } from "../../utils/debugger";
import AmmAbi from "../../abi/amm_abi.json";
import BN from "bn.js";

// "pooled_token_addr",

// "quote_token_address",

// "base_token_address",

// "option_type",

// "lp_token_amount": "Uint256"

const precission = 10000;

export const withdrawCall = async (
  account: AccountInterface,
  amount: number,
  type: OptionType
) => {
  const { ETH_ADDRESS, USD_ADDRESS, MAIN_CONTRACT_ADDRESS } =
    getTokenAddresses();

  const standardizedAmount = new BN(amount * precission)
    .mul(ETH_BASE_VALUE)
    .div(new BN(precission))
    .toString(10);

  const calldata = [
    type === OptionType.Call ? ETH_ADDRESS : USD_ADDRESS,
    USD_ADDRESS,
    ETH_ADDRESS,
    "0x" + type,
    standardizedAmount,
    "0",
  ];
  const withdraw = {
    contractAddress: MAIN_CONTRACT_ADDRESS,
    entrypoint: AMM_METHODS.WITHDRAW_LIQUIDITY,
    calldata,
  };
  debug(`Calling ${AMM_METHODS.WITHDRAW_LIQUIDITY}`, withdraw);
  const res = await account.execute(withdraw, [AmmAbi] as Abi[]).catch((e) => {
    debug("Withdraw rejected by user or failed\n", e.message);
    return e;
  });
  debug("Withdraw response", res);
};
