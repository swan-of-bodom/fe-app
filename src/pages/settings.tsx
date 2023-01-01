import { Typography } from "@mui/material";
import { useEffect } from "react";
import { CheckBox } from "../components/Settings/CheckBox";
import { ThemeVariants } from "../style/themes";

type Props = { toggleTheme: (t: ThemeVariants) => void };

const Settings = ({ toggleTheme }: Props) => {
  useEffect(() => {
    document.title = "Settings | Carmine Finance";
  });

  return (
    <>
      <Typography variant="h4">Settings</Typography>
      <Typography sx={{ maxWidth: "66ch" }}>
        The settings are stored in the localStorage - they are persistent per
        device and only if the usage of local storage is available.
      </Typography>
      <br />
      <CheckBox toggleTheme={toggleTheme} />
    </>
  );
};

export default Settings;
