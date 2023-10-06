import styles from "./linksmenu.module.css";
import { NavLink } from "react-router-dom";
import { ReactComponent as Developers } from "./developers.svg";
import { ReactComponent as Discord } from "./discord.svg";
import { ReactComponent as Home } from "./home.svg";
import { ReactComponent as Docs } from "./documentation.svg";
import { ReactComponent as About } from "./about.svg";
import { ReactComponent as Settings } from "./settings.svg";
import { ReactComponent as Github } from "./github.svg";
import { ReactComponent as Twitter } from "./twitter.svg";

type Props = {
  handleClose: () => void;
};

export const MenuContent = ({ handleClose }: Props) => {
  return (
    <div className={styles.container}>
      <div style={{ borderBottom: "1px solid white" }}>
        <NavLink
          style={{ textDecoration: "none" }}
          to="/"
          onClick={handleClose}
        >
          <Home /> Home
        </NavLink>
      </div>
      <div className={styles.stack}>
        <a href="https://carmine.finance/" target="_blank" rel="noreferrer">
          <Developers /> Developers
        </a>
        <a
          href="https://docs.carmine.finance/carmine-options-amm/"
          target="_blank"
          rel="noreferrer"
        >
          <Docs /> Documentation
        </a>
        <a href="https://carmine.finance/" target="_blank" rel="noreferrer">
          <About /> About
        </a>
        <NavLink to="/settings" onClick={handleClose}>
          <Settings /> Settings
        </NavLink>
        <a
          href="https://github.com/CarmineOptions"
          target="_blank"
          rel="noreferrer"
        >
          <Github /> Github
        </a>
        <a
          href="https://discord.gg/uRs7j8w3bX"
          target="_blank"
          rel="noreferrer"
        >
          <Discord /> Discord
        </a>
        <a
          href="https://twitter.com/CarmineOptions"
          target="_blank"
          rel="noreferrer"
        >
          <Twitter /> Twitter
        </a>
      </div>
    </div>
  );
};
