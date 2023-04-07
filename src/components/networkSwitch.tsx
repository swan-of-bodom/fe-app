import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";
import { NetworkName } from "../types/network";
import { updateSettings } from "../redux/actions";
import { useState } from "react";
import { useInterval } from "../hooks/useInterval";

const RELEAST_DATE_MS = 1680872400000;

const remainingSeconds = () => {
  const s = Math.floor((RELEAST_DATE_MS - new Date().getTime()) / 1000);

  return s > 0 ? s : 0;
};

const doubleDigit = (n: number): string => `${n < 10 ? "0" + n : n}`;

const clock = (s: number) => {
  const hours = Math.floor(s / 3600);
  const minutes = Math.floor((s - hours * 3600) / 60);
  const seconds = s - hours * 3600 - minutes * 60;

  return `${doubleDigit(hours)}:${doubleDigit(minutes)}:${doubleDigit(
    seconds
  )}`;
};

export const NetworkSwitch = () => {
  const currentEnv = useSelector((s: RootState) => s.settings.network);
  const s = remainingSeconds();
  const [count, setCount] = useState(s);

  useInterval(() => setCount(count - 1), count > 0 ? 1000 : null);

  const handleChange = (e: SelectChangeEvent) => {
    const current = e.target.value as NetworkName;
    updateSettings({ network: current });
    // the most reliable way to make sure that all contracts and StarknetProvider
    // use correct network is to reload the app
    window.location.reload();
  };

  // do not show Testnet2 in prod
  const isDev =
    new URL(window.location.href).hostname !== "app.carmine.finance";

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth size="small">
        <InputLabel id="network-select-label">Network</InputLabel>
        <Select
          labelId="network-select-label"
          id="network-select"
          value={currentEnv}
          label="Network"
          onChange={handleChange}
        >
          {process.env.NODE_ENV === "development" && (
            <MenuItem value={NetworkName.Devnet}>Devnet</MenuItem>
          )}
          <MenuItem value={NetworkName.Testnet}>Testnet</MenuItem>
          {isDev && <MenuItem value={NetworkName.Testdev}>Testdev</MenuItem>}
          {isDev && <MenuItem value={NetworkName.Mainnet}>Mainnet</MenuItem>}
          {count <= 0 ? (
            <MenuItem value={NetworkName.Mainnet}>✨Mainnet✨</MenuItem>
          ) : (
            <MenuItem disabled={true} value={NetworkName.Mainnet}>
              {`Mainnet - ${clock(count)}`}
            </MenuItem>
          )}
        </Select>
      </FormControl>
    </Box>
  );
};
