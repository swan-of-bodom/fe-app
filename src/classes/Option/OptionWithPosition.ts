import { uint256toDecimal } from "../../utils/units";
import { math64x61toDecimal } from "../../utils/units";
import {
  ParsedOptionWithPosition,
  RawOptionWithPosition,
} from "../../types/options";
import { OptionClass } from "./Option";
import { ETH_DIGITS } from "../../constants/amm";

interface Props {
  raw: RawOptionWithPosition;
}

export class OptionWithPositionClass extends OptionClass {
  raw: RawOptionWithPosition;
  parsed: ParsedOptionWithPosition;
  id: string;

  constructor(props: Props) {
    super(props);
    this.raw = props.raw;
    this.parsed = this.parsedFromRaw(props.raw);
    this.id = this.generateId();
  }

  parsedFromRaw(raw: RawOptionWithPosition): ParsedOptionWithPosition {
    // Uint256 - just one part
    // ETH_DIGITS for token count
    const positionSize = uint256toDecimal(raw.position_size, ETH_DIGITS);
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
}
