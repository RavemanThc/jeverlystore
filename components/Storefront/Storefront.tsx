"use client";
import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { firebaseConfigured, getFirebaseAuth } from "@/lib/firebase";
import {
  categories,
  catalogProducts,
  formatPrice,
  parseProducts,
  type Product,
} from "@/lib/products";
import Header from "../Header/Header";
import Hero from "../Hero/Hero";
import ProductCard from "../ProductCard/ProductCard";
import Dialog from "../Dialog/Dialog";
import AuthPanel from "../AuthPanel/AuthPanel";
import Story from "../Story/Story";
import Footer from "../Footer/Footer";
import styles from "./Storefront.module.css";
type Panel = "menu" | "account" | "bag" | "favorites" | "product" | null;
const api = process.env.NEXT_PUBLIC_API_URL;
export default function Storefront() {
  const [products, setProducts] = useState<Product[]>(
    api ? [] : catalogProducts,
  );
  const [loading, setLoading] = useState(!!api);
  const [error, setError] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [search, setSearch] = useState("");
  const [panel, setPanel] = useState<Panel>(null);
  const [selected, setSelected] = useState<Product | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [bag, setBag] = useState<Record<string, number>>({});
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [announcement, setAnnouncement] = useState("");
  useEffect(() => {
    try {
      const f: unknown = JSON.parse(
        localStorage.getItem("jeverlly-favorites") || "[]",
      );
      const b: unknown = JSON.parse(
        localStorage.getItem("jeverlly-bag") || "{}",
      );
      if (Array.isArray(f))
        setFavorites(f.filter((v): v is string => typeof v === "string"));
      if (b && typeof b === "object" && !Array.isArray(b))
        setBag(
          Object.fromEntries(
            Object.entries(b).filter(
              ([, v]) =>
                typeof v === "number" &&
                Number.isInteger(v) &&
                v > 0 &&
                v <= 99,
            ),
          ),
        );
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) {
      try {
        localStorage.setItem("jeverlly-favorites", JSON.stringify(favorites));
        localStorage.setItem("jeverlly-bag", JSON.stringify(bag));
      } catch {}
    }
  }, [favorites, bag, ready]);
  useEffect(() => {
    if (!firebaseConfigured) return;
    return onAuthStateChanged(getFirebaseAuth(), setUser);
  }, []);
  useEffect(() => {
    if (!api) return;
    const controller = new AbortController();
    fetch(`${api.replace(/\/$/, "")}/products`, { signal: controller.signal })
      .then(async (r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => setProducts(parseProducts(data)))
      .catch((e) => {
        if (e.name !== "AbortError")
          setError(
            "Не вдалося завантажити колекцію. Спробуйте оновити сторінку або напишіть нам в Instagram.",
          );
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);
  function toggle(id: string) {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }
  function add(p: Product) {
    setBag((prev) => ({
      ...prev,
      [p.id]: Math.min(99, (prev[p.id] || 0) + 1),
    }));
    setAnnouncement(`${p.name} — додано до кошика`);
  }
  function quantity(id: string, change: number) {
    setBag((prev) => {
      const next = { ...prev };
      next[id] = Math.min(99, (next[id] || 0) + change);
      if (next[id] <= 0) delete next[id];
      return next;
    });
  }
  function open(p: Product) {
    setSelected(p);
    setPanel("product");
  }
  function goToCollection() {
    setPanel(null);
    document
      .getElementById("collection")
      ?.scrollIntoView({ behavior: "smooth" });
  }
  const shown = products.filter(
    (p) =>
      (category === categories[0] || p.category === category) &&
      `${p.name} ${p.material} ${p.category} ${p.sku || ""}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  const items = products.filter((p) => bag[p.id]);
  const count = items.reduce((n, p) => n + bag[p.id], 0);
  const title =
    panel === "account"
      ? "Особистий кабінет"
      : panel === "bag"
        ? "Ваш кошик"
        : panel === "favorites"
          ? "Обране"
          : panel === "product"
            ? selected?.name || "Прикраса"
            : "Світ Jeverly Butique";
  return (
    <>
      <Header
        count={count}
        signedIn={!!user}
        onMenu={() => setPanel("menu")}
        onAccount={() => setPanel("account")}
        onBag={() => setPanel("bag")}
        onFavorites={() => setPanel("favorites")}
        onSearch={() => {
          goToCollection();
          document
            .getElementById("catalog-search")
            ?.focus({ preventScroll: true });
        }}
      />
      <main id="main">
        <Hero />
        <section id="collection" className={styles.collection}>
          <div className={styles.intro}>
            <span className={styles.eyebrow}>МИСТЕЦТВО БУТИ СОБОЮ</span>
            <h2>
              Знайдіть своє <em>сяйво</em>
            </h2>
            <p>
              Тихий акцент або сміливе зізнання.
              <br />
              Прикраса, що говорить вашою мовою.
            </p>
          </div>
          <div className={styles.toolbar}>
            <div className={styles.filters} aria-label="Категорії">
              {categories.map((c) => (
                <button
                  key={c}
                  aria-pressed={category === c}
                  onClick={() => setCategory(c)}
                >
                  {c}
                </button>
              ))}
            </div>
            <label className={styles.search}>
              <span>Пошук</span>
              <input
                id="catalog-search"
                type="search"
                placeholder="Знайти прикрасу"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>
          </div>
          {!api && (
            <p className={styles.demo}>
              Колекція з Instagram · актуальну наявність і розмір уточнюйте в
              Direct
            </p>
          )}
          {loading ? (
            <p className={styles.empty} role="status">
              Завантажуємо колекцію…
            </p>
          ) : error ? (
            <p className={styles.empty} role="alert">
              {error}
            </p>
          ) : (
            <>
              <div className={styles.grid}>
                {shown.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    favorite={favorites.includes(p.id)}
                    onFavorite={() => toggle(p.id)}
                    onOpen={() => open(p)}
                  />
                ))}
              </div>
              {!shown.length && (
                <p className={styles.empty}>
                  Прикрас не знайдено. Спробуйте іншу категорію або запит.
                </p>
              )}
            </>
          )}
          <div className={styles.collectionEnd}>
            <span>У кожній деталі — щось особисте.</span>
            <a
              href="https://www.instagram.com/jeverllyb/"
              target="_blank"
              rel="noreferrer"
            >
              Більше натхнення в Instagram ↗
            </a>
          </div>
        </section>
        <Story />
        <section className={styles.contact}>
          <span className={styles.eyebrow}>ВАША ПРИКРАСА ЧЕКАЄ НА ВАС</span>
          <h2>
            Почнемо з маленького <em>«хочу»?</em>
          </h2>
          <p>Допоможемо вибрати саме ту. Просто напишіть нам.</p>
          <a
            href="https://www.instagram.com/jeverllyb/"
            target="_blank"
            rel="noreferrer"
          >
            Зв’язатися з Jeverly Butique ↗
          </a>
        </section>
      </main>
      <Footer />
      <div className={styles.announcement} role="status">
        {announcement && (
          <button
            onClick={() => {
              setPanel("bag");
              setAnnouncement("");
            }}
          >
            {announcement} · Відкрити →
          </button>
        )}
      </div>
      {panel && (
        <Dialog title={title} onClose={() => setPanel(null)}>
          {panel === "menu" && (
            <nav className={styles.menu}>
              <button onClick={() => setPanel("favorites")}>Обране ♡</button>
              <a href="#collection" onClick={() => setPanel(null)}>
                Колекція <span>01</span>
              </a>
              <a href="#story" onClick={() => setPanel(null)}>
                Філософія Jeverly Butique <span>02</span>
              </a>
              <a href="#contact" onClick={() => setPanel(null)}>
                Контакти <span>03</span>
              </a>
            </nav>
          )}
          {panel === "account" && <AuthPanel user={user} />}
          {panel === "product" && selected && (
            <div className={styles.detail}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={selected.image} alt={selected.name} />
              <span className={styles.eyebrow}>{selected.category}</span>
              <h3>{selected.material}</h3>
              <p>{selected.description}</p>
              {selected.sku && (
                <p className={styles.note}>Артикул: {selected.sku}</p>
              )}
              {selected.sourceUrl && (
                <a
                  className={styles.source}
                  href={selected.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Переглянути публікацію в Instagram ↗
                </a>
              )}
              <strong>{formatPrice(selected)}</strong>
              {!api && (
                <p className={styles.note}>
                  Ціна з публікації Instagram. Наявність і розмір уточнюйте
                  перед замовленням.
                </p>
              )}
              <button className={styles.primary} onClick={() => add(selected)}>
                {bag[selected.id]
                  ? `У кошику: ${bag[selected.id]} · Додати ще`
                  : "Додати до кошика"}
              </button>
              <button
                className={styles.secondary}
                onClick={() => toggle(selected.id)}
              >
                {favorites.includes(selected.id)
                  ? "Вилучити з обраного"
                  : "Зберегти в обраному"}
              </button>
            </div>
          )}
          {panel === "favorites" && (
            <div>
              {products
                .filter((p) => favorites.includes(p.id))
                .map((p) => (
                  <div className={styles.row} key={p.id}>
                    <button onClick={() => open(p)}>
                      {p.name}
                      <small>{p.material}</small>
                    </button>
                    <button
                      aria-label={`Вилучити ${p.name} з обраного`}
                      onClick={() => toggle(p.id)}
                    >
                      Видалити
                    </button>
                  </div>
                ))}
              {!products.some((p) => favorites.includes(p.id)) && (
                <p className={styles.empty}>
                  Збережіть прикраси, що сподобалися, натиснувши на сердечко.
                </p>
              )}
            </div>
          )}
          {panel === "bag" && (
            <div>
              {items.map((p) => (
                <div className={styles.row} key={p.id}>
                  <button onClick={() => open(p)}>
                    {p.name}
                    <small>{formatPrice(p)}</small>
                  </button>
                  <div className={styles.quantity}>
                    <button
                      aria-label={`Зменшити кількість ${p.name}`}
                      onClick={() => quantity(p.id, -1)}
                    >
                      −
                    </button>
                    <span>{bag[p.id]}</span>
                    <button
                      aria-label={`Збільшити кількість ${p.name}`}
                      onClick={() => quantity(p.id, 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
              {items.length ? (
                <>
                  {Array.from(new Set(items.map((p) => p.currency))).map(
                    (currency) => (
                      <p className={styles.total} key={currency}>
                        Разом{" "}
                        <strong>
                          {new Intl.NumberFormat("uk-UA", {
                            style: "currency",
                            currency,
                          }).format(
                            items
                              .filter((p) => p.currency === currency)
                              .reduce((n, p) => n + p.price * bag[p.id], 0),
                          )}
                        </strong>
                      </p>
                    ),
                  )}
                  <p className={styles.note}>
                    {api
                      ? "Для уточнення наявності, доставки та оформлення зв’яжіться з нами."
                      : "Ціни з публікацій Instagram. Наявність, розміри та остаточну суму підтвердимо в Direct."}
                  </p>
                  <a
                    className={styles.primary}
                    href="https://www.instagram.com/jeverllyb/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Обговорити замовлення в Instagram ↗
                  </a>
                </>
              ) : (
                <>
                  <p className={styles.empty}>
                    Тут буде ваша наступна улюблена прикраса.
                  </p>
                  <button className={styles.primary} onClick={goToCollection}>
                    Відкрити колекцію
                  </button>
                </>
              )}
            </div>
          )}
        </Dialog>
      )}
    </>
  );
}
