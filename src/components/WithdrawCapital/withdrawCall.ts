import { Abi, AccountInterface } from "starknet";
import { AMM_METHODS, getTokenAddresses } from "../../constants/amm";
import { OptionType } from "../../types/options";
import { debug } from "../../utils/debugger";
import AmmAbi from "../../abi/amm_abi.json";

// "pooled_token_addr",

// "quote_token_address",

// "base_token_address",

// "option_type",

// "lp_token_amount": "Uint256"

export const withdrawCall = async (
  account: AccountInterface,
  amount: number,
  type: OptionType
) => {
  const { ETH_ADDRESS, USD_ADDRESS, MAIN_CONTRACT_ADDRESS } =
    getTokenAddresses();

  const putPoolCalldata = [ETH_ADDRESS, USD_ADDRESS, ETH_ADDRESS, amount, "0"];
  const callPoolCalldata = [USD_ADDRESS, USD_ADDRESS, ETH_ADDRESS, amount, "0"];
  const withdraw = {
    contractAddress: MAIN_CONTRACT_ADDRESS,
    entrypoint: AMM_METHODS.WITHDRAW_LIQUIDITY,
    calldata: type === OptionType.Call ? callPoolCalldata : putPoolCalldata,
  };
  debug(`Calling ${AMM_METHODS.WITHDRAW_LIQUIDITY}`, withdraw);
  const res = await account.execute(withdraw, [AmmAbi] as Abi[]);
  debug("Withdraw response", res);
};
