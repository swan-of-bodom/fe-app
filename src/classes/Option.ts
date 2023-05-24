import {
  decimalToMath64x61,
  intToDecimal,
  math64x61ToInt,
  uint256toDecimal,
} from "../utils/units";
import BN from "bn.js";
import {
  bnToOptionType,
  bnToOptionSide,
  convertSizeToInt,
} from "../utils/conversions";
import { math64x61toDecimal } from "../utils/units";
import { digitsByType, timestampToReadableDate, toHex } from "../utils/utils";
import {
  RawOptionBase,
  ParsedOptionBase,
  OptionSide,
  OptionType,
  RawOptionWithPosition,
  RawOptionWithPremia,
  ParsedOptionWithPosition,
  ParsedOptionWithPremia,
} from "../types/options";
import { BASE_DIGITS } from "../constants/amm";
import { Token, TokenPair, getTokenPair } from "../pools/pools";

type Props =
  | {
      raw: RawOptionBase;
    }
  | {
      parsed: ParsedOptionBase;
    };

export class Option {
  raw: RawOptionBase;
  parsed: ParsedOptionBase;
  id: string;
  tokenPair: TokenPair;
  base: Token;
  quote: Token;

  constructor(props: Props) {
    if ("raw" in props) {
      this.raw = props.raw;
      this.parsed = this.parsedFromRaw(props.raw);
      this.id = this.generateId();
      this.tokenPair = getTokenPair(
        this.parsed.optionType,
        this.parsed.baseToken,
        this.parsed.quoteToken
      );
      this.base = this.tokenPair.base;
      this.quote = this.tokenPair.quote;
    } else if ("parsed" in props) {
      this.parsed = props.parsed;
      this.raw = this.rawFromParsed(props.parsed);
      this.id = this.generateId();
      this.tokenPair = getTokenPair(
        this.parsed.optionType,
        this.parsed.baseToken,
        this.parsed.quoteToken
      );
      this.base = this.tokenPair.base;
      this.quote = this.tokenPair.quote;
    } else {
      throw Error("No option specified in constructor");
    }
  }

  parsedFromRaw(raw: RawOptionBase): ParsedOptionBase {
    return {
      optionSide: bnToOptionSide(raw.option_side),
      optionType: bnToOptionType(raw.option_type),
      maturity: new BN(raw.maturity).toNumber(),
      strikePrice: String(math64x61toDecimal(raw.strike_price.toString(10))),
      quoteToken: toHex(raw.quote_token_address),
      baseToken: toHex(raw.base_token_address),
    };
  }

  rawFromParsed(parsed: ParsedOptionBase): RawOptionBase {
    return {
      option_side: new BN(parsed.optionSide),
      maturity: new BN(parsed.maturity),
      strike_price: new BN(
        decimalToMath64x61(parseInt(parsed.strikePrice, 10))
      ),
      quote_token_address: new BN(parsed.quoteToken),
      base_token_address: new BN(parsed.baseToken),
      option_type: new BN(parsed.optionType),
    };
  }

  generateId(): string {
    return JSON.stringify(this.parsed, Object.keys(this.parsed).sort());
  }

  eq(other: Option): boolean {
    return this.id === other.id;
  }

  tradeCalldata(size: string | number): string[] {
    const targetSize = typeof size === "number" ? convertSizeToInt(size) : size;
    return [
      toHex(this.raw.option_type),
      toHex(this.raw.strike_price),
      new BN(this.raw.maturity).toString(10),
      toHex(this.raw.option_side),
      targetSize,
      toHex(this.raw.quote_token_address),
      toHex(this.raw.base_token_address),
    ];
  }

  addPosition(position_size: BN, value_of_position: BN): OptionWithPosition {
    const raw: RawOptionWithPosition = {
      ...this.raw,
      position_size,
      value_of_position,
    };
    return new OptionWithPosition({ raw });
  }

  addPremia(premia: BN): OptionWithPremia {
    const raw: RawOptionWithPremia = {
      ...this.raw,
      premia,
    };
    return new OptionWithPremia({ raw });
  }

  isSide(side: OptionSide): boolean {
    return this.parsed.optionSide === side;
  }

  isType(type: OptionType): boolean {
    return this.parsed.optionType === type;
  }

  ////////////
  // GETTERS
  ////////////

  get otherSideOption(): Option {
    const otherSide =
      this.parsed.optionSide === OptionSide.Long
        ? OptionSide.Short
        : OptionSide.Long;
    const parsed: ParsedOptionBase = {
      ...this.parsed,
      optionSide: otherSide,
    };
    return new Option({ parsed });
  }

  get typeAsText(): string {
    return this.parsed.optionType === OptionType.Call ? "Call" : "Put";
  }

  get sideAsText(): string {
    return this.parsed.optionSide === OptionSide.Long ? "Long" : "Short";
  }

  get isCall(): boolean {
    return this.parsed.optionType === OptionType.Call;
  }

  get isPut(): boolean {
    return this.parsed.optionType === OptionType.Put;
  }

  get isLong(): boolean {
    return this.parsed.optionSide === OptionSide.Long;
  }

  get isShort(): boolean {
    return this.parsed.optionSide === OptionSide.Short;
  }

  get display(): string {
    return `${this.sideAsText} ${this.typeAsText} - strike price $${
      this.parsed.strikePrice
    } - expires ${timestampToReadableDate(this.parsed.maturity * 1000)}`;
  }

  get isFresh(): boolean {
    return this.parsed.maturity * 1000 > new Date().getTime();
  }

  get isExpired(): boolean {
    return !this.isFresh;
  }

  get struct(): string[] {
    return [
      toHex(this.raw.option_side),
      new BN(this.raw.maturity).toString(10),
      toHex(this.raw.strike_price),
      toHex(this.raw.quote_token_address),
      toHex(this.raw.base_token_address),
      toHex(this.raw.option_type),
    ];
  }

  get digits(): number {
    return this.tokenPair.decimals;
  }

  get tokenAddress(): string {
    return this.tokenPair.tokenAddress;
  }

  get symbol(): string {
    return this.tokenPair.symbol;
  }
}

export class OptionWithPosition extends Option {
  raw: RawOptionWithPosition;
  parsed: ParsedOptionWithPosition;
  id: string;

  constructor(props: { raw: RawOptionWithPosition }) {
    super(props);
    this.raw = props.raw;
    this.parsed = this.parsedFromRaw(props.raw);
    this.id = this.generateId();
  }

  parsedFromRaw(raw: RawOptionWithPosition): ParsedOptionWithPosition {
    // Uint256 - just one part
    // ETH_DIGITS for token count
    const positionSize = uint256toDecimal(raw.position_size, BASE_DIGITS);
    // math64_61
    const positionValue = math64x61toDecimal(
      raw.value_of_position.toString(10)
    );

    const withoutPosition = super.parsedFromRaw(raw);

    return {
      ...withoutPosition,
      positionSize,
      positionValue,
    };
  }

  get fullSize(): string {
    return new BN(this.raw.position_size).toString(10);
  }
}

export class OptionWithPremia extends Option {
  raw: RawOptionWithPremia;
  parsed: ParsedOptionWithPremia;
  id: string;

  constructor(props: { raw: RawOptionWithPremia }) {
    super(props);
    this.raw = props.raw;
    this.parsed = this.parsedFromRaw(props.raw);
    this.id = this.generateId();
  }

  parsedFromRaw(raw: RawOptionWithPremia): ParsedOptionWithPremia {
    const type = bnToOptionType(raw.option_type);
    const digits = digitsByType(type);
    const premiaBase = math64x61ToInt(raw.premia.toString(10), digits);
    const premiaDecimal = intToDecimal(premiaBase, digits);

    const withoutPosition = super.parsedFromRaw(raw);

    return {
      ...withoutPosition,
      premiaBase,
      premiaDecimal,
    };
  }
}
