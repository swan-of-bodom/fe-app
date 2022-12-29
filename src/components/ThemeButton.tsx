import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { ThemeVariants, storeTheme } from "../style/themes";

type ThemeButtonProps = {
  mode: ThemeVariants;
  toggleMode: (v: ThemeVariants) => void;
};

export const ThemeButton = ({ mode, toggleMode }: ThemeButtonProps) => {
  const handleClick = () => {
    const nextMode =
      mode === ThemeVariants.dark ? ThemeVariants.light : ThemeVariants.dark;
    toggleMode(nextMode);
    storeTheme(nextMode);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 1,
        paddingLeft: 2,
        paddingRight: 2,
      }}
    >
      <IconButton sx={{ ml: 1 }} onClick={handleClick} color="inherit">
        {mode === ThemeVariants.dark ? (
          <Brightness7Icon />
        ) : (
          <Brightness4Icon />
        )}
      </IconButton>
    </Box>
  );
};
