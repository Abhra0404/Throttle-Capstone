
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowUpRight,
} from "lucide-react";
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
  }).format(value);

export default function PortfolioChart({ range, setRange }) {
  const data = portfolioChartData[range] ?? portfolioChartData["1D"];

  const firstValue = data[0]?.value ?? 0;
  const lastValue = data[data.length - 1]?.value ?? 0;

  const change = lastValue - firstValue;
  const changePercent =
    firstValue > 0 ? (change / firstValue) * 100 : 0;

  return (
    <section className="panel chart-panel">
      <div className="panel-heading chart-heading">
        <div>
          <div className="section-kicker">
            PORTFOLIO PERFORMANCE
          </div>
          <h2>Portfolio value</h2>
          <p className="muted">
            Your simulated account over time
          </p>
        </div>

        <div className="range-switcher">
          {chartRanges.map((item) => (
            <button
              key={item}
              className={range === item ? "range-active" : ""}
              onClick={() => setRange(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="chart-total">
        <strong>{money(initialPortfolio.totalValue)}</strong>

        <span
          className={`chart-gain ${
            change >= 0 ? "" : "negative"
          }`}
        >
          <ArrowUpRight size={15} />
          {change >= 0 ? "+" : ""}
          {money(change)} ({changePercent.toFixed(2)}%)
        </span>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 8, bottom: 0, left: -18 }}
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
                  stopColor="#36d399"
                  stopOpacity={0.2}
                />
                <stop
                  offset="95%"
                  stopColor="#36d399"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              stroke="#252b34"
              strokeDasharray="3 5"
              vertical={false}
            />

            <XAxis
              dataKey="time"
              tick={{ fill: "#727d8b", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              minTickGap={32}
            />

            <YAxis
              tick={{ fill: "#727d8b", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) =>
                `₹${Number(value).toLocaleString("en-IN")}`
              }
            />

            <Tooltip
              contentStyle={{
                background: "#171b22",
                border: "1px solid #303744",
                borderRadius: 10,
                color: "#f4f6f8",
              }}
              labelStyle={{
                color: "#8994a3",
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
              stroke="#36d399"
              strokeWidth={2.3}
              fill="url(#portfolioGradient)"
              activeDot={{
                r: 4,
                fill: "#36d399",
                stroke: "#171b22",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-footer">
        <span>
          <span className="legend-dot" />
          Portfolio value
        </span>
        <span className="muted">
          Illustrative chart · not live data
        </span>
      </div>
    </section>
  );
}
