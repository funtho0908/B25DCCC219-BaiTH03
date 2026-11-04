import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Plus, Star } from "lucide-react";
import type { Product } from "../types";
import { useAppDispatch } from "../app/hooks";
import { addToCart } from "../features/cart/cartSlice";
import { formatCurrency } from "../utils/formatCurrency";
import { useToast } from "../contexts/ToastContext";
export default function ProductCard({ product }: { product: Product }) {
  const [favorite, setFavorite] = useState(false);
  const dispatch = useAppDispatch();
  const toast = useToast();
  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <Link to={`/products/${product.id}`} className="product-image-link">
          <img
            src={product.image}
            alt={product.title}
            loading="lazy"
            className="product-image"
          />
        </Link>
        <button
          className={`favorite ${favorite ? "selected" : ""}`}
          aria-label={`${favorite ? "Remove from" : "Add to"} favorites: ${product.title}`}
          aria-pressed={favorite}
          onClick={() => setFavorite(!favorite)}
        >
          <Heart size={18} fill={favorite ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="product-meta">
        <span>{product.category}</span>
        {product.rating && (
          <span className="rating">
            <Star size={12} fill="currentColor" />
            {product.rating.rate} <span>({product.rating.count})</span>
          </span>
        )}
      </div>
      <Link className="product-title" to={`/products/${product.id}`}>
        {product.title}
      </Link>
      <p className="product-description">{product.description}</p>
      <div className="product-bottom">
        <strong>{formatCurrency(product.price)}</strong>
        <button
          className="add-button"
          onClick={() => {
            dispatch(addToCart({ product, quantity: 1 }));
            toast("Added to your bag. Nice choice!");
          }}
        >
          <Plus size={15} /> Add to cart
        </button>
      </div>
    </article>
  );
}
