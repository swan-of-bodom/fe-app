import { ThemeProvider } from "@mui/material";
import { QueryClientProvider } from "react-query";
import { queryClient } from "./queries/client";
import { ReactNode, useEffect } from "react";
import { theme } from "./style/themes";
import { connectToLatest } from "./network/account";

type Props = { children: ReactNode };

export const Controller = ({ children }: Props) => {
  useEffect(() => {
    connectToLatest();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </QueryClientProvider>
  );
};
