import { bnToOptionType } from "../utils/conversions";
import { OptionType } from "../types/options";
import { Token, TokenKey, getTokenByAddress } from "../tokens/tokens";
import { getMultipleTokensValueInUsd } from "../tokens/tokenPrices";
import { BigNumberish } from "starknet";
import { toHex } from "../utils/utils";
import { shortInteger } from "../utils/computations";
import {
  BASE_DIGITS,
  BTC_USDC_CALL_ADDRESS,
  BTC_USDC_PUT_ADDRESS,
  ETH_USDC_CALL_ADDRESS,
  ETH_USDC_PUT_ADDRESS,
} from "../constants/amm";
import { getUnlockedCapital } from "../calls/getUnlockedCapital";

export class Pool {
  public baseToken: Token;
  public quoteToken: Token;
  public type: OptionType;
  public pair: string;
  public lpAddress: string;
  public id: string;

  constructor(base: BigNumberish, quote: BigNumberish, type: BigNumberish) {
    this.baseToken = getTokenByAddress(base);
    this.quoteToken = getTokenByAddress(quote);
    this.type = bnToOptionType(type);
    this.id = this.generateId();
    this.pair = this.baseToken.id + this.quoteToken.id;

    switch ((this.baseToken.id, this.quoteToken.id, this.type)) {
      case (TokenKey.ETH, TokenKey.USDC, OptionType.Call):
        this.lpAddress = ETH_USDC_CALL_ADDRESS;

        break;
      case (TokenKey.ETH, TokenKey.USDC, OptionType.Put):
        this.lpAddress = ETH_USDC_PUT_ADDRESS;

        break;
      case (TokenKey.BTC, TokenKey.USDC, OptionType.Call):
        this.lpAddress = BTC_USDC_CALL_ADDRESS;

        break;
      case (TokenKey.BTC, TokenKey.USDC, OptionType.Put):
        this.lpAddress = BTC_USDC_PUT_ADDRESS;

        break;
      default:
        throw Error(
          `Invalid Pool ${this.baseToken.id + this.quoteToken.id + this.type}`
        );
    }
  }

  /**
   * Generates id that uniquily describes pool
   */
  generateId(): string {
    return JSON.stringify({
      base: this.baseToken.id,
      quote: this.quoteToken.id,
      type: this.type,
    });
  }

  eq(other: Pool): boolean {
    return this.id === other.id;
  }

  isType(type: OptionType): boolean {
    return this.type === type;
  }

  async tokenPricesInUsd() {
    const [base, quote] = await getMultipleTokensValueInUsd([
      this.baseToken.id,
      this.quoteToken.id,
    ]);
    return { base, quote };
  }

  async getUnlocked() {
    return getUnlockedCapital(this.lpAddress);
  }

  ////////////
  // GETTERS
  ////////////

  get typeAsText(): string {
    return this.type === OptionType.Call ? "Call" : "Put";
  }

  get isCall(): boolean {
    return this.type === OptionType.Call;
  }

  get isPut(): boolean {
    return this.type === OptionType.Put;
  }

  get underlying(): Token {
    return this.isCall ? this.baseToken : this.quoteToken;
  }

  get digits(): number {
    // call has base decimals, put has quote decimals
    return this.underlying.decimals;
  }

  get tokenAddress(): string {
    return this.underlying.tokenAddress;
  }

  get symbol(): string {
    return this.underlying.symbol;
  }

  get name(): string {
    return `${this.baseToken.symbol}/${this.quoteToken.symbol} ${this.typeAsText} Pool (${this.symbol})`;
  }
}

export class PoolInfo extends Pool {
  public stakedHex: string;
  public stakedBase: bigint;
  public unlockedHex: string;
  public unlockedBase: bigint;
  public poolPositionHex: string;
  public poolPositionBase: bigint;

  constructor(
    base: BigNumberish,
    quote: BigNumberish,
    type: BigNumberish,
    staked: BigNumberish,
    unlocked: BigNumberish,
    poolPosition: BigNumberish
  ) {
    super(base, quote, type);

    this.stakedHex = toHex(staked);
    this.unlockedHex = toHex(unlocked);
    this.poolPositionHex = toHex(poolPosition);

    this.stakedBase = BigInt(staked);
    this.unlockedBase = BigInt(unlocked);
    this.poolPositionBase = BigInt(poolPosition);
  }
}

export class UserPoolInfo extends Pool {
  public valueHex: string;
  public valueBase: bigint;
  public value: number;
  public sizeHex: string;
  public sizeBase: bigint;
  public size: number;

  constructor(
    base: BigNumberish,
    quote: BigNumberish,
    type: BigNumberish,
    size: BigNumberish,
    value: BigNumberish
  ) {
    super(base, quote, type);
    this.sizeHex = toHex(size);
    this.sizeBase = BigInt(size);
    // size is in LP digits - always 18
    this.size = shortInteger(this.sizeHex, BASE_DIGITS);
    this.valueHex = toHex(value);
    this.valueBase = BigInt(value);
    // value is in digits by type
    this.value = shortInteger(this.valueHex, this.digits);
  }
}
