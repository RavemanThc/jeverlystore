import styles from "./BrandLogo.module.css";
export default function BrandLogo() {
  return (
    <span className={styles.brand}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/jeverly-butique.jpg"
        width="64"
        height="64"
        alt="Логотип JB"
      />
      <span className={styles.name}>
        Jeverly<span className={styles.subtitle}>Butique</span>
      </span>
    </span>
  );
}
