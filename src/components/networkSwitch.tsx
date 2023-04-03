import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";
import { NetworkName } from "../types/network";
import { updateSettings } from "../redux/actions";

export const NetworkSwitch = () => {
  const currentEnv = useSelector((s: RootState) => s.settings.network);

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
          {process.env.NODE_ENV === "development" ? (
            <MenuItem value={NetworkName.Devnet}>Devnet</MenuItem>
          ) : null}
          <MenuItem value={NetworkName.Testnet}>Testnet</MenuItem>
          {isDev ? (
            <MenuItem value={NetworkName.Testdev}>Testdev</MenuItem>
          ) : null}
          {isDev ? (
            <MenuItem value={NetworkName.Mainnet}>Mainnet</MenuItem>
          ) : (
            <MenuItem disabled={true} value={NetworkName.Mainnet}>
              Mainnet - comming soon!
            </MenuItem>
          )}
        </Select>
      </FormControl>
    </Box>
  );
};
