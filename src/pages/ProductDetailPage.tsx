import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Star,
  Truck,
  RotateCcw,
  ShoppingBag,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchProducts } from "../features/products/productsSlice";
import { addToCart } from "../features/cart/cartSlice";
import { useToast } from "../contexts/ToastContext";
import { formatCurrency } from "../utils/formatCurrency";
import { categoryLabel } from "../components/CategoryFilter";
import QuantityControl from "../components/QuantityControl";
import ProductGrid from "../components/ProductGrid";
import LoadingSkeleton from "../components/LoadingSkeleton";
import ErrorState from "../components/ErrorState";
import NotFoundPage from "./NotFoundPage";
export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { items, status, error } = useAppSelector((state) => state.products);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const [quantity, setQuantity] = useState(1);
  useEffect(() => setQuantity(1), [id]);
  const product = items.find((item) => item.id === Number(id));
  if (status === "idle" || status === "loading")
    return (
      <div className="container page-space">
        <LoadingSkeleton />
      </div>
    );
  if (status === "failed")
    return (
      <ErrorState
        message={error ?? "Please try again."}
        retry={() => void dispatch(fetchProducts())}
      />
    );
  if (!product) return <NotFoundPage product />;
  const add = () => {
    dispatch(addToCart({ product, quantity }));
    toast(`${quantity} item${quantity > 1 ? "s" : ""} added to your bag.`);
  };
  const related = items
    .filter(
      (item) => item.category === product.category && item.id !== product.id,
    )
    .slice(0, 4);
  return (
    <div className="container page-space">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <ChevronRight size={12} />
        <Link
          to={`/?category=${encodeURIComponent(product.category)}#products`}
        >
          {categoryLabel(product.category)}
        </Link>
        <ChevronRight size={12} />
        <span>Product details</span>
      </nav>
      <section className="detail-grid">
        <div className="detail-image">
          <img src={product.image} alt={product.title} />
          <span className="image-caption">THE EVERYDAY COLLECTION</span>
        </div>
        <div className="detail-info">
          <span className="eyebrow">{categoryLabel(product.category)}</span>
          <h1>{product.title}</h1>
          {product.rating && (
            <div className="detail-rating">
              <span>
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={
                      i < Math.round(product.rating!.rate)
                        ? "currentColor"
                        : "none"
                    }
                  />
                ))}
              </span>
              <strong>{product.rating.rate}</strong>
              <span>({product.rating.count} reviews)</span>
            </div>
          )}
          <p className="detail-price">{formatCurrency(product.price)}</p>
          <p className="detail-description">{product.description}</p>
          <div className="detail-quantity">
            <QuantityControl value={quantity} onChange={setQuantity} />
            <span>A little more of what you love.</span>
          </div>
          <div className="detail-actions">
            <button className="btn" onClick={add}>
              <ShoppingBag size={18} /> Add to cart
            </button>
            <button
              className="btn btn-outline"
              onClick={() => {
                add();
                navigate("/checkout");
              }}
            >
              Buy now
            </button>
          </div>
          <div className="detail-perks">
            <div>
              <Truck size={23} />
              <div>
                <strong>Good things, delivered.</strong>
                <p>Free shipping on orders $100+. Otherwise $5.99.</p>
              </div>
            </div>
            <div>
              <RotateCcw size={23} />
              <div>
                <strong>Explore with confidence.</strong>
                <p>A complete shopping demo with no real charges.</p>
              </div>
            </div>
            <div>
              <ShieldCheck size={23} />
              <div>
                <strong>Cash on delivery</strong>
                <p>Simulated payment. No card details required.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {related.length > 0 && (
        <section className="related-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">A FEW MORE GOOD FINDS</span>
              <h2>You may also like.</h2>
            </div>
          </div>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
