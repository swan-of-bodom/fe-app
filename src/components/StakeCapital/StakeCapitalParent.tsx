import {
  Box,
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

const NoContent = () => (
  <Box sx={{ textAlign: "center" }}>
    <p>Connect wallet to stake capital</p>
  </Box>
);

export const StakeCapitalParent = () => {
  const account = useAccount();
  const sx = { fontWeight: "bold" };

  if (!account) return <NoContent />;

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
        <StakeCapitalItem account={account} type={OptionType.Call} />
        <StakeCapitalItem account={account} type={OptionType.Put} />
      </TableBody>
    </Table>
  );
};
