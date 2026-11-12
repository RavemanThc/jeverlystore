import BrandLogo from "../BrandLogo/BrandLogo";
import styles from "./Footer.module.css";
export default function Footer() {
  return (
    <footer className={styles.footer} id="contact">
      <div className={styles.top}>
        <div>
          <a className={styles.logo} href="#">
            <BrandLogo />
          </a>
          <p>Ближче, ніж коштовність.</p>
        </div>
        <div>
          <h3>Світ Jeverly Butique</h3>
          <a href="#collection">Колекція</a>
          <a href="#story">Наша філософія</a>
        </div>
        <div>
          <h3>Ми поруч</h3>
          <a
            href="https://www.instagram.com/jeverllyb/"
            target="_blank"
            rel="noreferrer"
          >
            Instagram ↗
          </a>
          <p>
            Підбір прикрас, наявність
            <br />
            та умови доставки — у Direct.
          </p>
        </div>
      </div>
      <div className={styles.bottom}>
        <span>© 2026 Jeverly Butique</span>
        <span>ДЛЯ ВАШИХ ОСОБЛИВИХ МИТЕЙ</span>
        <a href="#">Нагору ↑</a>
      </div>
    </footer>
  );
}
