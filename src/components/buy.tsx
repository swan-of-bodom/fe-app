import { useAccount } from "@starknet-react/core";
import { useState } from "react";
import {
  AMM_METHODS,
  ETH_ADDRESS,
  MAIN_CONTRACT_ADDRESS,
  USD_ADDRESS,
} from "../constants/amm";
import { Button, Link, List, ListItem } from "@mui/material";
import { VOYAGER_TX_URL } from "../constants/starknet";
import AmmAbi from "../abi/amm_abi.json";
import { Abi } from "starknet/types";

type BuyProps = {
  amount: string;
};

type TransactionListProps = {
  transactions: string[];
};

const TransactionList = ({ transactions }: TransactionListProps) => {
  if (transactions.length === 0) {
    return null;
  }
  return (
    <List>
      {transactions.map((t, i) => (
        <ListItem key={i}>
          <Link target="_blank" href={VOYAGER_TX_URL + t}>
            {t}
          </Link>
        </ListItem>
      ))}
    </List>
  );
};

export const Buy = ({ amount }: BuyProps) => {
  const [transactionList, addToTransactionList] = useState<string[]>([]);
  const [isClicked, toggleClicked] = useState<boolean>(false);
  const { account, address } = useAccount();

  const handleApprove = async () => {
    if (!account || !address) {
      console.warn("No account or address", { account, address });
      return;
    }
    toggleClicked(true);
    try {
      const res = await account.execute([
        {
          contractAddress: ETH_ADDRESS,
          entrypoint: AMM_METHODS.APPROVE,
          calldata: [address, amount, 0],
        },
      ]);

      if (res && res.transaction_hash) {
        addToTransactionList([...transactionList, res.transaction_hash]);
      }
      toggleClicked(false);
    } catch (e) {
      console.error(e);
      toggleClicked(false);
    }
  };

  const handleTradeOpen = async () => {
    if (!account || !address) {
      console.warn("No account or address", { account, address });
      return;
    }

    toggleClicked(true);
    try {
      const res = await account.execute(
        [
          {
            contractAddress: MAIN_CONTRACT_ADDRESS,
            entrypoint: AMM_METHODS.TRADE_OPEN,
            calldata: [
              "0", // option_type : OptionType,
              "3919933115663279718400", // strike_price : Math64x61_,
              "1665511435", // maturity : Int,
              "0", // option_side : OptionSide,
              "11529215046", // option_size : Math64x61_,
              USD_ADDRESS, // quote_token_address: Address,
              ETH_ADDRESS, // base_token_address: Address,
            ],
          },
        ],
        [AmmAbi] as Abi[]
      );

      if (res && res.transaction_hash) {
        addToTransactionList([...transactionList, res.transaction_hash]);
      }

      toggleClicked(false);
    } catch (e) {
      console.error(e);
      toggleClicked(false);
    }
  };

  return (
    <>
      <Button variant="contained" disabled={isClicked} onClick={handleApprove}>
        {isClicked ? "Processing..." : "Approve"}
      </Button>
      <Button
        variant="contained"
        disabled={isClicked}
        onClick={handleTradeOpen}
      >
        {isClicked ? "Processing..." : "Trade Open"}
      </Button>
      <TransactionList transactions={transactionList} />
    </>
  );
};
