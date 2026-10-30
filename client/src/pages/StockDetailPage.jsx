
import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowUpRight,
  Check,
  Clock3,
  Info,
  Star,
  TrendingUp,
  Wallet,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { stocks } from "../data/mockData";
import { useAuth } from "../context/AuthContext";
import { usePortfolio } from "../context/PortfolioContext";

const timeRanges = ["1D", "1W", "1M", "3M", "6M", "1Y"];

function formatINR(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
}

function generateHistory(stock, range) {
  const pointCount = range === "1D" ? 24 : range === "1W" ? 28 : 30;
  const volatility = Math.max(stock.price * 0.012, 1);
  const seed = stock.symbol
    .split("")
    .reduce((total, character) => total + character.charCodeAt(0), 0);

  const startingPrice =
    stock.price / (1 + (Number(stock.changePercent) || 0) / 100);

  return Array.from({ length: pointCount }, (_, index) => {
    const progress = index / Math.max(pointCount - 1, 1);
    const drift = (stock.price - startingPrice) * progress;
    const wave =
      Math.sin((index + seed) * 0.72) * volatility * 0.35 +
      Math.sin((index + seed) * 1.8) * volatility * 0.18;

    const price = Math.max(0.01, startingPrice + drift + wave);

    let time;

    if (range === "1D") {
      const hour = 9 + Math.floor((index / pointCount) * 6);
      const minute = (index * 7) % 60;
      time = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
    } else if (range === "1W") {
      time = `Day ${index + 1}`;
    } else {
      time = `${index + 1}`;
    }

    return { time, price: Number(price.toFixed(2)) };
  });
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-800/80 bg-[#0c1220] p-4">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-base font-bold tabular-nums text-slate-100">
        {value ?? "—"}
      </p>
    </div>
  );
}

export default function StockDetailPage() {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { executeTrade } = usePortfolio();

  const stock = stocks.find(
    (item) => item.symbol.toLowerCase() === symbol?.toLowerCase(),
  );

  const [range, setRange] = useState("1M");
  const [orderSide, setOrderSide] = useState("buy");
  const [quantity, setQuantity] = useState("1");
  const [watchlisted, setWatchlisted] = useState(false);
  const [notice, setNotice] = useState("");
  const [noticeType, setNoticeType] = useState("success");

  const history = useMemo(
    () => (stock ? generateHistory(stock, range) : []),
    [stock, range],
  );

  if (!stock) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-5">
        <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#0c1220] p-8 text-center">
          <Info size={32} className="mx-auto text-slate-500" />
          <h1 className="mt-4 text-2xl font-bold text-white">
            Stock not found
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            This symbol isn't available in the current sample dataset.
          </p>
          <Link
            to="/markets"
            className="mt-6 inline-flex rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
          >
            Back to markets
          </Link>
        </div>
      </main>
    );
  }

  const positive = Number(stock.change) >= 0;
  const numericQuantity = Number(quantity);
  const validQuantity =
    Number.isSafeInteger(numericQuantity) && numericQuantity > 0;

  const orderValue =
    stock.price *
    (Number.isFinite(numericQuantity) && numericQuantity > 0
      ? numericQuantity
      : 0);

  function submitOrder(event) {
    event.preventDefault();
    setNotice("");

    if (!validQuantity) {
      setNoticeType("error");
      setNotice("Enter a valid whole-number quantity greater than zero.");
      return;
    }

    if (!user) {
      navigate("/login", { state: { from: location } });
      return;
    }

    const result = executeTrade({
      symbol: stock.symbol,
      name: stock.name,
      side: orderSide,
      quantity: numericQuantity,
      price: Number(stock.price),
    });

    if (!result) {
      setNoticeType("error");
      setNotice("The trade could not be completed. Please try again.");
      return;
    }

    setNoticeType(result.success === false ? "error" : "success");
    setNotice(
      result.message ||
        `${orderSide === "buy" ? "Buy" : "Sell"} order processed for ${numericQuantity} share${numericQuantity === 1 ? "" : "s"} of ${stock.symbol}.`,
    );
  }

  return (
    <div className="min-w-0 space-y-6 text-slate-100">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-5">
        <Link
          to="/markets"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-emerald-300"
        >
          <ArrowLeft size={17} />
          Back to markets
        </Link>

        <span className="rounded-lg border border-amber-400/20 bg-amber-400/10 px-3 py-1.5 text-xs font-bold tracking-wide text-amber-300">
          DEMO DATA
        </span>
      </header>

      <section className="rounded-2xl border border-slate-800/80 bg-[#0c1220] p-5 sm:p-7">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/15 bg-emerald-400/10 text-sm font-bold text-emerald-300">
                {stock.symbol.slice(0, 2)}
              </div>

              <div className="min-w-0">
                <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  {stock.symbol}
                </h1>
                <p className="mt-1 truncate text-sm text-slate-400">
                  {stock.name}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="text-3xl font-bold tracking-tight tabular-nums text-white sm:text-4xl">
                {formatINR(stock.price)}
              </span>

              <span
                className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm font-semibold ${
                  positive
                    ? "bg-emerald-400/10 text-emerald-300"
                    : "bg-red-400/10 text-red-300"
                }`}
              >
                {positive ? (
                  <ArrowUpRight size={16} />
                ) : (
                  <ArrowDownRight size={16} />
                )}
                {positive ? "+" : ""}
                {Number(stock.change || 0).toFixed(2)} (
                {positive ? "+" : ""}
                {Number(stock.changePercent || 0).toFixed(2)}%)
              </span>
            </div>

            <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
              <Clock3 size={13} />
              Illustrative price · Not a live exchange quote
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setWatchlisted((current) => !current)}
              aria-pressed={watchlisted}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-emerald-400/40 ${
                watchlisted
                  ? "border-amber-400/30 bg-amber-400/10 text-amber-300"
                  : "border-slate-700 bg-slate-900/50 text-slate-300 hover:border-slate-600 hover:bg-slate-800"
              }`}
            >
              <Star
                size={17}
                className={watchlisted ? "fill-amber-400" : ""}
              />
              {watchlisted ? "Watchlisted" : "Add to watchlist"}
            </button>

            <button
              type="button"
              onClick={() => {
                setOrderSide("buy");
                document
                  .getElementById("trade-ticket")
                  ?.scrollIntoView({ behavior: "smooth", block: "center" });
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
            >
              Trade stock
              <TrendingUp size={17} />
            </button>
          </div>
        </div>
      </section>

      <div className="grid min-w-0 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <section className="min-w-0 rounded-2xl border border-slate-800/80 bg-[#0c1220] p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-bold text-white">Price history</h2>
              <p className="mt-1 text-sm text-slate-400">
                {stock.symbol} · Sample price series
              </p>
            </div>

            <div className="flex flex-wrap gap-1 rounded-xl border border-slate-800 bg-[#080d17] p-1">
              {timeRanges.map((item) => (
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

          <div className="mt-6 h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={history}
                margin={{ top: 10, right: 5, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="stockPriceFill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#34d399" stopOpacity={0.24} />
                    <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  stroke="#1e293b"
                  strokeDasharray="4 4"
                  vertical={false}
                />

                <XAxis
                  dataKey="time"
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  minTickGap={28}
                />

                <YAxis
                  domain={["auto", "auto"]}
                  orientation="right"
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={75}
                  tickFormatter={(value) =>
                    `₹${Number(value).toLocaleString("en-IN")}`
                  }
                />

                <Tooltip
                  formatter={(value) => [
                    formatINR(Number(value)),
                    "Sample price",
                  ]}
                  contentStyle={{
                    backgroundColor: "#0c1220",
                    borderRadius: 12,
                    border: "1px solid #263244",
                    color: "#e2e8f0",
                    fontSize: 12,
                  }}
                  labelStyle={{ color: "#94a3b8" }}
                />

                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#34d399"
                  strokeWidth={2.5}
                  fill="url(#stockPriceFill)"
                  activeDot={{
                    r: 5,
                    fill: "#34d399",
                    stroke: "#0c1220",
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <p className="mt-3 text-xs leading-5 text-slate-500">
            This chart is generated from sample values for demonstration. It
            does not represent verified historical exchange prices.
          </p>
        </section>

        <section
          id="trade-ticket"
          className="min-w-0 rounded-2xl border border-slate-800/80 bg-[#0c1220] p-5 sm:p-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">
              Trade {stock.symbol}
            </h2>
            <Wallet size={19} className="text-slate-500" />
          </div>

          <p className="mt-1 text-sm text-slate-400">
            Paper trading order ticket
          </p>

          <div className="mt-5 grid grid-cols-2 gap-2 rounded-xl border border-slate-800 bg-[#080d17] p-1">
            <button
              type="button"
              onClick={() => {
                setOrderSide("buy");
                setNotice("");
              }}
              className={`rounded-lg py-2.5 text-sm font-semibold transition ${
                orderSide === "buy"
                  ? "bg-emerald-400 text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Buy
            </button>

            <button
              type="button"
              onClick={() => {
                setOrderSide("sell");
                setNotice("");
              }}
              className={`rounded-lg py-2.5 text-sm font-semibold transition ${
                orderSide === "sell"
                  ? "bg-red-400 text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Sell
            </button>
          </div>

          <form onSubmit={submitOrder} className="mt-5 space-y-5">
            <div>
              <label
                htmlFor="quantity"
                className="mb-2 block text-sm font-semibold text-slate-300"
              >
                Quantity (shares)
              </label>

              <input
                id="quantity"
                type="number"
                min="1"
                step="1"
                value={quantity}
                onChange={(event) => {
                  setQuantity(event.target.value);
                  setNotice("");
                }}
                required
                className="w-full rounded-xl border border-slate-700 bg-[#080d17] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/10"
              />
            </div>

            <div className="space-y-3 rounded-xl border border-slate-800/80 bg-[#080d17] p-4">
              <div className="flex justify-between gap-3 text-sm">
                <span className="text-slate-400">Price per share</span>
                <span className="font-semibold tabular-nums text-slate-200">
                  {formatINR(stock.price)}
                </span>
              </div>

              <div className="flex justify-between gap-3 text-sm">
                <span className="text-slate-400">Quantity</span>
                <span className="font-semibold tabular-nums text-slate-200">
                  {validQuantity ? numericQuantity : 0}
                </span>
              </div>

              <div className="border-t border-slate-800 pt-3">
                <div className="flex justify-between gap-3">
                  <span className="text-sm font-semibold text-slate-300">
                    Estimated total
                  </span>
                  <span className="text-base font-bold tabular-nums text-white">
                    {formatINR(validQuantity ? orderValue : 0)}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className={`w-full rounded-xl px-4 py-3.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0c1220] ${
                orderSide === "buy"
                  ? "bg-emerald-400 text-slate-950 hover:bg-emerald-300 focus:ring-emerald-400"
                  : "bg-red-400 text-slate-950 hover:bg-red-300 focus:ring-red-400"
              }`}
            >
              {orderSide === "buy" ? "Buy" : "Sell"} {stock.symbol}
            </button>
          </form>

          {notice && (
            <div
              role="status"
              aria-live="polite"
              className={`mt-4 rounded-xl border p-3 text-sm leading-6 ${
                noticeType === "error"
                  ? "border-red-400/20 bg-red-400/10 text-red-300"
                  : "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
              }`}
            >
              <div className="mb-1 flex items-center gap-2 font-semibold">
                {noticeType === "error" ? (
                  <Info size={16} />
                ) : (
                  <Check size={16} />
                )}
                {noticeType === "error"
                  ? "Trade not completed"
                  : "Trade result"}
              </div>

              {notice}

              {noticeType === "success" && (
                <Link
                  to="/dashboard"
                  className="mt-2 block font-semibold underline underline-offset-2 hover:text-white"
                >
                  View dashboard
                </Link>
              )}
            </div>
          )}

          <div className="mt-5 flex items-start gap-2 rounded-xl border border-amber-400/20 bg-amber-400/5 p-3">
            <Info size={15} className="mt-0.5 shrink-0 text-amber-300" />
            <p className="text-xs leading-5 text-amber-200/90">
              Educational paper trading only. Successful orders update the
              local demo portfolio; no real orders or payments are made.
            </p>
          </div>
        </section>
      </div>

      <section>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-white">Key statistics</h2>
          <p className="mt-1 text-sm text-slate-400">
            Sample metrics from the current seed dataset
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
          <StatCard
            label="Previous close"
            value={
              stock.previousClose != null
                ? formatINR(stock.previousClose)
                : "—"
            }
          />
          <StatCard
            label="Open"
            value={stock.open != null ? formatINR(stock.open) : "—"}
          />
          <StatCard
            label="Day high"
            value={stock.high != null ? formatINR(stock.high) : "—"}
          />
          <StatCard
            label="Day low"
            value={stock.low != null ? formatINR(stock.low) : "—"}
          />
          <StatCard
            label="Volume"
            value={
              stock.volume != null
                ? Number(stock.volume).toLocaleString("en-IN")
                : "—"
            }
          />
          <StatCard label="Sector" value={stock.sector || "—"} />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800/80 bg-[#0c1220] p-5 sm:p-6">
        <h2 className="text-lg font-bold text-white">About {stock.name}</h2>

        <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-400">
          {stock.description ||
            `${stock.name} is part of the ${stock.sector || "Indian equity"} market universe in this demonstration application. Company information and market values should be verified against a reliable source before being treated as factual.`}
        </p>

        <div className="mt-5 flex items-center gap-2 text-xs text-slate-500">
          <Info size={14} />
          Company and price data are for educational demonstration only.
        </div>
      </section>

      <div className="pb-5 text-center text-xs text-slate-500">
        Throttle Trade · Paper trading simulation · No real orders are placed
      </div>
    </div>
  );
}
