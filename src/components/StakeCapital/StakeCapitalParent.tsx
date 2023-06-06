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
import { timestampToReadableDate } from "../../utils/utils";

export const StakeCapitalParent = () => {
  const account = useAccount();
  const sx = { fontWeight: "bold" };

  const pools = [
    getPoolByPairType(TokenPairKey.EthUsdc, OptionType.Call),
    getPoolByPairType(TokenPairKey.EthUsdc, OptionType.Put),
  ];

  const MAINNET_LAUNCH_TIMESTAMP = 1680864820000;
  const yslTooltipText = `Annual Percentage Yield calculated from the launch to Mainnet on ${timestampToReadableDate(
    MAINNET_LAUNCH_TIMESTAMP
  )}`;
  const apyTooltipText =
    "APY (Annual Percentage Yield) is calculated based on the last week and represents the annualized yield of the pool. Keep in mind that it does NOT account for risk and that past returns do not imply future returns.";

  return (
    <Table aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell>
            <Typography sx={sx}>Pool</Typography>
          </TableCell>
          <TableCell align="center">
            <Tooltip title={yslTooltipText}>
              <Typography sx={sx}>APY since launch</Typography>
            </Tooltip>
          </TableCell>
          <TableCell align="center">
            <RouterLink
              style={{ textDecoration: "none", color: "inherit" }}
              to="/apy-info"
            >
              <Tooltip title={apyTooltipText}>
                <Typography sx={sx}>
                  APY last week
                  <Info sx={{ height: "17px", marginBottom: "-2px" }} />
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
