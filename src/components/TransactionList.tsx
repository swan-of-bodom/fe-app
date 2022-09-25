import Typography from "@mui/material/Typography";
import {
  Transaction,
  useStarknetTransactionManager,
} from "@starknet-react/core";
import React from "react";
import { ListItem, List } from "@mui/material";

function TransactionItem({ transaction }: { transaction: Transaction }) {
  return (
    <span>
      <a
        href={`https://goerli.voyager.online/tx/${transaction.transactionHash}`}
      >
        {transaction.metadata.method}: {transaction.metadata.message} -{" "}
        {transaction.status}
      </a>
    </span>
  );
}

export function TransactionList() {
  const { transactions } = useStarknetTransactionManager();

  if (!transactions.length) {
    return <></>;
  }

  return (
    <>
      <Typography variant="h4">
        Counter Contract{transactions.length == 1 ? "" : "s"}
      </Typography>
      <List>
        {transactions.map((transaction, index) => (
          <ListItem key={index}>
            <TransactionItem transaction={transaction} />
          </ListItem>
        ))}
      </List>
    </>
  );
}
