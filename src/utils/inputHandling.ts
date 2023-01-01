import { debug } from "../utils/debugger";

export const handleNumericChangeFactory = (
  setInputText: (v: string) => void,
  setAmount: (v: number) => void,
  cb?: (v: number) => number
) => {
  return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const valueIn = e.target.value.replace(",", ".");

    if (!/^\d*\.{0,1}\d*$/.test(valueIn)) {
      return;
    }

    const parsed = parseFloat(valueIn);
    debug("Input handling", { valueIn, parsed });

    if (valueIn === ".") {
      setInputText("0.");
      setAmount(0);
      return;
    }
    if (valueIn === "" || isNaN(parsed)) {
      setInputText("");
      setAmount(0);
      return;
    }

    if (cb) {
      const res = cb(parsed);
      setInputText(res === parsed ? valueIn : res.toString());
      setAmount(res);
      return;
    }
    setInputText(valueIn);
    setAmount(parsed);
  };
};
