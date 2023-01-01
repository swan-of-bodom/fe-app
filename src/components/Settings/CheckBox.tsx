import { Grid, Switch, Typography } from "@mui/material";
import { ThemeVariants } from "../../style/themes";
import { ChangeEvent, useState } from "react";
import { retrieveSettings, storeSetting } from "../../utils/environment";

type Props = {
  toggleTheme: (t: ThemeVariants) => void;
};

export const CheckBox = ({ toggleTheme }: Props) => {
  const { autoconnect: defaultAutoconnect, theme: defaultTheme } =
    retrieveSettings();
  const [autoconnect, setAutoconnect] = useState<boolean>(defaultAutoconnect);
  const [theme, setTheme] = useState<boolean>(
    defaultTheme === ThemeVariants.dark
  );

  const handleAutoconnect = (e: ChangeEvent, checked: boolean) => {
    setAutoconnect(checked);
    storeSetting({
      theme: theme ? ThemeVariants.dark : ThemeVariants.light,
      autoconnect: checked,
    });
  };

  const handleTheme = (e: ChangeEvent, checked: boolean) => {
    setTheme(checked);
    toggleTheme(checked ? ThemeVariants.dark : ThemeVariants.light);
    storeSetting({
      theme: checked ? ThemeVariants.dark : ThemeVariants.light,
      autoconnect,
    });
  };

  const style = {
    maxWidth: "66ch",
    alignItems: "center",
  };

  return (
    <Grid container sx={style}>
      <Grid item xs={12} md={6}>
        <Typography fontWeight="bold">Theme</Typography>
      </Grid>
      <Grid item xs={4} md={2}>
        light
      </Grid>
      <Grid item xs={4} md={2}>
        <Switch
          inputProps={{ "aria-label": "controlled" }}
          checked={theme}
          onChange={handleTheme}
          color="primary"
        />
      </Grid>
      <Grid item xs={4} md={2}>
        dark
      </Grid>
      <Grid item xs={12} md={6}>
        <Typography fontWeight="bold">Autoconnect</Typography>
      </Grid>
      <Grid item xs={4} md={2}>
        disabled
      </Grid>
      <Grid item xs={4} md={2}>
        <Switch
          inputProps={{ "aria-label": "controlled" }}
          checked={autoconnect}
          onChange={handleAutoconnect}
          color="primary"
        />
      </Grid>
      <Grid item xs={4} md={2}>
        allowed
      </Grid>
    </Grid>
  );
};
