export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: { rate: number; count: number };
}
export interface CartItem {
  productId: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}
export interface User {
  username: string;
}
export function isProduct(value: unknown): value is Product {
  if (!value || typeof value !== "object") return false;
  const p = value as Record<string, unknown>;
  return (
    typeof p.id === "number" &&
    Number.isInteger(p.id) &&
    p.id > 0 &&
    typeof p.title === "string" &&
    typeof p.price === "number" &&
    Number.isFinite(p.price) &&
    p.price >= 0 &&
    typeof p.description === "string" &&
    typeof p.category === "string" &&
    typeof p.image === "string" &&
    /^https?:\/\//.test(p.image) &&
    (p.rating === undefined ||
      (!!p.rating &&
        typeof p.rating === "object" &&
        "rate" in p.rating &&
        typeof p.rating.rate === "number" &&
        "count" in p.rating &&
        typeof p.rating.count === "number"))
  );
}
