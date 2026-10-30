
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

function Change({ value }) {
  const positive = value >= 0;
  const Icon = positive ? ArrowUpRight : ArrowDownRight;

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold tabular-nums ${
        positive ? "text-emerald-300" : "text-red-300"
      }`}
    >
      <Icon size={14} />
      {Math.abs(value).toFixed(2)}%
    </span>
  );
}

const iconColors = {
  green: "border-emerald-400/15 bg-emerald-400/10 text-emerald-300",
  blue: "border-sky-400/15 bg-sky-400/10 text-sky-300",
  purple: "border-violet-400/15 bg-violet-400/10 text-violet-300",
  orange: "border-amber-400/15 bg-amber-400/10 text-amber-300",
  red: "border-red-400/15 bg-red-400/10 text-red-300",
};

export default function MetricCard({
  label,
  value,
  change,
  note,
  icon: Icon,
  color = "green",
}) {
  const iconColor =
    iconColors[color] ?? iconColors.green;

  return (
    <div className="rounded-2xl border border-slate-800/80 bg-[#0c1220] p-5 transition duration-200 hover:border-slate-700 hover:bg-[#0e1626] sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <span className="text-sm font-medium text-slate-400">
          {label}
        </span>

        {Icon && (
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${iconColor}`}
          >
            <Icon size={18} />
          </div>
        )}
      </div>

      <div className="mt-5 break-words text-2xl font-bold tracking-tight tabular-nums text-white sm:text-3xl">
        {value}
      </div>

      <div className="mt-4 flex min-h-5 flex-wrap items-center justify-between gap-2">
        {change !== undefined ? (
          <Change value={change} />
        ) : (
          <span className="text-xs text-slate-500">{note}</span>
        )}

        {change !== undefined && (
          <span className="text-xs text-slate-500">{note}</span>
        )}
      </div>
    </div>
  );
}
