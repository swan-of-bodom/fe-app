import { Info } from "@mui/icons-material";
import { Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { Pool } from "../../classes/Pool";
import { BTC_ADDRESS, ETH_ADDRESS, USDC_ADDRESS } from "../../constants/amm";
import { useAccount } from "../../hooks/useAccount";
import tableStyles from "../../style/table.module.css";
import { OptionType } from "../../types/options";
import { timestampToReadableDate } from "../../utils/utils";
import { StakeCapitalItem } from "./StakeItem";

const POOLS = [
  new Pool(ETH_ADDRESS, USDC_ADDRESS, OptionType.Call),
  new Pool(ETH_ADDRESS, USDC_ADDRESS, OptionType.Put),
  new Pool(BTC_ADDRESS, USDC_ADDRESS, OptionType.Call),
  new Pool(BTC_ADDRESS, USDC_ADDRESS, OptionType.Put),
];

export const StakeCapitalParent = () => {
  const account = useAccount();

  const MAINNET_LAUNCH_TIMESTAMP = 1680864820000;
  const yslTooltipText = `Annual Percentage Yield calculated from the launch to Mainnet on ${timestampToReadableDate(
    MAINNET_LAUNCH_TIMESTAMP
  )}.\nCurrently showing legacy protocol APY.`;
  const apyTooltipText =
    "APY (Annual Percentage Yield) is calculated based on the last week and represents the annualized yield of the pool. Keep in mind that it does NOT account for risk and that past returns do not imply future returns.\nCurrently showing legacy protocol APY.";

  return (
    <Table aria-label="simple table" className={tableStyles.table}>
      <TableHead>
        <TableRow>
          <TableCell>
            <Typography>Pool</Typography>
          </TableCell>
          <TableCell align="center" sx={{ whiteSpace: "nowrap" }}>
            <Tooltip title={yslTooltipText}>
              <Typography>v0 APY all time</Typography>
            </Tooltip>
          </TableCell>
          <TableCell align="center" sx={{ whiteSpace: "nowrap" }}>
            <RouterLink
              style={{ textDecoration: "none", color: "inherit" }}
              to="/apy-info"
            >
              <Tooltip title={apyTooltipText}>
                <Typography>
                  v0 APY last week
                  <Info sx={{ height: "17px", marginBottom: "-2px" }} />
                </Typography>
              </Tooltip>
            </RouterLink>
          </TableCell>

          <TableCell align="center">
            <Typography>Amount</Typography>
          </TableCell>
          <TableCell align="center"></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {POOLS.map((pool, i) => (
          <StakeCapitalItem key={i} account={account} pool={pool} />
        ))}
      </TableBody>
    </Table>
  );
};
