import LoaderCircle from "../LoaderCircle/LoaderCircle";
import styles from "./Loading.module.css";

export default function Loading() {
  return (
    <div className={styles.wrap}>
      <div className={styles.logo}>
        <h1 className={styles.heading}>DONOS.RU</h1>
        <img src="/russia.svg" alt="флаг россии" height={60} />
      </div>
      <LoaderCircle />
    </div>
  );
}
