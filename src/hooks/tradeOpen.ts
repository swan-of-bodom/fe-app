import { AMM_METHODS, MAIN_CONTRACT_ADDRESS } from "../constants/amm";
import AmmAbi from "../abi/amm_abi.json";
import {
  Abi,
  AccountInterface,
  Contract,
  InvokeFunctionResponse,
  Provider,
} from "starknet";
import { OptionTradeArguments } from "../types/options";
import { approve } from "./approve";

export const tradeOpen = async (
  account: AccountInterface,
  option: OptionTradeArguments
) => {
  try {
    console.log(option);
    const res = await account.execute(
      {
        contractAddress: MAIN_CONTRACT_ADDRESS,
        entrypoint: AMM_METHODS.TRADE_OPEN,
        calldata: [
          option.optionType, // option_type : OptionType,
          option.strikePrice, // strike_price : Math64x61_,
          option.maturity.toString(), // maturity : Int,
          option.optionSide, // option_side : OptionSide,
          option.optionSize, // option_size : Math64x61_,
          option.quoteToken, // quote_token_address: Address,
          option.baseToken, // base_token_address: Address,
        ],
      },
      [AmmAbi] as Abi[]
    );
    return res;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const tradeOpenContract = async (
  contract: Contract,
  option: OptionTradeArguments
) => {
  try {
    const res = await contract.invoke(AMM_METHODS.TRADE_OPEN, [
      option.optionType, // option_type : OptionType,
      option.strikePrice, // strike_price : Math64x61_,
      option.maturity.toString(), // maturity : Int,
      option.optionSide, // option_side : OptionSide,
      option.optionSize, // option_size : Math64x61_,
      option.quoteToken, // quote_token_address: Address,
      option.baseToken, // base_token_address: Address,
    ]);
    return res;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const approveAndTrade = async (
  account: AccountInterface,
  address: string,
  option: OptionTradeArguments
): Promise<InvokeFunctionResponse | null> => {
  const provider = new Provider();

  const approveResponse = await approve(account, address, option.optionSize);

  console.log("Approve response", approveResponse);

  if (!approveResponse?.transaction_hash) {
    return null;
  }

  await provider.waitForTransaction(approveResponse.transaction_hash);

  console.log("Done waiting for approve", approveResponse);

  const tradeResponse = await tradeOpen(account, option);

  console.log("Done trading", tradeResponse);

  return tradeResponse;
};
