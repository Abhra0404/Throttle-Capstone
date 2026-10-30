
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import {
  chartRanges,
  portfolioChartData,
  initialPortfolio,
} from "../../data/mockData";

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

export default function PortfolioChart({ range, setRange }) {
  const data = portfolioChartData[range] ?? portfolioChartData["1D"];

  const firstValue = data[0]?.value ?? 0;
  const lastValue = data[data.length - 1]?.value ?? 0;

  const change = lastValue - firstValue;
  const changePercent =
    firstValue > 0 ? (change / firstValue) * 100 : 0;
  const positive = change >= 0;
  const ChangeIcon = positive ? ArrowUpRight : ArrowDownRight;

  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-800/80 bg-[#0c1220]">
      <div className="flex flex-col justify-between gap-4 border-b border-slate-800/80 p-5 sm:flex-row sm:items-center sm:p-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-400">
            Portfolio performance
          </p>

          <h2 className="mt-2 text-lg font-bold text-white">
            Portfolio value
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Your simulated account over time
          </p>
        </div>

        <div
          className="flex flex-wrap items-center gap-1 rounded-xl border border-slate-800 bg-[#080d17] p-1"
          aria-label="Portfolio chart time range"
        >
          {chartRanges.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setRange(item)}
              aria-pressed={range === item}
              className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                range === item
                  ? "bg-emerald-400/15 text-emerald-300"
                  : "text-slate-500 hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 pt-5 sm:px-6 sm:pt-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-slate-500">
              Displayed portfolio value
            </p>

            <p className="mt-2 text-2xl font-bold tracking-tight tabular-nums text-white sm:text-3xl">
              {money(initialPortfolio.totalValue)}
            </p>
          </div>

          <div
            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold tabular-nums ${
              positive
                ? "bg-emerald-400/10 text-emerald-300"
                : "bg-red-400/10 text-red-300"
            }`}
          >
            <ChangeIcon size={16} />
            {positive ? "+" : ""}
            {money(change)} ({positive ? "+" : ""}
            {changePercent.toFixed(2)}%)
          </div>
        </div>
      </div>

      <div className="mt-5 h-[280px] w-full px-2 sm:h-[320px] sm:px-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 12, bottom: 0, left: 0 }}
          >
            <defs>
              <linearGradient
                id="portfolioGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#34d399"
                  stopOpacity={0.22}
                />
                <stop
                  offset="95%"
                  stopColor="#34d399"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              stroke="#1e293b"
              strokeDasharray="3 5"
              vertical={false}
            />

            <XAxis
              dataKey="time"
              tick={{ fill: "#64748b", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              minTickGap={32}
            />

            <YAxis
              tick={{ fill: "#64748b", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              width={70}
              tickFormatter={(value) =>
                `₹${Number(value).toLocaleString("en-IN")}`
              }
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#0c1220",
                border: "1px solid #263244",
                borderRadius: 12,
                color: "#f1f5f9",
                fontSize: 12,
              }}
              labelStyle={{
                color: "#94a3b8",
                marginBottom: 5,
              }}
              formatter={(value) => [
                money(Number(value)),
                "Portfolio value",
              ]}
            />

            <Area
              type="monotone"
              dataKey="value"
              stroke="#34d399"
              strokeWidth={2.3}
              fill="url(#portfolioGradient)"
              activeDot={{
                r: 4,
                fill: "#34d399",
                stroke: "#0c1220",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/70 px-5 py-4 sm:px-6">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Portfolio value
        </div>

        <span className="text-xs text-slate-500">
          Illustrative chart · Not live data
        </span>
      </div>
    </section>
  );
}
