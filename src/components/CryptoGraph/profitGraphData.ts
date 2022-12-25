import { OptionSide, OptionType } from "../../types/options";
import { debug } from "../../utils/debugger";

export type GraphData = {
  plot: Array<{ usd: number; market: number }>;
  domain: number[];
};

// strike 1300
// premia 50
// size 1

const longCall = (
  strikePrice: number,
  premia: number,
  size: number
): GraphData => {
  const step = 0.25;
  const granuality = strikePrice / step;
  const spread = [0, 2 * granuality];
  const plot = [];

  for (let i = spread[0]; i <= spread[1]; i++) {
    const x = i * step;
    const y = x < strikePrice ? -premia : (x - strikePrice) * size - premia;
    plot.push({ market: x, usd: y });
  }

  const [first, last] = [plot[0].usd, plot[plot.length - 1].usd];
  const domain = [first - 0.2 * last, last];

  return { plot, domain };
};

const longPut = (
  strikePrice: number,
  premia: number,
  size: number
): GraphData => {
  const step = 0.25;
  const granuality = strikePrice / step;
  const spread = [0, 2 * granuality];
  const plot = [];

  for (let i = spread[0]; i <= spread[1]; i++) {
    const x = i * step;
    const y = x < strikePrice ? (strikePrice - x) * size - premia : -premia;
    plot.push({ market: x, usd: y });
  }

  const [first, last] = [plot[0].usd, plot[plot.length - 1].usd];
  const domain = [last - 0.3 * first, first];

  return { plot, domain };
};

const shortCall = (
  strikePrice: number,
  premia: number,
  size: number
): GraphData => {
  const step = 0.25;
  const granuality = strikePrice / step;
  const spread = [0, 2 * granuality];
  const plot = [];

  for (let i = spread[0]; i <= spread[1]; i++) {
    const x = i * step;
    const y = x < strikePrice ? premia : (strikePrice - x) * size + premia;
    plot.push({ market: x, usd: y });
  }

  const [first, last] = [plot[0].usd, plot[plot.length - 1].usd];
  const domain = [last, first - 0.3 * last];

  return { plot, domain };
};

const shortPut = (
  strikePrice: number,
  premia: number,
  size: number
): GraphData => {
  const step = 0.25;
  const granuality = strikePrice / step;
  const spread = [0, 2 * granuality];
  const plot = [];

  for (let i = spread[0]; i <= spread[1]; i++) {
    const x = i * step;
    const y = x < strikePrice ? (x - strikePrice) * size + premia : premia;
    plot.push({ market: x, usd: y });
  }

  const [first, last] = [plot[0].usd, plot[plot.length - 1].usd];
  const domain = [first, last - 0.3 * first];

  return { plot, domain };
};

export const getProfitGraphData = (
  type: OptionType,
  side: OptionSide,
  strikePrice: number,
  premia: number,
  size: number
): GraphData => {
  switch (type + side) {
    case OptionType.Call + OptionSide.Long:
      return longCall(strikePrice, premia, size);
    case OptionType.Put + OptionSide.Long:
      return longPut(strikePrice, premia, size);
    case OptionType.Call + OptionSide.Short:
      return shortCall(strikePrice, premia, size);
    case OptionType.Put + OptionSide.Short:
      return shortPut(strikePrice, premia, size);
    default:
      throw Error(`Invalid type or side ${type}, ${side}`);
  }
};
