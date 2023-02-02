import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { OptionWithPosition } from "../types/options";

export const useCloseOption = (): OptionWithPosition | undefined =>
  useSelector((s: RootState) => s.ui.activeCloseOption);
