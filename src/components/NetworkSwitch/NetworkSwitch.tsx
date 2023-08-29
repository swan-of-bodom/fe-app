import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { NetworkName } from "../../types/network";
import { updateSettings } from "../../redux/actions";
import { useNetwork } from "../../hooks/useNetwork";
import { isDev } from "../../utils/utils";
import styles from "./networkswitch.module.css";

const Ellipse = () => (
  <img
    // TODO: -30px is a hack to cancel MUI styling
    style={{ width: "10px", marginLeft: "10px", marginRight: "-30px" }}
    src="./ellipse.svg"
    alt="green elipse"
  />
);

export const NetworkSwitch = () => {
  const currentEnv = useNetwork();

  const handleChange = (e: SelectChangeEvent) => {
    const target = e.target.value as NetworkName;

    if (target === NetworkName.Mainnet) {
      // TODO: change to mainnet.app.carmine.finance when ready
      window.location.href = "app.carmine.finance";
    }
    if (target === NetworkName.Testnet) {
      // TODO: uncomment when ready
      // window.location.href = "testnet.app.carmine.finance";
    }

    updateSettings({ network: target });
    // the most reliable way to make sure that all contracts and StarknetProvider
    // use correct network is to reload the app
    window.location.reload();
  };

  return (
    <FormControl>
      <Select
        id="network-select"
        value={currentEnv}
        displayEmpty
        inputProps={{
          "aria-label": "Without label",
          IconComponent: () => null,
        }}
        onChange={handleChange}
        className={styles.button}
      >
        {isDev && <MenuItem value={NetworkName.Devnet}>Devnet</MenuItem>}
        {isDev && <MenuItem value={NetworkName.Testdev}>Testdev</MenuItem>}
        <MenuItem value={NetworkName.Testnet}>
          Testnet <Ellipse />
        </MenuItem>
        <MenuItem value={NetworkName.Mainnet}>
          Mainnet <Ellipse />
        </MenuItem>
      </Select>
    </FormControl>
  );
};
