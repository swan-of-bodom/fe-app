import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Link as RouterLink } from "react-router-dom";
import GlobalStyles from "@mui/material/GlobalStyles";
import { WalletButton } from "./walletButton";
import { ReactNode } from "react";
import { Button } from "@mui/material";

type NavLinkProps = {
  title: string;
  link: string;
};

const navLinks = [
  {
    title: "Sign",
    link: "/sign",
  },
  {
    title: "Buy",
    link: "/buy",
  },
  {
    title: "Balance",
    link: "/Balance",
  },
  {
    title: "Options",
    link: "/options",
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
      sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
    >
      <Toolbar sx={{ flexWrap: "wrap" }}>
        <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
          <RouterLink to="/" style={{ textDecoration: "none" }}>
            <img
              width="35px"
              height="35px"
              src="/android-chrome-192x192.png"
              alt="Carmine logo"
            />
          </RouterLink>
        </Typography>
        <nav>{navLinks.map((navData, i) => navLink(navData, i))}</nav>
        <WalletButton />
      </Toolbar>
    </AppBar>
  </>
);
