import { OptionSide, OptionType } from "../../types/options";

export type CurrencyData = { usd: number; market: number };

export type GraphData = {
  plot: CurrencyData[];
  domain: number[];
};

export const getProfitGraphData = (
  type: OptionType,
  side: OptionSide,
  strikePrice: number,
  premia: number,
  size: number
): GraphData => {
  const step = 0.2;
  const granuality = 1 / step;
  const spread = [0.85 * strikePrice, 1.15 * strikePrice];
  const plot = [];

  if (side === OptionSide.Long && type === OptionType.Call) {
    for (let i = spread[0] * granuality; i <= spread[1] * granuality; i++) {
      const x = i * step;
      const y = x < strikePrice ? -premia : (x - strikePrice) * size - premia;
      plot.push({ market: x, usd: y });
    }

    const [first, last] = [plot[0].usd, plot[plot.length - 1].usd];
    const domain = [first - 0.2 * last, last];

    return { plot, domain };
  }

  if (side === OptionSide.Short && type === OptionType.Call) {
    for (let i = spread[0] * granuality; i <= spread[1] * granuality; i++) {
      const x = i * step;
      const y = x < strikePrice ? premia : (strikePrice - x) * size + premia;
      plot.push({ market: x, usd: y });
    }

    const [first, last] = [plot[0].usd, plot[plot.length - 1].usd];
    const domain = [last, first - 0.3 * last];

    return { plot, domain };
  }

  if (side === OptionSide.Long && type === OptionType.Put) {
    for (let i = spread[0] * granuality; i <= spread[1] * granuality; i++) {
      const x = i * step;
      const y = x < strikePrice ? (strikePrice - x) * size - premia : -premia;
      plot.push({ market: x, usd: y });
    }

    const [first, last] = [plot[0].usd, plot[plot.length - 1].usd];
    const domain = [last - 0.3 * first, first];

    return { plot, domain };
  }

  if (side === OptionSide.Short && type === OptionType.Put) {
    for (let i = spread[0] * granuality; i <= spread[1] * granuality; i++) {
      const x = i * step;
      const y = x < strikePrice ? (x - strikePrice) * size + premia : premia;
      plot.push({ market: x, usd: y });
    }

    const [first, last] = [plot[0].usd, plot[plot.length - 1].usd];
    const domain = [first, last - 0.3 * first];

    return { plot, domain };
  }

  // Unreachable
  throw Error(`Invalid type or side ${type}, ${side}`);
};
