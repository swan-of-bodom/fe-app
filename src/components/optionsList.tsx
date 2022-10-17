import { OptionIdentifier, OptionSide, OptionType } from "../types/options.d";
import { Box, Stack } from "@mui/material";
import {
  USD_ADDRESS,
  ETH_ADDRESS,
  AMM_METHODS,
  LPTOKEN_CONTRACT_ADDRESS,
} from "../constants/amm";
import { OptionPreview } from "./optionPreview";
import { useAmmContract } from "../hooks/amm";
import { useStarknetCall } from "@starknet-react/core";
import { parseRawOption } from "../utils/parseOption";
import { isNonEmptyArray } from "../utils/utils";

// These are now outdated
const options: OptionIdentifier[] = [
  {
    optionSide: OptionSide.Short,
    optionType: OptionType.Put,
    maturity: 1669849199,
    strikePrice: "1200",
    quoteToken: USD_ADDRESS,
    baseToken: ETH_ADDRESS,
  },
  {
    optionSide: OptionSide.Long,
    optionType: OptionType.Put,
    maturity: 1669849199,
    strikePrice: "1200",
    quoteToken: USD_ADDRESS,
    baseToken: ETH_ADDRESS,
  },
  {
    optionSide: OptionSide.Short,
    optionType: OptionType.Put,
    maturity: 1669849199,
    strikePrice: "1500",
    quoteToken: USD_ADDRESS,
    baseToken: ETH_ADDRESS,
  },
];

export const OptionsList = () => {
  const { contract } = useAmmContract();

  const { data } = useStarknetCall({
    contract,
    method: AMM_METHODS.GET_AVAILABLE_OPTIONS,
    args: [LPTOKEN_CONTRACT_ADDRESS, 5],
    options: {
      watch: false,
    },
  });

  if (isNonEmptyArray(data)) {
    // Currently only returns one option
    const option = parseRawOption(data[0]);

    if (option) {
      return (
        <Box sx={{ width: "100%" }}>
          <Stack spacing={2}>
            <OptionPreview option={option} />
          </Stack>
        </Box>
      );
    }
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Stack spacing={2}>
        {options.map((o, i) => (
          <OptionPreview option={o} key={i} />
        ))}
      </Stack>
    </Box>
  );
};
