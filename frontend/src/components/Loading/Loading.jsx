import { Loader2 } from "lucide-react";
import "./Loading.css";

export function Spinner({ label = "Loading" }) {
  return (
    <div className="spinner-wrap" role="status" aria-live="polite">
      <Loader2 className="spinner-icon" size={20} aria-hidden="true" />
      <span className="visually-hidden">{label}</span>
    </div>
  );
}

export function SkeletonLine({ width = "100%", height = 14 }) {
  return <div className="skeleton-line" style={{ width, height }} />;
}

export function SkeletonStatCards() {
  return (
    <div className="skeleton-stats" aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <div className="skeleton-stat-card" key={i}>
          <SkeletonLine width="60%" height={12} />
          <SkeletonLine width="40%" height={26} />
        </div>
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 4 }) {
  return (
    <div className="skeleton-table" aria-hidden="true">
      {Array.from({ length: rows }).map((_, i) => (
        <div className="skeleton-table-row" key={i}>
          <SkeletonLine width="30%" />
          <SkeletonLine width="20%" />
          <SkeletonLine width="15%" />
        </div>
      ))}
    </div>
  );
}
