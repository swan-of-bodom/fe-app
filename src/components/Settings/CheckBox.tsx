import { Grid, Switch, Typography } from "@mui/material";
import { ThemeVariants } from "../../style/themes";
import { ChangeEvent } from "react";
import { RootState } from "../../redux/store";
import { updateSettings } from "../../redux/actions";
import { useSelector } from "react-redux";

export const CheckBox = () => {
  const { theme, autoconnect } = useSelector((s: RootState) => s.settings);

  const handleAutoconnect = (e: ChangeEvent, checked: boolean) => {
    updateSettings({ autoconnect: checked });
  };

  const handleTheme = (e: ChangeEvent, checked: boolean) => {
    const newTheme = checked ? ThemeVariants.dark : ThemeVariants.light;
    updateSettings({ theme: newTheme });
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
          checked={theme === ThemeVariants.dark}
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
