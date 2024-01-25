import { TableCell, TableRow, Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";

import { Pool } from "../../classes/Pool";
import { QueryKeys } from "../../queries/keys";
import { fetchStakeCapital } from "./fetchStakeCapital";
import { LoadingAnimation } from "../Loading/Loading";

type Props = {
  pool: Pool;
};

export const CapitalItem = ({ pool }: Props) => {
  const [unCapital, setUnCapital] = useState("0");
  const [lockCapital, setLockCapital] = useState("0");
  const { data, isLoading, isError } = useQuery(
    [QueryKeys.stake, pool],
    fetchStakeCapital
  );

  useEffect(() => {
    if (data && data.status === "success") {
      setUnCapital(BigInt(data.data.unlocked_cap).toString(10));
      setLockCapital(BigInt(data.data.locked_cap).toString(10));
    }
  }, [data, pool]);
  return (
    <TableRow>
      {isLoading && (
        <Box sx={{ padding: "20px" }}>
          <LoadingAnimation size={20} />
        </Box>
      )}
      {isError && <TableCell>Failed fetching data.</TableCell>}
      {data && data.status === "success" && (
        <>
          <TableCell>UNLOCKED CAPITAL: {unCapital}</TableCell>
          <TableCell>LOCKED CAPITAL: {lockCapital}</TableCell>
        </>
      )}
    </TableRow>
  );
};
