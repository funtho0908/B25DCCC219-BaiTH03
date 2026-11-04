import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
export default function EmptyState({
  title = "Your bag is waiting for a little joy.",
  description = "Discover something you love and make it yours.",
  action,
}: {
  title?: string;
  description?: string;
  action?: () => void;
}) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <ShoppingBag size={38} />
      </div>
      <h2>{title}</h2>
      <p>{description}</p>
      {action ? (
        <button className="btn" onClick={action}>
          Reset filters
        </button>
      ) : (
        <Link className="btn" to="/">
          Continue shopping
        </Link>
      )}
    </div>
  );
}
