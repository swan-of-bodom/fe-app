import { Header } from "./header";
import { Footer } from "./footer";
import { ReactNode } from "react";
import Container from "@mui/material/Container";
import { ThemeVariants } from "../style/themes";

type Props = {
  children: ReactNode;
  mode: ThemeVariants;
  toggleMode: (v: ThemeVariants) => void;
};

export const Layout = ({ children, mode, toggleMode }: Props) => (
  <>
    <Header mode={mode} toggleMode={toggleMode} />
    <Container sx={{ paddingTop: "20px" }}>
      <main>{children}</main>
    </Container>
    <Footer />
  </>
);
