import { math64x61toDecimal, decimalToMath64x61 } from "./units";

const math64x61toDecimalTestCases = [
  { test: "283902308823417640452", correct: 123.123 },
];
const decimalToMath64x61TestCases = [
  { test: 123.123, correct: "283902308823417640452" },
];

describe("unit conversion", () => {
  test("math64x61 -> decimal", () => {
    math64x61toDecimalTestCases.forEach(({ test, correct }) =>
      expect(math64x61toDecimal(test)).toBe(correct)
    );
  });

  test("decimal -> math64x61", () => {
    decimalToMath64x61TestCases.forEach(({ test, correct }) =>
      expect(decimalToMath64x61(test)).toBe(correct)
    );
  });
});
