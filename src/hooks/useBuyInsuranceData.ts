import { BuyInsuranceModalData } from "./../components/Insurance/BuyInsuranceModal";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

export const useBuyInsuranceData = (): BuyInsuranceModalData | undefined =>
  useSelector((s: RootState) => s.ui.buyInsuranceModalData);
