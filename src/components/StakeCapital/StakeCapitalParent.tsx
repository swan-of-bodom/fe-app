import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { OptionType } from "../../types/options";
import { StakeCapitalItem } from "./StakeItem";
import { useAccount } from "../../hooks/useAccount";

const NoContent = () => (
  <Box sx={{ textAlign: "center" }}>
    <p>Connect wallet to stake capital</p>
  </Box>
);

export const StakeCapitalParent = () => {
  const account = useAccount();

  if (!account) return <NoContent />;

  return (
    <Table aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell>Pool</TableCell>
          <TableCell align="center">APY</TableCell>
          <TableCell align="center">Amount</TableCell>
          <TableCell align="center"></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <StakeCapitalItem account={account} type={OptionType.Call} />
        <StakeCapitalItem account={account} type={OptionType.Put} />
      </TableBody>
    </Table>
  );
};
