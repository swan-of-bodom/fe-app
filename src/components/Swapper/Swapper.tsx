import styles from "./Swapper.module.css";

/* @ts-ignore */
import FibrousWidget from "fibrous-widget";

const Swapper = () => {
  return (
    <div className={styles.swapperContainer}>
      <FibrousWidget theme={"dark"} />
    </div>
  );
};

export default Swapper;
