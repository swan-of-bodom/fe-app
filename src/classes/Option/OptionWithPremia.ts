import { intToDecimal, math64x61ToInt } from "../../utils/units";
import {
  ParsedOptionWithPremia,
  RawOptionWithPremia,
} from "../../types/options";
import { OptionClass } from "./Option";
import { digitsByType } from "../../utils/utils";
import { bnToOptionType } from "../../utils/conversions";

interface Props {
  raw: RawOptionWithPremia;
}

export class OptionWithPremiaClass extends OptionClass {
  raw: RawOptionWithPremia;
  parsed: ParsedOptionWithPremia;
  id: string;

  constructor(props: Props) {
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
