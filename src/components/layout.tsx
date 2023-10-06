import { Header } from "./Header/Header";
import { ReactNode } from "react";
import Container from "@mui/material/Container";

type Props = {
  children: ReactNode;
};

export const Layout = ({ children }: Props) => (
  <>
    <Header />
    <Container sx={{ paddingTop: "20px", marginBottom: "150px" }}>
      <main>{children}</main>
    </Container>
  </>
);
