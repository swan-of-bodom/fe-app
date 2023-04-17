import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { NetworkName } from "../types/network";
import { updateSettings } from "../redux/actions";
import { useNetwork } from "../hooks/useNetwork";

export const NetworkSwitch = () => {
  const currentEnv = useNetwork();

  const handleChange = (e: SelectChangeEvent) => {
    const current = e.target.value as NetworkName;
    updateSettings({ network: current });
    // the most reliable way to make sure that all contracts and StarknetProvider
    // use correct network is to reload the app
    window.location.reload();
  };

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
          {isDev && <MenuItem value={NetworkName.Devnet}>Devnet</MenuItem>}
          {isDev && <MenuItem value={NetworkName.Testdev}>Testdev</MenuItem>}
          <MenuItem value={NetworkName.Testnet}>Testnet</MenuItem>
          <MenuItem value={NetworkName.Mainnet}>✨Mainnet✨</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};
