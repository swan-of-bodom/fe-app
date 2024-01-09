import { NavLink } from "react-router-dom";
import { WalletButton } from "../ConnectWallet/Button";
import { ReactNode } from "react";
import { NetworkSwitch } from "../NetworkSwitch/NetworkSwitch";
import styles from "./header.module.css";
import { LinksMenu } from "../LinksMenu/LinksMenu";

type NavLinkProps = {
  title: string;
  link: string;
};

const navLinks = [
  {
    title: "Trade",
    link: "/",
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
  <NavLink
    className={(p) =>
      p.isActive ? `${styles.navlink} ${styles.active}` : styles.navlink
    }
    to={link}
    key={i}
  >
    {title}
  </NavLink>
);

export const Header = () => (
  <header className={styles.header}>
    <div className={styles.navlinkcontainer}>
      <NavLink to="/" style={{ marginRight: "auto", display: "flex" }}>
        <img height="52px" src="/logo.png" alt="Carmine logo" />
      </NavLink>
      <NetworkSwitch />
      {navLinks.map((navData, i) => navLink(navData, i))}
      <LinksMenu />
      <WalletButton />
    </div>
  </header>
);
