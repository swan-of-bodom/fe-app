import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { NetworkName } from "../../types/network";
import { useNetwork } from "../../hooks/useNetwork";
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
      window.location.href = "https://app.carmine.finance";
    }
    if (target === NetworkName.Testnet) {
      // TODO: uncomment when ready
      window.location.href = "https://testnet.app.carmine.finance";
    }
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
