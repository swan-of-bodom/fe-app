import { useAccount } from "@starknet-react/core";
import { useState } from "react";
import { ETH_ADDRESS, USD_ADDRESS } from "../constants/amm";
import { Button, Link, List, ListItem } from "@mui/material";
import { VOYAGER_TX_URL } from "../constants/starknet";
import { approveAndTrade, tradeOpenContract } from "../hooks/tradeOpen";
import { OptionSide, OptionType } from "../types/options.d";
import { approve } from "../hooks/approve";
import { useAmmContract } from "../hooks/amm";
import { Contract } from "starknet";
import { hashToReadable } from "../utils/utils";

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
            {hashToReadable(t)}
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
  const { contract } = useAmmContract();

  const handleApprove = async () => {
    if (!account || !address) {
      console.warn("No account or address", { account, address });
      return;
    }

    toggleClicked(true);
    const res = await approve(account, address, amount);

    if (res && res.transaction_hash) {
      addToTransactionList([...transactionList, res.transaction_hash]);
    }

    toggleClicked(false);
  };

  const handleTradeOpen = async () => {
    if (!account || !address) {
      console.warn("No account or address", { account, address });
      return;
    }

    toggleClicked(true);
    const optionData = {
      optionType: OptionType.Call, // option_type : OptionType,
      strikePrice: "3458764513820540928000", // strike_price : Math64x61_,
      maturity: 1669849199, // maturity : Int,
      optionSide: OptionSide.Long, // option_side : OptionSide,
      optionSize: amount, // option_size : Math64x61_,
      quoteToken: USD_ADDRESS, // quote_token_address: Address,
      baseToken: ETH_ADDRESS, // base_token_address: Address,
    };

    // const res = await tradeOpen(account, optionData);

    const res = await tradeOpenContract(contract as Contract, optionData);

    if (res && res.transaction_hash) {
      addToTransactionList([...transactionList, res.transaction_hash]);
    }

    toggleClicked(false);
  };

  const handleApproveAndTrade = async () => {
    if (!account || !address) {
      console.warn("No account or address", { account, address });
      return;
    }

    toggleClicked(true);
    const optionData = {
      optionType: OptionType.Call, // option_type : OptionType,
      strikePrice: "3458764513820540928000", // strike_price : Math64x61_,
      maturity: 1669849199, // maturity : Int,
      optionSide: OptionSide.Long, // option_side : OptionSide,
      optionSize: amount, // option_size : Math64x61_,
      quoteToken: USD_ADDRESS, // quote_token_address: Address,
      baseToken: ETH_ADDRESS, // base_token_address: Address,
    };

    // const res = await tradeOpen(account, optionData);

    await approveAndTrade(account, address, optionData);

    toggleClicked(false);
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
      <Button
        variant="contained"
        disabled={isClicked}
        onClick={handleApproveAndTrade}
      >
        {isClicked ? "Processing..." : "Approve and trade"}
      </Button>
      <TransactionList transactions={transactionList} />
    </>
  );
};
