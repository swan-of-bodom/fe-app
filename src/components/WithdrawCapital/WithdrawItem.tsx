import {
  ButtonGroup,
  TableCell,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { AccountInterface } from "starknet";
import { withdrawCall } from "./withdrawCall";
import { handleNumericChangeFactory } from "../../utils/inputHandling";
import { debug } from "../../utils/debugger";
import { isCall } from "../../utils/utils";
import { POOL_NAMES } from "../../constants/texts";
import { showToast } from "../../redux/actions";
import { ToastType } from "../../redux/reducers/ui";
import { useTxPending } from "../../hooks/useRecentTxs";
import { TransactionAction } from "../../redux/reducers/transactions";
import buttonStyles from "../../style/button.module.css";
import { UserPoolInfo } from "../../classes/Pool";

type Props = {
  userPoolInfo: UserPoolInfo;
  account: AccountInterface;
};

export const WithdrawItem = ({ account, userPoolInfo }: Props) => {
  const { type, sizeHex, value } = userPoolInfo;
  // TODO: use proper pool id
  const txPending = useTxPending(String(type), TransactionAction.Withdraw);
  const [amount, setAmount] = useState<number>(0);
  const [text, setText] = useState<string>("0");
  const [processing, setProcessing] = useState<boolean>(false);

  const cb = (n: number): number => (n >= 100 ? 100 : n);
  const handleChange = handleNumericChangeFactory(setText, setAmount, cb);

  const precission = 10000n;
  const relativeSize =
    (BigInt(amount) * precission * BigInt(sizeHex)) / (100n * precission);
  debug("Relative size", relativeSize);
  const handleWithdraw = () => {
    if (!amount) {
      showToast("Cannot withdraw 0", ToastType.Warn);
      return;
    }
    withdrawCall(account, setProcessing, type, relativeSize.toString(10));
  };
  const handleWithdrawAll = () =>
    withdrawCall(account, setProcessing, type, sizeHex);

  const [pool, currency] = isCall(type)
    ? [POOL_NAMES.CALL, "Ξ"]
    : [POOL_NAMES.PUT, "$"];

  const displayDigits = 5;
  const displayValue = currency + " " + value.toFixed(displayDigits);

  return (
    <TableRow>
      <TableCell>{pool}</TableCell>
      <TableCell>
        <Tooltip title={String(value) === displayValue ? "" : value}>
          <Typography>{displayValue}</Typography>
        </Tooltip>
      </TableCell>
      <TableCell sx={{ minWidth: "100px" }}>
        <TextField
          id="outlined-number"
          label="Percentage %"
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
        <ButtonGroup
          disableElevation
          variant="contained"
          aria-label="Disabled elevation buttons"
          disabled={processing || txPending}
        >
          {processing || txPending ? (
            <button
              className={`${buttonStyles.button} ${buttonStyles.secondary}`}
            >
              Processing...
            </button>
          ) : (
            <>
              <button
                style={{ borderRight: 0 }}
                className={`${buttonStyles.button} ${buttonStyles.secondary}`}
                onClick={handleWithdraw}
              >
                Unstake
              </button>
              <button
                className={`${buttonStyles.button} ${buttonStyles.secondary}`}
                onClick={handleWithdrawAll}
              >
                Max
              </button>
            </>
          )}
        </ButtonGroup>
      </TableCell>
    </TableRow>
  );
};
