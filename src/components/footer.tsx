import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Container from "@mui/material/Container";

type FooterProps = {
  title: string;
  description: Array<{ title: string; href: string }>;
};

const Copyright = () => (
  <Typography
    variant="body2"
    color="text.secondary"
    align="center"
    sx={{ mt: 5 }}
  >
    {"Copyright © "}
    <Link color="inherit" href="https://carmine.finance">
      Carmine Finance
    </Link>{" "}
    {new Date().getFullYear()}
    {"."}
  </Typography>
);

const footers = [
  {
    title: "Company",
    description: [
      { title: "About", href: "https://carmine.finance" },
      { title: "Team", href: "https://carmine.finance/#team" },
      { title: "Contact Us", href: "https://discord.com/invite/uRs7j8w3bX" },
      { title: "Twitter", href: "https://twitter.com/carmineoptions" },
    ],
  },
  {
    title: "Features",
    description: [
      { title: "FAQ", href: "https://carmine.finance/#faq" },
      { title: "Random feature", href: "#" },
      { title: "Team feature", href: "#" },
      { title: "Developer stuff", href: "#" },
      { title: "Another one", href: "#" },
    ],
  },
  {
    title: "Resources",
    description: [
      {
        title: "Documentation",
        href: "https://carmine-finance.gitbook.io/carmine-options-amm/",
      },
      { title: "GitHub", href: "https://github.com/CarmineOptions" },
      { title: "Another resource", href: "#" },
      { title: "Final resource", href: "#" },
    ],
  },
  {
    title: "Legal",
    description: [
      { title: "Privacy policy", href: "#" },
      { title: "Terms of use", href: "#" },
    ],
  },
] as FooterProps[];

export const Footer = () => (
  <>
    <Container
      maxWidth="md"
      component="footer"
      sx={{
        borderTop: (theme) => `1px solid ${theme.palette.divider}`,
        mt: 8,
        py: [3, 6],
      }}
    >
      {/* <Grid container spacing={4} justifyContent="space-evenly">
        {footers.map((footer) => (
          <Grid item xs={6} sm={3} key={footer.title}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              {footer.title}
            </Typography>
            <ul>
              {footer.description.map(({ title, href }, i) => (
                <li key={i}>
                  <Link href={href} variant="subtitle1" color="text.secondary">
                    {title}
                  </Link>
                </li>
              ))}
            </ul>
          </Grid>
        ))}
      </Grid> */}
      <Copyright />
    </Container>
  </>
);
