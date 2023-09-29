import { OptionWithPremia } from "../../classes/Option";
import { debug } from "../../utils/debugger";
import styles from "./profittable.module.css";

type ProfitTableTemplateProps = {
  limited: string;
  unlimited: string;
  breakEven: string;
  isLong: boolean;
};

const ProfitTableTemplate = ({
  limited,
  unlimited,
  breakEven,
  isLong,
}: ProfitTableTemplateProps) => (
  <div className={styles.container}>
    <div className={styles.row}>
      <span>Max Profit</span>
      <span>{isLong ? unlimited : limited}</span>
    </div>
    <div className={styles.row}>
      <span>Max Loss</span>
      <span>{!isLong ? unlimited : limited}</span>
    </div>
    <div className={styles.row}>
      <span>Break Even</span>
      <span>{breakEven}</span>
    </div>
    <div className={styles.row}>
      <span>Total in ETH</span>
      <span>0.00123</span>
    </div>
  </div>
);

export const ProfitTableSkeleton = () => (
  <ProfitTableTemplate
    limited="Calculating..."
    unlimited="Calculating..."
    breakEven="Calculating..."
    isLong={true}
  />
);

type ProfitTableProps = {
  option: OptionWithPremia;
  basePremia: number;
  premia: number;
};

export const ProfitTable = ({
  option,
  basePremia,
  premia,
}: ProfitTableProps) => {
  const limited = "$" + premia.toFixed(2);
  const unlimited = "Unlimited";
  const breakEven =
    "$" +
    (option.isCall
      ? option.strike + basePremia
      : option.strike - basePremia
    ).toFixed(2);
  debug({ strk: option.strike, breakEven });

  return (
    <ProfitTableTemplate
      limited={limited}
      unlimited={unlimited}
      breakEven={breakEven}
      isLong={option.isLong}
    />
  );
};
