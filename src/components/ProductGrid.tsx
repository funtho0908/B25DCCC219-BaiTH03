import ProductCard from "./ProductCard";
import type { Product } from "../types";
export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="product-grid grid grid-cols-1 gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard product={product} key={product.id} />
      ))}
    </div>
  );
}
