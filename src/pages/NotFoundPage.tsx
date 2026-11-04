import { Link } from "react-router-dom";
import { ArrowRight, Compass } from "lucide-react";
export default function NotFoundPage({
  product = false,
}: {
  product?: boolean;
}) {
  return (
    <div className="container not-found">
      <Compass size={48} />
      <span className="error-number">
        404<span>.</span>
      </span>
      <h1>{product ? "Product not found." : "Page Not Found"}</h1>
      <p>
        Looks like this little corner of the shop doesn’t exist.
        <br />
        There are still plenty of good things to discover.
      </p>
      <Link className="btn" to="/">
        Back to home <ArrowRight size={17} />
      </Link>
    </div>
  );
}
