import { Box, Link } from "@mui/material";

type IconProps = { to: string; src: string; alt: string; padding?: number };

const Icon = ({ to, src, alt, padding }: IconProps) => (
  <Link href={to}>
    <img
      src={src}
      alt={alt}
      style={{ width: "40px", padding: `${padding ? padding : 8}px` }}
    />
  </Link>
);

const style = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const socialList = [
  {
    to: "https://docs.carmine.finance/carmine-options-amm/",
    src: "file-alt.svg",
    alt: "documentation logo",
    padding: 10,
  },
  {
    to: "https://discord.gg/uRs7j8w3bX",
    src: "discord.svg",
    alt: "discord logo",
  },
  {
    to: "https://github.com/CarmineOptions",
    src: "github.svg",
    alt: "github logo",
  },
  {
    to: "https://twitter.com/CarmineOptions",
    src: "twitter.svg",
    alt: "twitter logo",
    padding: 7,
  },
];

export const Socials = () => (
  <Box sx={style}>
    {socialList.map(({ to, src, alt, padding }, i) => (
      <Icon to={to} src={src} alt={alt} padding={padding} key={i} />
    ))}
  </Box>
);
