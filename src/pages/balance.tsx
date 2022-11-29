import { Cached } from "@mui/icons-material";
import { Box, Button, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import PositionTable from "../components/PositionTable";

const Balance = () => {
  useEffect(() => {
    document.title = "Balance | Carmine Finance";
  });
  const [refresh, toggleRefresh] = useState<boolean>(false);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          p: 1,
          bgcolor: "background.paper",
          borderRadius: 1,
        }}
      >
        <Typography sx={{ flexGrow: 1 }} variant="h4">
          Options Balance
        </Typography>
        <Tooltip title="Refresh your positions">
          <Button onClick={() => toggleRefresh(!refresh)}>
            <Cached />
          </Button>
        </Tooltip>
      </Box>
      <PositionTable refresh={refresh} />
    </>
  );
};

export default Balance;
