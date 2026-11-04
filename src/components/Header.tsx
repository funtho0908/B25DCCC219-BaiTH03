import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate, useSearchParams } from "react-router-dom";
import {
  ShoppingBag,
  ShoppingCart,
  Sun,
  Moon,
  UserRound,
  Menu,
  X,
  ArrowUpRight,
  Phone,
  LogOut,
} from "lucide-react";
import { useAppSelector } from "../app/hooks";
import { selectCartTotalQuantity } from "../features/cart/cartSlice";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
export function Logo() {
  return (
    <Link className="logo" to="/" aria-label="ShopMini home">
      <ShoppingBag size={31} strokeWidth={2.3} />
      <span>
        Shop<span className="logo-light">Mini</span>
        <span className="logo-dot">.</span>
      </span>
    </Link>
  );
}
export default function Header() {
  const quantity = useAppSelector(selectCartTotalQuantity);
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const searchQuery = params.get("q") ?? "";
  useEffect(() => setQuery(searchQuery), [searchQuery]);
  const navigate = useNavigate();
  return (
    <>
      <div className="promo-bar">
        <div className="container promo-inner">
          <span className="promo-phone">
            <Phone size={12} /> +1 (800) 555-SHOP
          </span>
          <span>
            A little joy, delivered.{" "}
            <Link to="/#products">
              Explore the collection <ArrowUpRight size={12} />
            </Link>
          </span>
          <span className="promo-region">
            USD $ <span>•</span> English
          </span>
        </div>
      </div>
      <header className="header">
        <div className="container nav-row">
          <Logo />
          <nav
            className={open ? "nav-links is-open" : "nav-links"}
            aria-label="Main navigation"
          >
            <NavLink to="/" end onClick={() => setOpen(false)}>
              Home
            </NavLink>
            <Link to="/#categories" onClick={() => setOpen(false)}>
              Categories
            </Link>
            <Link
              to="/?collection=deals#products"
              onClick={() => setOpen(false)}
            >
              Deals <span className="tiny-dot" />
            </Link>
            <Link to="/?sort=newest#products" onClick={() => setOpen(false)}>
              New Arrivals
            </Link>
          </nav>
          <form
            className="header-search"
            onSubmit={(event) => {
              event.preventDefault();
              navigate(`/?q=${encodeURIComponent(query)}#products`);
            }}
          >
            <input
              aria-label="Search store"
              placeholder="Search products"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <button aria-label="Submit search">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
              >
                <circle cx="10.5" cy="10.5" r="6.5" />
                <path d="m16 16 5 5" />
              </svg>
            </button>
          </form>
          <div className="nav-actions">
            <button
              className="icon-button"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            {user ? (
              <>
                <span className="user-name" title={user.username}>
                  {user.username}
                </span>
                <button
                  className="icon-button"
                  onClick={logout}
                  aria-label="Log out"
                  title="Log out"
                >
                  <LogOut size={19} />
                </button>
              </>
            ) : (
              <Link className="account-link" to="/login">
                <UserRound size={21} />
                <span>Sign in</span>
              </Link>
            )}
            <Link
              className="cart-link"
              to="/cart"
              aria-label={`Cart, ${quantity} items`}
            >
              <ShoppingCart size={22} />
              <span className="cart-badge">{quantity}</span>
            </Link>
            <button
              className="icon-button mobile-toggle"
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen(!open)}
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        <form
          className="mobile-search container"
          onSubmit={(event) => {
            event.preventDefault();
            navigate(`/?q=${encodeURIComponent(query)}#products`);
          }}
        >
          <input
            aria-label="Search store on mobile"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Find your next favorite..."
          />
          <button aria-label="Search">Search</button>
        </form>
      </header>
    </>
  );
}
