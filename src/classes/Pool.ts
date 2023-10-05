import { bnToOptionType } from "../utils/conversions";
import { OptionType } from "../types/options";
import { getMultipleTokensValueInUsd } from "../tokens/tokenPrices";
import { BigNumberish, Call } from "starknet";
import { toHex } from "../utils/utils";
import { shortInteger } from "../utils/computations";
import {
  AMM_ADDRESS,
  AMM_METHODS,
  BASE_DIGITS,
  BTC_USDC_CALL_ADDRESS,
  BTC_USDC_PUT_ADDRESS,
  ETH_USDC_CALL_ADDRESS,
  ETH_USDC_PUT_ADDRESS,
} from "../constants/amm";
import { getUnlockedCapital } from "../calls/getUnlockedCapital";
import { Pair, PairKey } from "./Pair";
import { Token } from "./Token";

export class Pool extends Pair {
  public type: OptionType;
  public lpAddress: string;
  public poolId: string;

  constructor(base: BigNumberish, quote: BigNumberish, type: BigNumberish) {
    super(base, quote);
    this.type = bnToOptionType(type);
    this.poolId = this.generateId();

    switch (this.pairId + this.type) {
      case PairKey.ETH_USDC + OptionType.Call:
        this.lpAddress = ETH_USDC_CALL_ADDRESS;

        break;
      case PairKey.ETH_USDC + OptionType.Put:
        this.lpAddress = ETH_USDC_PUT_ADDRESS;

        break;
      case PairKey.BTC_USDC + OptionType.Call:
        this.lpAddress = BTC_USDC_CALL_ADDRESS;

        break;
      case PairKey.BTC_USDC + OptionType.Put:
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
    return JSON.stringify([
      BigInt(this.baseToken.address).toString(36),
      BigInt(this.quoteToken.address).toString(36),
      BigInt(this.type).toString(10),
    ]);
  }

  eq(other: Pool): boolean {
    return this.poolId === other.poolId;
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

  isPair(key: PairKey): boolean {
    return this.pairId === key;
  }

  private _depositWithdrawCalldata(amount: BigNumberish): BigNumberish[] {
    return [
      this.underlying.address,
      this.quoteToken.address,
      this.baseToken.address,
      this.type,
      BigInt(amount).toString(10),
      "0", // uint256 0
    ];
  }

  depositLiquidityCalldata(amount: BigNumberish): Call {
    return {
      contractAddress: AMM_ADDRESS,
      entrypoint: AMM_METHODS.DEPOSIT_LIQUIDITY,
      calldata: this._depositWithdrawCalldata(amount),
    };
  }

  withdrawLiquidityCalldata(amount: BigNumberish): Call {
    return {
      contractAddress: AMM_ADDRESS,
      entrypoint: AMM_METHODS.WITHDRAW_LIQUIDITY,
      calldata: this._depositWithdrawCalldata(amount),
    };
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

  // Address of the underlying token
  get tokenAddress(): string {
    return this.underlying.address;
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
