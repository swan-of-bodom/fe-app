import Header from "../Header";
import Footer from "../Footer";
import { ReactNode } from "react";
import Container from "@mui/material/Container";

type Props = {
  children: ReactNode;
};

const Layout = ({ children }: Props) => (
  <>
    <Header />
    <Container sx={{ paddingTop: "20px" }}>
      <main>{children}</main>
    </Container>
    <Footer />
  </>
);

export default Layout;
