import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import type { CartItem as CartItemType } from "../types";
import { useAppDispatch } from "../app/hooks";
import { removeFromCart, updateQuantity } from "../features/cart/cartSlice";
import { formatCurrency } from "../utils/formatCurrency";
import QuantityControl from "./QuantityControl";
import { useToast } from "../contexts/ToastContext";
export default function CartItem({ item }: { item: CartItemType }) {
  const dispatch = useAppDispatch();
  const toast = useToast();
  return (
    <article className="cart-item">
      <Link to={`/products/${item.productId}`} className="cart-image">
        <img src={item.image} alt={item.title} />
      </Link>
      <div className="cart-item-info">
        <Link to={`/products/${item.productId}`}>{item.title}</Link>
        <p>{formatCurrency(item.price)} each</p>
        <QuantityControl
          value={item.quantity}
          onChange={(quantity) =>
            dispatch(updateQuantity({ productId: item.productId, quantity }))
          }
        />
      </div>
      <div className="cart-item-end">
        <strong>
          {formatCurrency((Math.round(item.price * 100) * item.quantity) / 100)}
        </strong>
        <button
          className="text-button"
          onClick={() => {
            dispatch(removeFromCart(item.productId));
            toast("Product removed from your bag successfully.");
          }}
        >
          <Trash2 size={15} /> Remove
        </button>
      </div>
    </article>
  );
}
