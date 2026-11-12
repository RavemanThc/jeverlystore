import styles from "./Hero.module.css";
export default function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.image} />
      <div className={styles.content}>
        <span className={styles.eyebrow}>СВІТ JEVERLY BUTIQUE</span>
        <h1 id="hero-title">
          Коштовні
          <br />
          миті.
          <br />
          <em>Ваші назавжди.</em>
        </h1>
        <p>Прикраси, у яких відображаєтеся ви.</p>
        <a href="#collection" className={styles.cta}>
          Відкрити колекцію <span>↗</span>
        </a>
      </div>
      <div className={styles.bottom}>
        <span>МАЛЕНЬКІ ДЕТАЛІ. ВЕЛИКІ ПОЧУТТЯ.</span>
        <a href="#collection" aria-label="Перейти до колекції">
          Гортайте вниз ↓
        </a>
      </div>
    </section>
  );
}
