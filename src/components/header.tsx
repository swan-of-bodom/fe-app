import AppBar from "@mui/material/AppBar";
import { Link as RouterLink } from "react-router-dom";
import GlobalStyles from "@mui/material/GlobalStyles";
import { WalletButton } from "./ConnectWallet/Button";
import { ReactNode } from "react";
import { Box, Button, useTheme } from "@mui/material";
import { NetworkSwitch } from "./networkSwitch";
import SettingsIcon from "@mui/icons-material/Settings";
import { useAccount } from "../hooks/useAccount";
import { AccountInterface } from "starknet";
import { standardiseAddress } from "../utils/utils";

const insuranceWhiteList = [
  // core team addresses
  "0x583a9d956d65628f806386ab5b12dccd74236a3c6b930ded9cf3c54efc722a1",
  "0x6717eaf502baac2b6b2c6ee3ac39b34a52e726a73905ed586e757158270a0af",
  "0x11d341c6e841426448ff39aa443a6dbb428914e05ba2259463c18308b86233",
  "0x3d1525605db970fa1724693404f5f64cba8af82ec4aab514e6ebd3dec4838ad",
  "0x3c032b19003Bdd6f4155a30FFFA0bDA3a9cAe45Feb994A721299d7E5096568c",
].map((a) => standardiseAddress(a));

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
    title: "Insurance",
    link: "/insurance",
  },
  {
    title: "My Position",
    link: "/position",
  },
  {
    title: "Staking",
    link: "/staking",
  },
  {
    title: "History",
    link: "/history",
  },
  {
    title: "Dashboard",
    link: "/dashboard",
  },
] as NavLinkProps[];

const navLink = (
  { title, link }: NavLinkProps,
  i: number,
  account: AccountInterface | undefined
): ReactNode => {
  // show "Insurance" only to whitelisted users
  if (title === "Insurance") {
    if (
      !account ||
      !insuranceWhiteList.includes(standardiseAddress(account.address))
    ) {
      return null;
    }
  }
  return (
    <RouterLink style={{ textDecoration: "none" }} to={link} key={i}>
      <Button sx={{ color: "text.primary", my: 1, mx: 1.5 }} key={i}>
        {title}
      </Button>
    </RouterLink>
  );
};

export const Header = () => {
  const account = useAccount();
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
          <NetworkSwitch />
          {navLinks.map((navData, i) => navLink(navData, i, account))}
          <RouterLink to="/settings">
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
          </RouterLink>
          <WalletButton />
        </Box>
      </AppBar>
    </>
  );
};
