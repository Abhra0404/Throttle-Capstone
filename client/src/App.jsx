import { useState } from "react";
import Sidebar from "./components/layout/Sidebar";
import Topbar from "./components/layout/Topbar";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  Clock3,
  Plus,
  Search,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import {
  marketIndices,
  stocks,
  holdings,
  chartRanges,
  portfolioChartData,
} from "./data/mockData";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "./App.css";
import MarketOverview from "./components/dashboard/MarketOverview";
import MetricCard from "./components/dashboard/MetricCard";
import Watchlist from "./components/dashboard/Watchlist";
import Holdings from "./components/dashboard/Holdings";
import QuickTrade from "./components/dashboard/QuickTrade";

const chartData = portfolioChartData;

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);

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

function StockChart({ range, setRange, selectedStock }) {
  const data = (chartData[range] || chartData["1D"]).map(({ time, value }) => ({
    time,
    price: value,
  }));
  const last = data[data.length - 1].price;
  const first = data[0].price;
  const change = ((last - first) / first) * 100;

  return (
    <section className="panel chart-panel">
      <div className="panel-heading chart-heading">
        <div>
          <div className="section-kicker">PORTFOLIO PERFORMANCE</div>
          <h2>Portfolio value</h2>
          <p className="muted">Your simulated account over time</p>
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
        <strong>₹10,84,250.00</strong>
        <span className="chart-gain">
          <ArrowUpRight size={15} /> ₹84,250.00 (8.42%)
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
                <stop offset="0%" stopColor="#36d399" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#36d399" stopOpacity={0} />
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
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              contentStyle={{
                background: "#171b22",
                border: "1px solid #303744",
                borderRadius: 10,
                color: "#f4f6f8",
              }}
              labelStyle={{ color: "#8994a3", marginBottom: 5 }}
              formatter={(value) => [
                `₹${Number(value).toLocaleString("en-IN")}`,
                "Portfolio index",
              ]}
            />
            <Area
              type="monotone"
              dataKey="price"
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
          <span className="legend-dot" /> Portfolio value
        </span>
        <span className="muted">Illustrative chart · not live data</span>
      </div>
    </section>
  );
}

function OrderTicket({ selectedSymbol }) {
  const [side, setSide] = useState("BUY");
  const [quantity, setQuantity] = useState("1");
  const [message, setMessage] = useState("");
  const stock =
    stocks.find((item) => item.symbol === selectedSymbol) || stocks[0];
  const validQuantity =
    Number.isInteger(Number(quantity)) && Number(quantity) > 0;
  const total = validQuantity ? Number(quantity) * stock.price : 0;

  function handleSubmit(event) {
    event.preventDefault();
    if (!validQuantity) {
      setMessage("Enter a valid whole-number quantity.");
      return;
    }
    setMessage(
      "Preview only — order execution will be added with the backend.",
    );
  }

  return (
    <section className="panel order-panel">
      <div className="panel-heading">
        <div>
          <h2>Quick trade</h2>
          <p className="muted">Simulated market order</p>
        </div>
        <div className="order-mode">
          <Activity size={14} /> PAPER
        </div>
      </div>

      <div className="order-tabs">
        <button
          className={side === "BUY" ? "buy-tab active" : ""}
          onClick={() => {
            setSide("BUY");
            setMessage("");
          }}
        >
          Buy
        </button>
        <button
          className={side === "SELL" ? "sell-tab active" : ""}
          onClick={() => {
            setSide("SELL");
            setMessage("");
          }}
        >
          Sell
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <label className="field-label">Instrument</label>
        <div className="instrument-field">
          <div className="stock-logo small-logo">
            {stock.symbol.slice(0, 2)}
          </div>
          <div className="instrument-copy">
            <strong>{stock.symbol}</strong>
            <span>{stock.name}</span>
          </div>
          <div className="instrument-price">
            <strong>{money(stock.price)}</strong>
            <span>Mock price</span>
          </div>
        </div>

        <label className="field-label" htmlFor="quantity">
          Quantity
        </label>
        <div className="quantity-field">
          <button
            type="button"
            onClick={() => {
              setQuantity(String(Math.max(1, (Number(quantity) || 1) - 1)));
              setMessage("");
            }}
            aria-label="Decrease quantity"
          >
            −
          </button>
          <input
            id="quantity"
            inputMode="numeric"
            value={quantity}
            onChange={(event) => {
              setQuantity(event.target.value);
              setMessage("");
            }}
          />
          <button
            type="button"
            onClick={() => {
              setQuantity(String((Number(quantity) || 0) + 1));
              setMessage("");
            }}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        <div className="order-summary">
          <span>Estimated order value</span>
          <strong>{money(total)}</strong>
        </div>
        <div className="order-summary">
          <span>Order type</span>
          <span className="market-type">Market</span>
        </div>
        <button
          className={`submit-order ${side === "SELL" ? "submit-sell" : ""}`}
          type="submit"
        >
          {side === "BUY" ? "Review buy order" : "Review sell order"}
          <ArrowUpRight size={16} />
        </button>
        {message && <p className="form-message">{message}</p>}
        <p className="order-disclaimer">
          <ShieldCheck size={14} /> Paper trading only. No real money involved.
        </p>
      </form>
    </section>
  );
}

export default function App() {
  const [active, setActive] = useState("Overview");
  const [range, setRange] = useState("1D");
  const [selectedSymbol, setSelectedSymbol] = useState("RELIANCE");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar
        active={active}
        setActive={setActive}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <main className="main-area">
        <Topbar active={active} onOpenMenu={() => setMenuOpen(true)} />

        <div className="page-content">
          <section className="welcome-row">
            <div>
              <div className="section-kicker">WEDNESDAY, OCTOBER 21</div>
              <h1>
                Market overview<span>.</span>
              </h1>
              <p>Here's how your paper portfolio is performing today.</p>
            </div>
            <div className="welcome-actions">
              <div className="data-badge">
                <Clock3 size={14} /> Sample market data
              </div>
              <button
                className="primary-button"
                onClick={() =>
                  document
                    .getElementById("quick-trade")
                    ?.scrollIntoView({ behavior: "smooth", block: "center" })
                }
              >
                <Plus size={17} /> New trade
              </button>
            </div>
          </section>

          <MarketOverview />

          <section className="metrics-grid">
            <MetricCard
              label="Total portfolio value"
              value="₹10,84,250"
              change={8.42}
              note="vs. initial capital"
              icon={Wallet}
            />

            <MetricCard
              label="Total returns"
              value="+₹84,250"
              change={8.42}
              note="all-time return"
              icon={ChartNoAxesCombined}
            />

            <MetricCard
              label="Available cash"
              value="₹6,42,180"
              note="Ready to trade"
              icon={BriefcaseBusiness}
              color="blue"
            />

            <MetricCard
              label="Invested amount"
              value="₹4,42,070"
              note="Across 3 holdings"
              icon={Activity}
              color="purple"
            />
          </section>

          <section className="main-grid">
            <StockChart
              range={range}
              setRange={setRange}
              selectedStock={selectedSymbol}
            />

            <Watchlist
              selectedSymbol={selectedSymbol}
              setSelectedSymbol={setSelectedSymbol}
            />
          </section>

          <section className="bottom-grid">
            <Holdings />

            <div id="quick-trade">
              <QuickTrade selectedSymbol={selectedSymbol} />
            </div>
          </section>

          <footer className="page-footer">
            <span>© 2026 Throttle Trade</span>
            <span>
              <ShieldCheck size={14} /> Educational simulation · Not investment
              advice
            </span>
            <span className="footer-version">DEMO BUILD 0.1</span>
          </footer>
        </div>
      </main>
    </div>
  );
}
