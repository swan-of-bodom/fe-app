import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { OptionType } from "../../types/options";
import { StakeCapitalItem } from "./StakeItem";
import { useAccount } from "../../hooks/useAccount";
import { Link as RouterLink } from "react-router-dom";
import { Info } from "@mui/icons-material";
import { TokenPairKey, getPoolByPairType } from "../../tokens/tokens";

export const StakeCapitalParent = () => {
  const account = useAccount();
  const sx = { fontWeight: "bold" };

  const pools = [
    getPoolByPairType(TokenPairKey.EthUsdc, OptionType.Call),
    getPoolByPairType(TokenPairKey.EthUsdc, OptionType.Put),
  ];

  return (
    <Table aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell>
            <Typography sx={sx}>Pool</Typography>
          </TableCell>

          <TableCell align="center">
            <RouterLink
              style={{ textDecoration: "none", color: "inherit" }}
              to="/apy-info"
            >
              <Tooltip title="Click for more information">
                <Typography sx={sx}>
                  APY <Info sx={{ height: "17px", marginBottom: "-2px" }} />
                </Typography>
              </Tooltip>
            </RouterLink>
          </TableCell>

          <TableCell align="center">
            <Typography sx={sx}>Amount</Typography>
          </TableCell>
          <TableCell align="center"></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {pools.map((pool, i) => (
          <StakeCapitalItem key={i} account={account} pool={pool} />
        ))}
      </TableBody>
    </Table>
  );
};
