import { LoaderCircle } from "lucide-react";

export default function LoadingSkeleton() {
  return (
    <>
      <p className="request-status" role="status">
        <LoaderCircle size={17} className="animate-spin" aria-hidden="true" />
        Loading products. Please wait…
      </p>
      <div
        className="product-grid grid grid-cols-1 gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-4"
        aria-label="Loading products"
        aria-busy="true"
      >
        {Array.from({ length: 8 }, (_, i) => (
          <div className="skeleton-card" key={i}>
            <div className="skeleton skeleton-image" />
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line short" />
          </div>
        ))}
      </div>
    </>
  );
}
