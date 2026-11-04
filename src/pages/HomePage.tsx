import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Truck,
  ShieldCheck,
  RotateCcw,
  Headphones,
  SlidersHorizontal,
  Sparkles,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchProducts } from "../features/products/productsSlice";
import SearchBar from "../components/SearchBar";
import CategoryFilter, {
  categories,
  categoryLabel,
} from "../components/CategoryFilter";
import ProductGrid from "../components/ProductGrid";
import LoadingSkeleton from "../components/LoadingSkeleton";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
const categoryPhotos = [
  "photo-1505740420928-5e560c06d30e",
  "photo-1617038220319-276d3cfab638",
  "photo-1516257984-b1b4d707412e",
  "photo-1434389677669-e08b4cac3105",
];
export default function HomePage() {
  const { items, status, error } = useAppSelector((state) => state.products);
  const dispatch = useAppDispatch();
  const [params, setParams] = useSearchParams();
  const query = params.get("q") ?? "";
  const category = params.get("category") ?? "";
  const price = params.get("price") ?? "";
  const sort = params.get("sort") ?? "";
  const deals = params.get("collection") === "deals";
  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { preventScrollReset: true });
  };
  const filtered = useMemo(() => {
    const result = items.filter(
      (product) =>
        product.title.toLowerCase().includes(query.trim().toLowerCase()) &&
        (!category || product.category === category) &&
        (!deals || product.price < 50) &&
        (!price ||
          (price === "under25"
            ? product.price < 25
            : price === "25to100"
              ? product.price >= 25 && product.price <= 100
              : product.price > 100)),
    );
    if (sort === "price-asc") result.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") result.sort((a, b) => b.price - a.price);
    if (sort === "name") result.sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "newest") result.sort((a, b) => b.id - a.id);
    return result;
  }, [items, query, category, price, sort, deals]);
  return (
    <div className="container home-page">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">
            <span className="small-line" /> THE EVERYDAY COLLECTION
          </span>
          <h1>
            Good finds.
            <br />
            Great little
            <br />
            <span>moments.</span>
          </h1>
          <p>
            Discover things you’ll love, at prices you’ll love even more. Your
            everyday, a little elevated.
          </p>
          <Link className="btn hero-button" to="/#products">
            Explore the collection <ArrowUpRight size={19} />
          </Link>
          <div className="hero-footnote">
            <span className="mini-stars">★★★★★</span>
            <span>Little things. A big difference.</span>
          </div>
        </div>
        <div className="hero-visual">
          <span className="hero-orbit" />
          <img
            className="hero-photo"
            src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=85"
            alt="Premium headphones, a thoughtful everyday essential"
            fetchPriority="high"
          />
          <div className="floating-tag">
            <span className="tag-icon">
              <Sparkles size={20} />
            </span>
            <div>
              <strong>Your next favorite.</strong>
              <span>Find it here at ShopMini.</span>
            </div>
          </div>
          <span className="hero-edition">CURATED FOR YOU / 01</span>
          <div className="hero-stamp">
            GOOD
            <br />
            THINGS
            <br />
            <ArrowUpRight size={22} />
          </div>
        </div>
      </section>
      <section className="benefits" aria-label="Shopping benefits">
        {[
          {
            Icon: Truck,
            title: "A little less on delivery",
            text: "Free shipping on orders $100+",
          },
          {
            Icon: ShieldCheck,
            title: "Shop with confidence",
            text: "Thoughtful finds, transparent prices",
          },
          {
            Icon: RotateCcw,
            title: "Just a demo. All the joy.",
            text: "Explore a complete shopping flow",
          },
          {
            Icon: Headphones,
            title: "Here for your everyday",
            text: "Something for every kind of you",
          },
        ].map(({ Icon, title, text }) => (
          <div className="benefit" key={title}>
            <Icon size={25} />
            <div>
              <strong>{title}</strong>
              <span>{text}</span>
            </div>
          </div>
        ))}
      </section>
      <section className="categories-section" id="categories">
        <div className="section-heading">
          <div>
            <span className="eyebrow">FIND YOUR KIND OF GOOD</span>
            <h2>
              Popular categories<span className="green-dot">.</span>
            </h2>
          </div>
          <Link className="inline-link" to="/#products">
            Shop everything <ArrowRight size={17} />
          </Link>
        </div>
        <div className="category-grid">
          {categories.map((name, index) => (
            <button
              key={name}
              className={`category-card category-${index} ${category === name ? "active" : ""}`}
              onClick={() => {
                update("category", category === name ? "" : name);
                document
                  .getElementById("products")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <div>
                <span className="category-number">
                  0{index + 1} / COLLECTION
                </span>
                <h3>{categoryLabel(name)}</h3>
                <span className="category-arrow">
                  <ArrowUpRight size={18} />
                </span>
              </div>
              <img
                src={`https://images.unsplash.com/${categoryPhotos[index]}?auto=format&fit=crop&w=400&q=80`}
                alt={categoryLabel(name)}
                loading="lazy"
              />
            </button>
          ))}
        </div>
      </section>
      <section id="products" className="products-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">A LITTLE OF EVERYTHING YOU LOVE</span>
            <h2>
              {deals ? "Good finds under $50" : "Explore our products"}
              <span className="green-dot">.</span>
            </h2>
          </div>
          <span className="results-caption">
            {status === "succeeded"
              ? `${filtered.length} thoughtfully selected finds`
              : "Fresh finds, coming your way"}
          </span>
        </div>
        <div className="filter-toolbar">
          <div className="filter-label">
            <SlidersHorizontal size={17} />
            <span>Filter</span>
          </div>
          <CategoryFilter
            value={category}
            onChange={(value) => update("category", value)}
          />
          <select
            aria-label="Filter price range"
            value={price}
            onChange={(event) => update("price", event.target.value)}
          >
            <option value="">Any price</option>
            <option value="under25">Under $25</option>
            <option value="25to100">$25 – $100</option>
            <option value="over100">Over $100</option>
          </select>
          <SearchBar
            value={query}
            onChange={(value) => update("q", value)}
            placeholder="Search the collection"
          />
          <label className="sort-select">
            <span>Sort by:</span>
            <select
              aria-label="Sort products"
              value={sort}
              onChange={(event) => update("sort", event.target.value)}
            >
              <option value="">Featured</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="name">Name: A–Z</option>
              <option value="newest">Newest</option>
            </select>
            <ChevronDown size={14} />
          </label>
        </div>
        {(query || category || price || sort || deals) && (
          <div className="active-filters">
            <span>
              {filtered.length} results{" "}
              {category && `in ${categoryLabel(category)}`}
            </span>
            <button
              className="text-button"
              onClick={() => setParams({}, { preventScrollReset: true })}
            >
              <RotateCcw size={13} /> Reset filters
            </button>
          </div>
        )}
        {status === "succeeded" && (
          <p className="request-status request-success" role="status">
            <CheckCircle2 size={17} aria-hidden="true" />
            Successfully loaded {items.length} products · {filtered.length}{" "}
            results
          </p>
        )}
        {status === "loading" || status === "idle" ? (
          <LoadingSkeleton />
        ) : status === "failed" ? (
          <ErrorState
            message={error ?? "Please check your connection."}
            retry={() => void dispatch(fetchProducts())}
          />
        ) : filtered.length ? (
          <ProductGrid products={filtered} />
        ) : (
          <EmptyState
            title="No finds just yet."
            description="Try another search or give your filters a fresh start."
            action={() => setParams({}, { preventScrollReset: true })}
          />
        )}
      </section>
      <section className="bottom-banner">
        <div>
          <span className="eyebrow">LESS SCROLLING. MORE DISCOVERING.</span>
          <h2>
            Your everyday deserves
            <br />
            something a little better.
          </h2>
          <p>From small upgrades to new favorites. Find your good thing.</p>
        </div>
        <Link className="btn" to="/?sort=newest#products">
          Meet your next favorite <ArrowUpRight size={18} />
        </Link>
        <span className="banner-decoration">sm.</span>
      </section>
    </div>
  );
}
