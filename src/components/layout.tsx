import { Header } from "./header";
import { Footer } from "./footer";
import { ReactNode } from "react";
import Container from "@mui/material/Container";

type Props = {
  children: ReactNode;
};

export const Layout = ({ children }: Props) => (
  <>
    <Header />
    <Container sx={{ paddingTop: "20px" }}>
      <main>{children}</main>
    </Container>
    <Footer />
  </>
);
