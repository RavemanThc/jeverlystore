import instagramProducts from "@/data/instagram-products.json";
export type Product = {
  id: string;
  name: string;
  category: string;
  material: string;
  description: string;
  price: number;
  currency: string;
  image: string;
  sku?: string;
  sourceUrl?: string;
  sourceDate?: string;
};
export const categories = [
  "Усі прикраси",
  "Каблучки",
  "Сережки",
  "Кольє",
  "Браслети",
  "Шарми",
];
export const catalogProducts: Product[] = instagramProducts;
export function formatPrice(product: Pick<Product, "price" | "currency">) {
  const amount = new Intl.NumberFormat("uk-UA", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(product.price);
  return `${amount} ${product.currency === "UAH" ? "грн" : product.currency}`;
}
export function parseProducts(data: unknown): Product[] {
  if (
    !data ||
    typeof data !== "object" ||
    !("products" in data) ||
    !Array.isArray(data.products)
  )
    throw new Error("Некоректна відповідь каталогу");
  return data.products.map((item: unknown) => {
    if (!item || typeof item !== "object") throw new Error("Некоректний товар");
    const p = item as Record<string, unknown>;
    for (const key of [
      "id",
      "name",
      "category",
      "material",
      "description",
      "currency",
      "image",
    ])
      if (typeof p[key] !== "string") throw new Error("Неповні дані товару");
    if (
      typeof p.price !== "number" ||
      !Number.isFinite(p.price) ||
      p.price < 0 ||
      !/^[A-Z]{3}$/.test(p.currency as string)
    )
      throw new Error("Некоректна ціна");
    if (
      !(p.image as string).startsWith("/") &&
      !/^https:\/\//.test(p.image as string)
    )
      throw new Error("Некоректне зображення");
    return p as Product;
  });
}
