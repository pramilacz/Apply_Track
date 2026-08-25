import "./StatCard.css";

export default function StatCard({ label, value, icon: Icon, tone = "neutral" }) {
  return (
    <div className={`stat-card stat-card-${tone}`}>
      <div className="stat-card-top">
        <span className="stat-card-label">{label}</span>
        {Icon && <Icon size={16} className="stat-card-icon" aria-hidden="true" />}
      </div>
      <span className="stat-card-value">{value}</span>
    </div>
  );
}
