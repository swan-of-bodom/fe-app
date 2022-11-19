import { createTheme } from "@mui/material";
import { isDarkMode } from "../utils/utils";

export const baseTheme = createTheme({
  palette: {
    mode: isDarkMode() ? "dark" : "light",
  },
});
