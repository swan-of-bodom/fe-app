import { useSelector } from "react-redux";
import { Transaction } from "../redux/reducers/transactions";
import { RootState } from "../redux/store";

export const useRecentTxs = (): Transaction[] =>
  useSelector((s: RootState) => s.txs);
