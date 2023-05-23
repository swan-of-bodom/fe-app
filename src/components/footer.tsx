import { Socials } from "./Socials";
import {
  Box,
  Grid,
  useTheme,
  Typography,
  Link,
  Container,
} from "@mui/material";

const Copyright = () => (
  <Typography variant="body2" color="text.secondary" align="center">
    {"Copyright © "}
    <Link color="inherit" href="https://carmine.finance">
      Carmine Finance
    </Link>{" "}
    {new Date().getFullYear()}
    {"."}
  </Typography>
);

export const Footer = () => {
  const theme = useTheme();
  return (
    <>
      <Container
        maxWidth="md"
        component="footer"
        sx={{
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          mt: 13,
          py: [3, 6],
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <Link
                sx={{ color: theme.palette.text.primary }}
                href="https://carmine.finance/audit/hack-a-chain"
                target="_blank"
              >
                Audit by Hack a chain
              </Link>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Socials />
          </Grid>
          <Grid item xs={12}>
            <Copyright />
          </Grid>
        </Grid>
      </Container>
    </>
  );
};
