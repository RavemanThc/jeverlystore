import styles from "./Story.module.css";
export default function Story() {
  return (
    <section className={styles.story} id="story">
      <div
        className={styles.photo}
        role="img"
        aria-label="Ювелірні прикраси зблизька"
      />
      <div className={styles.text}>
        <span>ФІЛОСОФІЯ JEVERLY BUTIQUE</span>
        <h2>
          Більше, ніж прикраса.
          <br />
          <em>Частина вашої історії.</em>
        </h2>
        <p>
          Перше побачення. Важливе «так». Або звичайний вівторок, який хочеться
          зробити особливим.
        </p>
        <p>
          Ми віримо: для улюбленої прикраси не потрібна нагода. Найпрекрасніша
          нагода — ви.
        </p>
        <a
          href="https://www.instagram.com/jeverllyb/"
          target="_blank"
          rel="noreferrer"
        >
          Познайомитися з Jeverly Butique <span>↗</span>
        </a>
      </div>
    </section>
  );
}
