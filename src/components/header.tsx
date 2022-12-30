import AppBar from "@mui/material/AppBar";
import { Link as RouterLink } from "react-router-dom";
import GlobalStyles from "@mui/material/GlobalStyles";
import { WalletButton } from "./ConnectWallet/Button";
import { ReactNode } from "react";
import { Box, Button } from "@mui/material";
import { NetworkSwitch } from "./networkSwitch";
import { ThemeVariants } from "../style/themes";
import { ThemeButton } from "./ThemeButton";

type NavLinkProps = {
  title: string;
  link: string;
};

const navLinks = [
  {
    title: "Trade",
    link: "/trade",
  },
  {
    title: "My Position",
    link: "/position",
  },
  {
    title: "Staking",
    link: "/staking",
  },
] as NavLinkProps[];

const navLink = ({ title, link }: NavLinkProps, i: number): ReactNode => (
  <RouterLink style={{ textDecoration: "none" }} to={link} key={i}>
    <Button sx={{ color: "text.primary", my: 1, mx: 1.5 }} key={i}>
      {title}
    </Button>
  </RouterLink>
);

type HeaderProps = {
  mode: ThemeVariants;
  toggleMode: (v: ThemeVariants) => void;
};

export const Header = ({ mode, toggleMode }: HeaderProps) => (
  <>
    <GlobalStyles
      styles={{ ul: { margin: 0, padding: 0, listStyle: "none" } }}
    />
    <AppBar
      position="static"
      color="default"
      elevation={0}
      sx={{
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        padding: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexFlow: "row",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          maxWidth: "1250px",
          width: "100%",
        }}
      >
        <RouterLink to="/" style={{ marginRight: "auto" }}>
          <img
            width="47.5px"
            height="47.5px"
            src="/logo.svg"
            alt="Carmine logo"
          />
        </RouterLink>
        <ThemeButton mode={mode} toggleMode={toggleMode} />
        <NetworkSwitch />
        {navLinks.map((navData, i) => navLink(navData, i))}
        <WalletButton />
      </Box>
    </AppBar>
  </>
);
