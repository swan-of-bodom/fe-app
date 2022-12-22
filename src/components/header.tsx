import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import { Link as RouterLink } from "react-router-dom";
import GlobalStyles from "@mui/material/GlobalStyles";
import { WalletButton } from "./ConnectWallet/Button";
import { ReactNode } from "react";
import { Button } from "@mui/material";
import { NetworkSwitch } from "./networkSwitch";

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
  <RouterLink to={link} key={i}>
    <Button sx={{ color: "text.primary", my: 1, mx: 1.5 }} key={i}>
      {title}
    </Button>
  </RouterLink>
);

export const Header = () => (
  <>
    <GlobalStyles
      styles={{ ul: { margin: 0, padding: 0, listStyle: "none" } }}
    />
    <CssBaseline />
    <AppBar
      position="static"
      color="default"
      elevation={0}
      sx={{
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        padding: 1,
        flexFlow: "row",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
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
      <NetworkSwitch />
      {navLinks.map((navData, i) => navLink(navData, i))}
      <WalletButton />
    </AppBar>
  </>
);
