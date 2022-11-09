import { Box } from "@mui/material";

type NoContentProps = {
  text: string;
};

export const NoContent = ({ text }: NoContentProps) => (
  <Box sx={{ textAlign: "center" }}>
    <p>{text}</p>
  </Box>
);
