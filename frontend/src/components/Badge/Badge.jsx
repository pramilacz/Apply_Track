import "./Badge.css";

const STATUS_CLASS = {
  Applied: "badge-applied",
  Interview: "badge-interview",
  Offer: "badge-offer",
  Rejected: "badge-rejected",
};

export default function Badge({ status }) {
  const cls = STATUS_CLASS[status] || "badge-applied";
  return (
    <span className={`badge ${cls}`}>
      <span className="badge-dot" aria-hidden="true" />
      {status}
    </span>
  );
}
