import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { ThemeProvider } from "@mui/material";
import { QueryClientProvider } from "react-query";
import { queryClient } from "./queries/client";
import { ReactNode, useMemo } from "react";
import { getTheme } from "./style/themes";

type Props = { children: ReactNode };

export const Controller = ({ children }: Props) => {
  const { settings } = useSelector((s: RootState) => s);
  const theme = useMemo(() => getTheme(settings.theme), [settings.theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </QueryClientProvider>
  );
};
