import BN from "bn.js";
import { OptionSide, OptionType } from "../types/options";
import { getToApprove, longInteger } from "./computations";

type ToApproveDataset = {
  size: number;
  premia: BN;
  correct: BN;
};

const longCallDataset: ToApproveDataset[] = [
  {
    size: 1,
    premia: new BN("145645927995050205"),
    correct: new BN("174775113594060246"),
  },
  {
    size: 3,
    premia: new BN("145645927995050205"),
    correct: new BN("524325340782180738"),
  },
  {
    size: 0.0001,
    premia: new BN("145645927995050205"),
    correct: new BN("17477511359406"),
  },
];

const shortCallDataset: ToApproveDataset[] = [
  {
    size: 1,
    premia: new BN("145645927995050205"),
    correct: new BN("868918664804454816"),
  },
];

const longPutDataset: ToApproveDataset[] = [
  {
    size: 1,
    premia: new BN("145645927995050205"),
    correct: new BN("160210520794555225"),
  },
];

const shortPutDataset: ToApproveDataset[] = [
  {
    size: 1,
    premia: new BN("178503892"),
    correct: new BN("1136346498"),
  },
];

describe("approve amount", () => {
  test("LONG CALL", () => {
    longCallDataset.forEach(async ({ size, premia, correct }) => {
      const res = await getToApprove(
        OptionType.Call,
        OptionSide.Long,
        size,
        premia
      );
      expect(res.eq(correct)).toBe(true);
    });
  });
  test("SHORT CALL", () => {
    shortCallDataset.forEach(async ({ size, premia, correct }) => {
      const res = await getToApprove(
        OptionType.Call,
        OptionSide.Short,
        size,
        premia
      );
      expect(res.eq(correct)).toBe(true);
    });
  });
  test("LONG PUT", () => {
    longPutDataset.forEach(async ({ size, premia, correct }) => {
      const res = await getToApprove(
        OptionType.Put,
        OptionSide.Long,
        size,
        premia
      );
      expect(res.eq(correct)).toBe(true);
    });
  });
  test("SHORT PUT", () => {
    shortPutDataset.forEach(async ({ size, premia, correct }) => {
      const res = await getToApprove(
        OptionType.Put,
        OptionSide.Short,
        size,
        premia
      );
      expect(res.eq(correct)).toBe(true);
    });
  });
});

describe("long integer", () => {
  test("18 digits, n > 1", () => {
    const input = 100.00123;
    const expectedResult = new BN("100001230000000000000");
    const res = longInteger(input, 18);
    expect(res.eq(expectedResult)).toBe(true);
  });

  test("18 digits, n < 1", () => {
    const input = 0.00000123;
    const expectedResult = new BN("1230000000000");
    const res = longInteger(input, 18);
    expect(res.eq(expectedResult)).toBe(true);
  });

  test("18 digits, n == 1", () => {
    const input = 1;
    const expectedResult = new BN("1000000000000000000");
    const res = longInteger(input, 18);
    expect(res.eq(expectedResult)).toBe(true);
  });

  test("more digits than requested", () => {
    const input = 0.123456789;
    const expectedResult = new BN("123");
    const res = longInteger(input, 3);
    expect(res.eq(expectedResult)).toBe(true);
  });
});

export {};
