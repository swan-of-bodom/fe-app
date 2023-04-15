import { decimalToMath64x61 } from "../../utils/units";
import BN from "bn.js";
import { bnToOptionType, bnToOptionSide } from "../../utils/conversions";
import { math64x61toDecimal } from "../../utils/units";
import { timestampToReadableDate, toHex } from "../../utils/utils";
import {
  RawOptionBase,
  ParsedOptionBase,
  OptionSide,
  OptionType,
  RawOptionWithPosition,
  RawOptionWithPremia,
} from "../../types/options";
import { OptionWithPositionClass } from "./OptionWithPosition";
import { OptionWithPremiaClass } from "./OptionWithPremia";

export interface RawProps {
  raw: RawOptionBase;
}

export interface ParsedProps {
  parsed: ParsedOptionBase;
}

type Props = RawProps | ParsedProps;

export class OptionClass {
  raw: RawOptionBase;
  parsed: ParsedOptionBase;
  id: string;

  constructor(props: Props) {
    if ("raw" in props) {
      this.raw = props.raw;
      this.parsed = this.parsedFromRaw(props.raw);
      this.id = this.generateId();
    } else if ("parsed" in props) {
      this.parsed = props.parsed;
      this.raw = this.rawFromParsed(props.parsed);
      this.id = this.generateId();
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

  eq(other: OptionClass): boolean {
    return this.id === other.id;
  }

  addPosition(
    position_size: BN,
    value_of_position: BN
  ): OptionWithPositionClass {
    const raw: RawOptionWithPosition = {
      ...this.raw,
      position_size,
      value_of_position,
    };
    return new OptionWithPositionClass({ raw });
  }

  addPremia(premia: BN): OptionWithPremiaClass {
    const raw: RawOptionWithPremia = {
      ...this.raw,
      premia,
    };
    return new OptionWithPremiaClass({ raw });
  }

  ////////////
  // GETTERS
  ////////////

  get otherSideOption(): OptionClass {
    const otherSide =
      this.parsed.optionSide === OptionSide.Long
        ? OptionSide.Short
        : OptionSide.Long;
    const parsed: ParsedOptionBase = {
      ...this.parsed,
      optionSide: otherSide,
    };
    return new OptionClass({ parsed });
  }

  get isExpired(): boolean {
    const nowInSecs = Math.floor(Date.now() / 1000);
    return this.parsed.maturity < nowInSecs;
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
}
