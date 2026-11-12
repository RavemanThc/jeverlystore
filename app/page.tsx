import Storefront from "@/components/Storefront/Storefront";
import styles from "./page.module.css";
export default function Home() {
  return (
    <div className={styles.page}>
      <Storefront />
    </div>
  );
}
