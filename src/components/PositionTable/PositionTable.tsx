import { CompositeOption, OptionSide, OptionType } from "../../types/options";
import { isNonEmptyArray } from "../../utils/utils";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { useAccount } from "@starknet-react/core";
import { useEffect, useState } from "react";
import { PositionItem } from "./PositionItem";
import { debug } from "../../utils/debugger";
import { AMM_METHODS } from "../../constants/amm";
import BN from "bn.js";
import { LoadingAnimation } from "../loading";
import { NoContent } from "../TableNoContent";

import { getMainContract } from "../../utils/blockchain";

const parsePosition = (arr: BN[]): CompositeOption => {
  const raw = {
    option_side: arr[0],
    maturity: arr[1],
    strike_price: arr[2],
    quote_token_address: arr[3],
    base_token_address: arr[4],
    option_type: arr[5],
    position_size: arr[6],
    value_of_position: arr[7],
  };

  const precision = 1000000;

  const type =
    new BN(arr[5]).toString(10) === OptionType.Call
      ? OptionType.Call
      : OptionType.Put;
  const parsed = {
    optionSide:
      new BN(arr[0]).toString(10) === OptionSide.Long
        ? OptionSide.Long
        : OptionSide.Short,
    maturity: new BN(arr[1]).toNumber(),
    strikePrice: new BN(arr[2]).div(new BN(2).pow(new BN(61))).toString(10),
    quoteToken: "0x" + new BN(arr[3]).toString(16),
    baseToken: "0x" + new BN(arr[4]).toString(16),
    optionType: type,
    positionSize:
      new BN(arr[6])
        .mul(new BN(precision))
        .div(new BN(2).pow(new BN(61)))
        .toNumber() / precision,
    positionValue:
      new BN(arr[6])
        .mul(new BN(precision))
        .div(new BN(2).pow(new BN(61)))
        .toNumber() / precision,
  };
  return { raw, parsed };
};

export const parseBatchOfOptions = (arr: BN[]): CompositeOption[] => {
  const a = 8;
  const l = arr.length;
  const options = [];

  for (let i = 0; i < l / a; i++) {
    const cur = arr.slice(i * a, (i + 1) * a);
    options.push(parsePosition(cur));
  }

  return options;
};

const fetchOptionsWithPosition = async (
  address: string,
  setList: (v: CompositeOption[]) => void,
  setLoading: (v: boolean) => void
) => {
  setLoading(true);

  const contract = getMainContract();

  const res = await contract[AMM_METHODS.GET_OPTION_WITH_POSITION_OF_USER](
    address
  ).catch((e: string) => {
    debug("Failed while calling", AMM_METHODS.GET_OPTION_WITH_POSITION_OF_USER);
    debug("error", e);
    return null;
  });

  if (isNonEmptyArray(res)) {
    const composite = parseBatchOfOptions(res[0]);
    debug("Fetched options with position", composite);
    setList(composite);
  }

  setLoading(false);
};

export const PositionTableComponent = () => {
  const [list, setList] = useState<CompositeOption[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { address, status } = useAccount();

  useEffect(() => {
    if (status === "connected" && address) {
      debug("Fetching positons");
      fetchOptionsWithPosition(address, setList, setLoading);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  if (!address)
    return <NoContent text="Connect your wallet to see your positions." />;

  if (loading)
    return (
      <Box sx={{ padding: "20px" }}>
        <LoadingAnimation size={40} />
      </Box>
    );

  if (!isNonEmptyArray(list))
    return (
      <NoContent text="It seems you are not currently holding any positions." />
    );

  return (
    <Table sx={{ minWidth: 650 }} aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell>Option</TableCell>
          <TableCell align="right">Maturity</TableCell>
          <TableCell align="right">Size</TableCell>
          <TableCell align="right">Value</TableCell>
          <TableCell align="right"></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {list.map((o, i: number) => (
          <PositionItem option={o} key={i} />
        ))}
      </TableBody>
    </Table>
  );
};
