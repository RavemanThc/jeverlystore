import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/products";
import Icon from "../Icon/Icon";
import styles from "./ProductCard.module.css";
export default function ProductCard({
  product,
  favorite,
  onFavorite,
  onOpen,
}: {
  product: Product;
  favorite: boolean;
  onFavorite: () => void;
  onOpen: () => void;
}) {
  return (
    <article className={styles.card}>
      <div className={styles.visual}>
        <button
          className={styles.open}
          onClick={onOpen}
          aria-label={`Докладніше: ${product.name}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.image} alt={product.name} loading="lazy" />
        </button>
        <button
          className={styles.heart}
          aria-label={`${favorite ? "Вилучити з" : "Додати до"} обраного: ${product.name}`}
          aria-pressed={favorite}
          onClick={onFavorite}
        >
          <Icon name="heart" />
        </button>
        <span className={styles.category}>{product.category}</span>
      </div>
      <div className={styles.info}>
        <button onClick={onOpen}>{product.name}</button>
        <span>{formatPrice(product)}</span>
        <p>{product.material}</p>
        {product.sku && (
          <small className={styles.sku}>Арт. {product.sku}</small>
        )}
      </div>
    </article>
  );
}
