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
import { Abi, Contract } from "starknet";
import { AMM_METHODS, ETH_BASE_VALUE } from "../../constants/amm";
import { debug } from "../../utils/debugger";
import { LoadingAnimation } from "../loading";
import { isNonEmptyArray } from "../../utils/utils";
import BN from "bn.js";
import { getProvider } from "../../utils/environment";

import LpAbi from "../../abi/lptoken_abi.json";
import { WithdrawItem } from "./WithdrawItem";
import { NoContent } from "../TableNoContent";
import { OptionType } from "../../types/options";
import { getMainContract } from "../../utils/blockchain";

/*

struct UserPoolInfo {
    value_of_user_stake: Uint256,
    quote_token_address: Address,
    base_token_address: Address,
    option_type: OptionType,
    lptoken_address: Address,
    staked_capital: Math64x61_,  // lpool_balance
    unlocked_capital: Math64x61_,
    value_of_pool_position: Math64x61_,
}

*/

const precision = 10000;

type StakedCapitalInfo = {
  stakedCapital: number;
  numberOfTokens: number;
  type: OptionType;
  poolInfo: Object;
};

const parseUserPool = (
  arr: any[],
  address: string
): Promise<StakedCapitalInfo>[] | null => {
  debug("Received data", arr, arr.length);

  if (!isNonEmptyArray(arr)) {
    debug("Empty array, nothing to parse");
    return null;
  }

  const res = arr.map(async ({ pool_info, value_of_user_stake }) => {
    debug("Mapping over pools", { pool_info, value_of_user_stake });

    const stakedCapital =
      new BN(value_of_user_stake.low)
        .mul(new BN(precision))
        .div(ETH_BASE_VALUE)
        .toNumber() / precision;

    const type = new BN(pool_info?.pool?.option_type).toString(
      10
    ) as OptionType;
    const lpAddress = "0x" + new BN(pool_info.lptoken_address).toString("hex");
    const provider = getProvider();
    const contract = new Contract(LpAbi as Abi, lpAddress, provider);
    const res = await contract.balanceOf(address);

    const numberOfTokens =
      new BN(res[0].low).mul(new BN(precision)).div(ETH_BASE_VALUE).toNumber() /
      precision;

    return { stakedCapital, numberOfTokens, type, poolInfo: pool_info };
  });

  return res;
};

const fetchCapital = async (
  address: string,
  setData: (v: any) => void,
  setLoading: (v: boolean) => void
) => {
  setLoading(true);
  const contract = getMainContract();
  const res = await contract[AMM_METHODS.GET_USER_POOL_INFOS](address).catch(
    (e: string) => {
      debug("Failed while calling", AMM_METHODS.GET_USER_POOL_INFOS);
      debug("error", e);
      setLoading(false);
      return;
    }
  );

  debug(AMM_METHODS.GET_USER_POOL_INFOS, "call returned", res);

  if (!isNonEmptyArray(res) || !isNonEmptyArray(res[0])) {
    debug("Got empty response while fetching capital");
    setLoading(false);
    return;
  }

  const promises = parseUserPool(res[0], address);

  if (!promises) {
    debug("Got null after parsing");
    setLoading(false);
    return;
  }

  const finalData = await Promise.all(promises).catch((e) => {
    debug("Parse user pool failed", e);
    return;
  });

  debug("Final data from pool", finalData);
  setData(finalData);
  setLoading(false);
};

export const WithdrawParent = () => {
  const { account, address } = useAccount();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (address) {
      fetchCapital(address, setData, setLoading);
    }
  }, [address]);

  if (loading) {
    return (
      <Box sx={{ padding: "20px" }}>
        <LoadingAnimation size={40} />
      </Box>
    );
  }

  if (!isNonEmptyArray(data))
    return <NoContent text="You currently do not have any staked capital." />;

  if (!account) return <NoContent text="No account." />;

  return (
    <Table sx={{ minWidth: 650 }} aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell>Value of staked capital</TableCell>
          <TableCell align="right"># LP Tokens</TableCell>
          <TableCell align="right">Amount to withdraw</TableCell>
          <TableCell align="right"></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map(({ stakedCapital, numberOfTokens, type, poolInfo }, i) => (
          <WithdrawItem
            key={i}
            account={account}
            size={stakedCapital}
            value={numberOfTokens}
            type={type}
            poolInfo={poolInfo}
          />
        ))}
      </TableBody>
    </Table>
  );
};
