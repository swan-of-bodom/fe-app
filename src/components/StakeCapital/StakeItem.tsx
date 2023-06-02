import {
  Button,
  TableCell,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { CSSProperties, useEffect, useState } from "react";
import { AccountInterface } from "starknet";
import { handleStake } from "./handleStake";
import { handleNumericChangeFactory } from "../../utils/inputHandling";
import { openCallWidoDialog, openPutWidoDialog } from "../../redux/actions";
import { Pool } from "../../classes/Pool";

type Props = {
  account: AccountInterface | undefined;
  pool: Pool;
};

const getApy = async (setApy: (n: number) => void, pool: Pool) => {
  const poolId = pool.isCall ? "eth-usdc-call" : "eth-usdc-put";
  fetch(`https://api.carmine.finance/api/v1/mainnet/${poolId}/apy`)
    .then((response) => response.json())
    .then((result) => {
      if (result && result.status === "success") {
        setApy(result.data);
      }
    });
};

export const StakeCapitalItem = ({ account, pool }: Props) => {
  const [amount, setAmount] = useState<number>(0);
  const [text, setText] = useState<string>("0");
  const [loading, setLoading] = useState<boolean>(false);
  const [apy, setApy] = useState<number | undefined>();
  const theme = useTheme();

  useEffect(() => {
    getApy(setApy, pool);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = handleNumericChangeFactory(setText, setAmount);

  const apyTooltipText =
    "APY (Annual Percentage Yield) is calculated based on the last week and represents the annualized yield of the pool. Keep in mind that it does NOT account for risk and that past returns do not imply future returns.";
  const displayApy = "--";
  //   apy === undefined ? "--" : `${apy < 0 ? "" : "+"}${apy.toFixed(2)}%`;
  const apySx: CSSProperties = { fontWeight: "bold", textAlign: "center" };
  // if (apy && apy < 0) {
  //   apySx.color = theme.palette.error.main;
  // } else if (apy && apy > 0) {
  //   apySx.color = theme.palette.success.main;
  // }

  const handleWidoClick = () => {
    pool.isCall ? openCallWidoDialog() : openPutWidoDialog();
  };

  return (
    <TableRow>
      <TableCell>
        <Typography>{pool.name}</Typography>
      </TableCell>
      <TableCell>
        <Tooltip title={apyTooltipText}>
          <Typography sx={apySx}>{displayApy}</Typography>
        </Tooltip>
      </TableCell>
      <TableCell sx={{ minWidth: "100px" }} align="center">
        <TextField
          id="outlined-number"
          label="Amount"
          size="small"
          value={text}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            inputMode: "decimal",
          }}
          onChange={handleChange}
        />
      </TableCell>
      <TableCell align="right">
        <Button
          disabled={loading || !account}
          variant="contained"
          onClick={() => handleStake(account!, amount, pool, setLoading)}
        >
          {loading ? "Processing..." : account ? "Stake" : "Connect wallet"}
        </Button>
        <Tooltip title="Stake from L1 directly to our liquidity pool - requires MetaMask">
          <Button sx={{ ml: 1 }} variant="contained" onClick={handleWidoClick}>
            Stake from L1
          </Button>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};
