import { useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Banknote,
  ShoppingBag,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  selectCartItems,
  selectCartTotalPrice,
  clearCart,
} from "../features/cart/cartSlice";
import OrderSummary from "../components/OrderSummary";
import EmptyState from "../components/EmptyState";
import { formatCurrency, shippingPrice } from "../utils/formatCurrency";
interface ShippingForm {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  notes: string;
}
type Errors = Partial<Record<keyof ShippingForm, string>>;
interface DemoOrder {
  id: string;
  total: number;
  name: string;
  email: string;
}
export default function CheckoutPage() {
  const { user } = useAuth();
  const items = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartTotalPrice);
  const dispatch = useAppDispatch();
  const [form, setForm] = useState<ShippingForm>({
    fullName: user?.username ?? "",
    email: "",
    phone: "",
    address: "",
    city: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [order, setOrder] = useState<DemoOrder | null>(null);
  const locked = useRef(false);
  const [submitting, setSubmitting] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (locked.current || !user || !items.length) return;
    const next: Errors = {};
    if (form.fullName.trim().length < 2)
      next.fullName = "Please enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      next.email = "Please enter a valid email address.";
    if (
      !/^[+()\d\s.-]{7,20}$/.test(form.phone.trim()) ||
      form.phone.replace(/\D/g, "").length < 7
    )
      next.phone = "Please enter a valid phone number.";
    if (form.address.trim().length < 5)
      next.address = "Please enter your full street address.";
    if (form.city.trim().length < 2) next.city = "Please enter your city.";
    setErrors(next);
    if (Object.keys(next).length) return;
    locked.current = true;
    setSubmitting(true);
    setOrder({
      id: `SM-${Date.now().toString(36).toUpperCase()}`,
      total: subtotal + shippingPrice(subtotal),
      name: form.fullName.trim(),
      email: form.email.trim(),
    });
    dispatch(clearCart());
  };
  if (order)
    return (
      <div className="container page-space">
        <div className="order-success">
          <span className="success-icon">
            <CheckCircle2 size={48} />
          </span>
          <span className="eyebrow">A LITTLE JOY IS ON ITS WAY</span>
          <h1>You made our day, {order.name}!</h1>
          <p>Your demo order has been placed successfully.</p>
          <div className="success-receipt">
            <div>
              <span>Order number</span>
              <strong>{order.id}</strong>
            </div>
            <div>
              <span>Order total</span>
              <strong>{formatCurrency(order.total)}</strong>
            </div>
            <div>
              <span>Contact email</span>
              <strong>{order.email}</strong>
            </div>
          </div>
          <p className="muted">
            This is a simulated order. No payment, email or shipment will be
            made.
          </p>
          <Link className="btn" to="/">
            Discover more good things <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  if (!items.length)
    return (
      <div className="container page-space">
        <EmptyState
          title="Your bag is empty."
          description="Find a little something you love before checking out."
        />
      </div>
    );
  const field = (
    name: keyof ShippingForm,
    label: string,
    placeholder: string,
    type = "text",
  ) => (
    <div className={`form-field field-${name}`}>
      <label className="form-label" htmlFor={name}>
        {label} {name !== "notes" && <span>*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={form[name]}
        placeholder={placeholder}
        autoComplete={
          name === "fullName"
            ? "name"
            : name === "address"
              ? "street-address"
              : name === "city"
                ? "address-level2"
                : name === "email"
                  ? "email"
                  : name === "phone"
                    ? "tel"
                    : "off"
        }
        aria-invalid={!!errors[name]}
        aria-describedby={errors[name] ? `${name}-error` : undefined}
        required={name !== "notes"}
        onChange={(event) => {
          setForm({ ...form, [name]: event.target.value });
          setErrors((current) => ({ ...current, [name]: undefined }));
        }}
      />
      {errors[name] && (
        <p id={`${name}-error`} className="form-error">
          {errors[name]}
        </p>
      )}
    </div>
  );
  return (
    <div className="container page-space">
      <div className="page-heading">
        <span className="eyebrow">ONE LAST LITTLE STEP</span>
        <h1>
          Make it yours<span className="green-dot">.</span>
        </h1>
        <p>Good finds deserve a good home.</p>
      </div>
      <div className="checkout-steps">
        <span>
          <Check size={15} /> Shopping bag
        </span>
        <i />
        <span className="current-step">
          2 <span>Checkout</span>
        </span>
        <i />
        <span>
          3 <span>All yours</span>
        </span>
      </div>
      <form noValidate onSubmit={submit} className="checkout-grid">
        <section className="shipping-panel">
          <h2>
            <span className="step-number">01</span> Shipping information
          </h2>
          <div className="shipping-form">
            {field("fullName", "Full name", "Alex Morgan")}
            {field("email", "Email address", "alex@example.com", "email")}
            {field("phone", "Phone number", "+1 (555) 000-0000", "tel")}
            {field("address", "Street address", "House number and street name")}
            {field("city", "City", "Your city")}
            <div className="form-field field-notes">
              <label className="form-label" htmlFor="notes">
                Order notes <span className="muted">(optional)</span>
              </label>
              <textarea
                id="notes"
                rows={3}
                value={form.notes}
                placeholder="Anything we should know?"
                onChange={(event) =>
                  setForm({ ...form, notes: event.target.value })
                }
              />
            </div>
          </div>
          <h2 className="payment-heading">
            <span className="step-number">02</span> Payment method
          </h2>
          <div className="payment-method">
            <Banknote size={25} />
            <div>
              <strong>Cash on delivery</strong>
              <p>Demo payment · No actual charges</p>
            </div>
            <span className="radio-checked" />
          </div>
        </section>
        <aside>
          <div className="checkout-items">
            <h3>
              <ShoppingBag size={18} /> Your good finds
            </h3>
            {items.map((item) => (
              <div className="checkout-item" key={item.productId}>
                <img src={item.image} alt={item.title} />
                <div>
                  <strong>{item.title}</strong>
                  <span>
                    Qty {item.quantity} · {formatCurrency(item.price)} each
                  </span>
                </div>
                <strong>
                  {formatCurrency(
                    (Math.round(item.price * 100) * item.quantity) / 100,
                  )}
                </strong>
              </div>
            ))}
          </div>
          <OrderSummary>
            <button
              className="btn full-width"
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Placing order..." : "Place order"}
              <ArrowRight size={18} />
            </button>
          </OrderSummary>
        </aside>
      </form>
    </div>
  );
}
