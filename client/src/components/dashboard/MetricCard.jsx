import { ArrowDownRight, ArrowUpRight } from "lucide-react";

function Change({ value }) {
  const positive = value >= 0;
  const Icon = positive ? ArrowUpRight : ArrowDownRight;

  return (
    <span className={`change ${positive ? "positive" : "negative"}`}>
      <Icon size={14} />
      {Math.abs(value).toFixed(2)}%
    </span>
  );
}

export default function MetricCard({
  label,
  value,
  change,
  note,
  icon: Icon,
  color = "green",
}) {
  return (
    <div className="metric-card">
      <div className="metric-heading">
        <span>{label}</span>

        <div className={`metric-icon metric-icon-${color}`}>
          <Icon size={18} />
        </div>
      </div>

      <div className="metric-value">{value}</div>

      <div className="metric-footer">
        {change !== undefined ? (
          <Change value={change} />
        ) : (
          <span className="metric-note">{note}</span>
        )}

        {change !== undefined && (
          <span className="metric-note">{note}</span>
        )}
      </div>
    </div>
  );
}