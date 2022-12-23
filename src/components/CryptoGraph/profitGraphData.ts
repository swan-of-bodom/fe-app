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
  const spread = [0.6 * granuality, 1.4 * granuality];
  const plot = [];

  for (let i = spread[0]; i <= spread[1]; i++) {
    const x = i * step;
    const y = x < strikePrice ? -premia : (x - strikePrice) * size - premia;
    plot.push({ market: x, usd: y });
  }

  const domain = [plot[0].usd * 1.5, plot[plot.length - 1].usd];

  return { plot, domain };
};

const longPut = (
  strikePrice: number,
  premia: number,
  size: number
): GraphData => {
  const step = 0.25;
  const granuality = strikePrice / step;
  const spread = [0.75 * granuality, 1.1 * granuality];
  const plot = [];

  for (let i = spread[0]; i <= spread[1]; i++) {
    const x = i * step;
    const y = x < strikePrice ? (strikePrice - x) * size - premia : -premia;
    plot.push({ market: x, usd: y });
  }

  const domain = [1.5 * plot[plot.length - 1].usd, plot[0].usd];

  return { plot, domain };
};

const shortCall = (
  strikePrice: number,
  premia: number,
  size: number
): GraphData => {
  const step = 0.25;
  const granuality = strikePrice / step;
  const spread = [0.6 * granuality, 1.4 * granuality];
  const plot = [];

  for (let i = spread[0]; i <= spread[1]; i++) {
    const x = i * step;
    const y = x < strikePrice ? premia : (strikePrice - x) * size + premia;
    plot.push({ market: x, usd: y });
  }

  const domain = [plot[plot.length - 1].usd, 1.5 * plot[0].usd];

  const data = { plot, domain };
  debug("Short Call graph data", data);
  return data;
};

const shortPut = (
  strikePrice: number,
  premia: number,
  size: number
): GraphData => {
  const step = 0.25;
  const granuality = strikePrice / step;
  const spread = [0.8 * granuality, 1.2 * granuality];
  const plot = [];

  for (let i = spread[0]; i <= spread[1]; i++) {
    const x = i * step;
    const y = x < strikePrice ? (x - strikePrice) * size + premia : premia;
    plot.push({ market: x, usd: y });
  }

  const domain = [plot[0].usd, 2 * plot[plot.length - 1].usd];

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
