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
import { OptionType } from "../../types/options";
import { handleStake } from "./handleStake";
import { handleNumericChangeFactory } from "../../utils/inputHandling";
import { isCall } from "../../utils/utils";
import { POOL_NAMES } from "../../constants/texts";
import { openCallWidoDialog, openPutWidoDialog } from "../../redux/actions";

type Props = {
  account: AccountInterface | undefined;
  type: OptionType;
};

const getApy = async (setApy: (n: number) => void, type: OptionType) => {
  const pool = isCall(type) ? "eth-usdc-call" : "eth-usdc-put";
  fetch(`https://api.carmine.finance/api/v1/mainnet/${pool}/apy`)
    .then((response) => response.json())
    .then((result) => {
      if (result && result.status === "success") {
        setApy(result.data);
      }
    });
};

export const StakeCapitalItem = ({ account, type }: Props) => {
  const [amount, setAmount] = useState<number>(0);
  const [text, setText] = useState<string>("0");
  const [loading, setLoading] = useState<boolean>(false);
  const [apy, setApy] = useState<number | undefined>();
  const theme = useTheme();

  useEffect(() => {
    getApy(setApy, type);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = handleNumericChangeFactory(setText, setAmount);

  const poolName = isCall(type) ? POOL_NAMES.CALL : POOL_NAMES.PUT;
  const apyTooltipText =
    "APY (Annual Percentage Yield) is calculated based on the last week and represents the annualized yield of the pool. Keep in mind that it does NOT account for risk and that past returns do not imply future returns.";
  // const displayApy =
  //   apy === undefined ? "--" : `${apy < 0 ? "" : "+"}${apy.toFixed(2)}%`;
  const displayApy = "--";
  const apySx: CSSProperties = { fontWeight: "bold", textAlign: "center" };
  // if (apy && apy < 0) {
  //   apySx.color = theme.palette.error.main;
  // } else if (apy && apy > 0) {
  //   apySx.color = theme.palette.success.main;
  // }

  const handleWidoClick = () => {
    isCall(type) ? openCallWidoDialog() : openPutWidoDialog();
  };

  return (
    <TableRow>
      <TableCell>
        <Typography>{poolName}</Typography>
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
          onClick={() => handleStake(account!, amount, type, setLoading)}
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
