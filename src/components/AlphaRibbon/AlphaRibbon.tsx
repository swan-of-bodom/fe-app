import { Close } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useState } from "react";

export const AlphaRibbon = () => {
  const theme = useTheme();
  const [show, setShow] = useState<"" | "hidden">("");

  const handleClose = () => setShow("hidden");

  const style = {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    maxWidth: "min(350px, 85vw)",
    borderRadius: "8px",
    p: 2,
    pt: 1,
    background: theme.palette.primary.main,
    visibility: show,
  };
  return (
    <Box sx={style}>
      <Box
        sx={{
          display: "flex",
          gap: 3,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h5">StarkNet Alpha</Typography>
        <IconButton onClick={handleClose}>
          <Close />
        </IconButton>
      </Box>
      <Typography>
        Carmine Protocol is built on top of StarkNet, which is currently in
        Alpha. As such, delays may occur, and catastrophic bugs may lurk. Thank
        you for trying our app at this early stage.
      </Typography>
    </Box>
  );
};
