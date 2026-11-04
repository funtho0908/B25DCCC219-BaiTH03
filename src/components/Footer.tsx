import { ArrowUpRight, Instagram, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { Logo } from "./Header";
export default function Footer() {
  return (
    <footer>
      <div className="container footer-main">
        <div className="footer-about">
          <Logo />
          <p>
            Good things. Great prices.
            <br />A little something for your everyday.
          </p>
          <div className="footer-social">
            <Instagram size={18} />
            <ShoppingBag size={18} />
            <span>Made for the way you live.</span>
          </div>
        </div>
        <div>
          <h4>Discover</h4>
          <Link to="/">All products</Link>
          <Link to="/?collection=deals#products">Everyday deals</Link>
          <Link to="/?sort=newest#products">
            New arrivals <ArrowUpRight size={12} />
          </Link>
        </div>
        <div>
          <h4>Your ShopMini</h4>
          <Link to="/login">Your account</Link>
          <Link to="/cart">Shopping bag</Link>
          <Link to="/checkout">Checkout</Link>
        </div>
        <div className="footer-note">
          <span className="eyebrow">A SMALL STORE. A BIG LITTLE WORLD.</span>
          <h3>Everyday, elevated.</h3>
          <p>
            Thoughtful finds for everyday living.
            <br />
            Demo checkout. No real payments.
          </p>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>
          © {new Date().getFullYear()} ShopMini. Thoughtfully curated.
        </span>
        <span>
          Powered by Fake Store API <span className="status-dot" />
        </span>
      </div>
    </footer>
  );
}
