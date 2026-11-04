import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft, ShoppingBag } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  selectCartItems,
  selectCartTotalQuantity,
  clearCart,
} from "../features/cart/cartSlice";
import CartItem from "../components/CartItem";
import OrderSummary from "../components/OrderSummary";
import EmptyState from "../components/EmptyState";
import { useToast } from "../contexts/ToastContext";
export default function CartPage() {
  const items = useAppSelector(selectCartItems);
  const count = useAppSelector(selectCartTotalQuantity);
  const dispatch = useAppDispatch();
  const toast = useToast();
  return (
    <div className="container page-space">
      <div className="page-heading">
        <span className="eyebrow">YOUR GOOD FINDS, ALL TOGETHER</span>
        <h1>
          Your shopping bag<span className="green-dot">.</span>
        </h1>
        <p>
          {count} item{count !== 1 ? "s" : ""} chosen with a little love.
        </p>
      </div>
      {!items.length ? (
        <EmptyState />
      ) : (
        <div className="checkout-grid">
          <section>
            <div className="cart-list-heading">
              <span>
                <ShoppingBag size={18} /> Your items
              </span>
              <button
                className="text-button"
                onClick={() => {
                  dispatch(clearCart());
                  toast("Your shopping bag has been cleared successfully.");
                }}
              >
                Clear bag
              </button>
            </div>
            {items.map((item) => (
              <CartItem item={item} key={item.productId} />
            ))}
            <Link className="inline-link continue-link" to="/">
              <ArrowLeft size={17} /> Continue shopping
            </Link>
          </section>
          <OrderSummary>
            <Link className="btn full-width" to="/checkout">
              Proceed to checkout <ArrowRight size={18} />
            </Link>
          </OrderSummary>
        </div>
      )}
    </div>
  );
}
