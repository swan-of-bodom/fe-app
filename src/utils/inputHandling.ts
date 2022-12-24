export const handleNumericChangeFactory = (
  setInputText: (v: string) => void,
  setAmount: (v: number) => void,
  cb?: (v: number) => number
) => {
  return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const valueIn = e.target.value;
    const validatedInput = valueIn.replace(/[^0-9]/g, ".");
    const parsed = parseFloat(validatedInput);
    if (valueIn === "" || isNaN(parsed)) {
      setInputText("");
      setAmount(0);
      return;
    }
    if (cb) {
      const res = cb(parsed);
      setInputText("" + res);
      setAmount(res);
      return;
    }
    setInputText(validatedInput);
    setAmount(parsed);
  };
};
