import { SxProps } from "@mui/system";
import { Box } from "@mui/material";

type IconProps = {
  sx?: SxProps;
};

export const ArgentIcon = ({ sx }: IconProps) => (
  <Box component="img" sx={sx} alt="ArgentX wallet icon" src="argentx.svg" />
);

export const BraavosIcon = ({ sx }: IconProps) => (
  <Box component="img" sx={sx} alt="Braavos wallet icon" src="braavos.svg" />
);
