import { OptionSide, OptionType } from "../types/options";
import { getToApprove, longInteger } from "./computations";

type ToApproveDataset = {
  size: number;
  premia: bigint;
  correct: bigint;
};

const longCallDataset: ToApproveDataset[] = [
  {
    size: 1,
    premia: 145645927995050205n,
    correct: 160210520794555225n,
  },
];

const shortCallDataset: ToApproveDataset[] = [
  {
    size: 1,
    premia: 145645927995050205n,
    correct: 868918664804454816n,
  },
];

const longPutDataset: ToApproveDataset[] = [
  {
    size: 1,
    premia: 145645927995050205n,
    correct: 160210520794555225n,
  },
];

const shortPutDataset: ToApproveDataset[] = [
  {
    size: 1,
    premia: 178503892n,
    correct: 1039346498n,
  },
];

describe("approve amount", () => {
  test("LONG CALL", () => {
    longCallDataset.forEach(({ size, premia, correct }) => {
      const res = getToApprove(
        OptionType.Call,
        OptionSide.Long,
        size,
        premia,
        1000 // strike price is only relevant for short put
      );
      expect(res === correct).toBe(true);
    });
  });
  test("SHORT CALL", () => {
    shortCallDataset.forEach(({ size, premia, correct }) => {
      const res = getToApprove(OptionType.Call, OptionSide.Short, size, premia);
      expect(res === correct).toBe(true);
    });
  });
  test("LONG PUT", () => {
    longPutDataset.forEach(({ size, premia, correct }) => {
      const res = getToApprove(OptionType.Put, OptionSide.Long, size, premia);
      expect(res === correct).toBe(true);
    });
  });
  test("SHORT PUT", () => {
    shortPutDataset.forEach(({ size, premia, correct }) => {
      const res = getToApprove(
        OptionType.Put,
        OptionSide.Short,
        size,
        premia,
        1200
      );
      expect(res === correct).toBe(true);
    });
  });
});

describe("long integer", () => {
  test("18 digits, n > 1", () => {
    const input = 100.00123;
    const expectedResult = 100001230000000000000n;
    const res = longInteger(input, 18);
    expect(res === expectedResult).toBe(true);
  });

  test("18 digits, n < 1", () => {
    const input = 0.00000123;
    const expectedResult = 1230000000000n;
    const res = longInteger(input, 18);
    expect(res === expectedResult).toBe(true);
  });

  test("18 digits, n == 1", () => {
    const input = 1;
    const expectedResult = 1000000000000000000n;
    const res = longInteger(input, 18);
    expect(res === expectedResult).toBe(true);
  });

  test("more digits than requested", () => {
    const input = 0.123456789;
    const expectedResult = 123n;
    const res = longInteger(input, 3);
    expect(res === expectedResult).toBe(true);
  });

  test("scientific notation", () => {
    const input = 1.0679258529442e-7;
    const expectedResult = 106792585294n;
    const res = longInteger(input, 18);
    expect(res === expectedResult).toBe(true);
  });
});

export {};
