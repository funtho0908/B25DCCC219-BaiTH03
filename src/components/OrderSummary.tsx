import type { ReactNode } from "react";
import { Truck, ShieldCheck } from "lucide-react";
import { useAppSelector } from "../app/hooks";
import {
  selectCartTotalPrice,
  selectCartTotalQuantity,
} from "../features/cart/cartSlice";
import { formatCurrency, shippingPrice } from "../utils/formatCurrency";
export default function OrderSummary({ children }: { children?: ReactNode }) {
  const subtotal = useAppSelector(selectCartTotalPrice);
  const quantity = useAppSelector(selectCartTotalQuantity);
  const shipping = shippingPrice(subtotal);
  return (
    <div className="order-summary">
      <h2>Order summary</h2>
      <div className="summary-line">
        <span>Subtotal ({quantity} items)</span>
        <strong>{formatCurrency(subtotal)}</strong>
      </div>
      <div className="summary-line">
        <span>Shipping</span>
        <strong>{shipping === 0 ? "Free" : formatCurrency(shipping)}</strong>
      </div>
      <p className="shipping-note">
        <Truck size={15} /> Free shipping on orders $100+
      </p>
      <div className="summary-line summary-total">
        <span>Total</span>
        <strong>{formatCurrency(subtotal + shipping)}</strong>
      </div>
      {children}
      <p className="secure-note">
        <ShieldCheck size={15} /> Demo checkout · No real payment
      </p>
    </div>
  );
}
