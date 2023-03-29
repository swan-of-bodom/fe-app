import { OptionClass } from "./../classes/Option/index";

export interface RawTradeHistory {
  timestamp: number;
  action: string;
  caller: string;
  capital_transfered: string;
  option_tokens_minted: string;
  option_side: number;
  maturity: number;
  strike_price: string;
  quote_token_address: string;
  base_token_address: string;
  option_type: number;
}

export interface ITradeData {
  timestamp: number;
  action: string;
  caller: string;
  capital_transfered: string;
  option_tokens_minted: string;
}

export interface ITradeHistory extends ITradeData {
  option: OptionClass;
}
