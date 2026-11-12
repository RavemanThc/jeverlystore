import BrandLogo from "../BrandLogo/BrandLogo";
import Icon from "../Icon/Icon";
import styles from "./Header.module.css";
type Props = {
  count: number;
  signedIn: boolean;
  onMenu: () => void;
  onAccount: () => void;
  onBag: () => void;
  onFavorites: () => void;
  onSearch: () => void;
};
export default function Header(p: Props) {
  return (
    <>
      <a href="#main" className={styles.skip}>
        До вмісту
      </a>
      <header className={styles.header}>
        <button
          className={styles.menu}
          onClick={p.onMenu}
          aria-label="Відкрити меню"
        >
          <Icon name="menu" />
          <span>Меню</span>
        </button>
        <a
          className={styles.logo}
          href="#"
          aria-label="Jeverly Butique — головна"
        >
          <BrandLogo />
        </a>
        <nav
          className={styles.actions}
          aria-label="Особистий кабінет і покупки"
        >
          <button onClick={p.onSearch} aria-label="Пошук прикрас">
            <Icon name="search" />
          </button>
          <button
            onClick={p.onFavorites}
            aria-label="Обране"
            className={styles.favorite}
          >
            <Icon name="heart" />
          </button>
          <button
            onClick={p.onAccount}
            aria-label={p.signedIn ? "Мій обліковий запис" : "Увійти"}
          >
            <Icon name="user" />
          </button>
          <button onClick={p.onBag} aria-label={`Кошик: ${p.count}`}>
            <Icon name="bag" />
            {p.count > 0 && <span className={styles.count}>{p.count}</span>}
          </button>
        </nav>
      </header>
    </>
  );
}
