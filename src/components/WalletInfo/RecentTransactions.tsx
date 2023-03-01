import { Box, Stack, Typography } from "@mui/material";
import { useRecentTxs } from "../../hooks/useRecentTxs";
import { Transaction } from "../../redux/reducers/transactions";

const Tx = ({ tx }: { tx: Transaction }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-evenly",
        alignItems: "center",
        flexFlow: "row",
        border: `solid 1px ${tx.done ? "lime" : "red"}`,
        m: 1,
      }}
    >
      <div>
        <Typography>{tx.hash.substring(0, 5) + "..."}</Typography>
      </div>
      <div>
        <Typography>{tx.done ? "Finished" : "Pending"}</Typography>
      </div>
    </Box>
  );
};

export const RecentTransaction = () => {
  const txs = useRecentTxs();

  if (txs.length === 0) {
    return <Box>Transactions will appear here</Box>;
  }

  return (
    <Box>
      <Stack>
        {txs.map((tx, i) => (
          <Tx tx={tx} key={i} />
        ))}
      </Stack>
    </Box>
  );
};
