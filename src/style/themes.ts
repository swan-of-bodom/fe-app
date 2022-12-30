import { ThemeOptions, createTheme } from "@mui/material";

export enum ThemeVariants {
  dark = "dark",
  light = "light",
}

const darkTheme: ThemeOptions = {
  palette: {
    mode: ThemeVariants.dark,
    primary: {
      main: "#ffb000",
    },
    background: {
      default: "#070718",
      paper: "#020210",
    },
  },
};

// TODO: colors
const lightTheme: ThemeOptions = {
  palette: {
    mode: ThemeVariants.light,
  },
};

export const getTheme = (c: ThemeVariants) =>
  c === ThemeVariants.dark ? createTheme(darkTheme) : createTheme(lightTheme);

const THEME_KEY = "theme-variant";

export const storeTheme = (newTheme: ThemeVariants): void => {
  localStorage.setItem(THEME_KEY, newTheme);
};

const retrieveTheme = (): string | null => localStorage.getItem(THEME_KEY);

export const getInitialTheme = (): ThemeVariants => {
  const fromLocalStorage = retrieveTheme();
  if (
    Object.values(ThemeVariants).includes(fromLocalStorage as ThemeVariants)
  ) {
    return fromLocalStorage as ThemeVariants;
  }
  return ThemeVariants.dark;
};
