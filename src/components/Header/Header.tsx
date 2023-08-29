import AppBar from "@mui/material/AppBar";
import { NavLink } from "react-router-dom";
import GlobalStyles from "@mui/material/GlobalStyles";
import { WalletButton } from "../ConnectWallet/Button";
import { CSSProperties, ReactNode } from "react";
import { Box, useTheme } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { NetworkSwitch } from "../NetworkSwitch/NetworkSwitch";

const navLinkStyle = ({ isActive }: { isActive: boolean }) => {
  const style: CSSProperties = {
    color: isActive ? "rgba(255, 255, 255, 0.6)" : "white",
    margin: "1em 1.5em",
    textDecoration: "none",
  };
  return style;
};

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
    title: "Portfolio",
    link: "/portfolio",
  },
  {
    title: "Insurance",
    link: "/insurance",
  },
  {
    title: "Staking",
    link: "/staking",
  },
] as NavLinkProps[];

const navLink = ({ title, link }: NavLinkProps, i: number): ReactNode => (
  <NavLink to={link} style={navLinkStyle} key={i}>
    {title}
  </NavLink>
);

export const Header = () => {
  const theme = useTheme();

  return (
    <>
      <GlobalStyles
        styles={{ ul: { margin: 0, padding: 0, listStyle: "none" } }}
      />
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{
          padding: 1,
          justifyContent: "center",
          alignItems: "center",
          maxWidth: "1200px",
          paddingLeft: "24px",
          paddingRight: "24px",
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: "100px",
          marginBottom: "40px",
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
          <NavLink to="/" style={{ marginRight: "auto" }}>
            <img
              width="61px"
              height="111px"
              src="/logo.png"
              alt="Carmine logo"
            />
          </NavLink>
          <NetworkSwitch />
          {navLinks.map((navData, i) => navLink(navData, i))}
          <NavLink to="/settings">
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 1,
                px: 2,
                mr: 2,
              }}
            >
              <SettingsIcon sx={{ color: theme.palette.text.primary }} />
            </Box>
          </NavLink>
          <WalletButton />
        </Box>
      </AppBar>
    </>
  );
};
