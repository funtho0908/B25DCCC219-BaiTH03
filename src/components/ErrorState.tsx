import { RefreshCw, CloudOff } from "lucide-react";
export default function ErrorState({
  message,
  retry,
}: {
  message: string;
  retry: () => void;
}) {
  return (
    <div className="empty-state" role="alert">
      <CloudOff size={42} />
      <h2>Failed to load products.</h2>
      <p>{message}</p>
      <button className="btn" onClick={retry}>
        <RefreshCw size={17} /> Try again
      </button>
    </div>
  );
}
