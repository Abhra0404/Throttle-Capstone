
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  Check,
  ChevronDown,
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

const timeRanges = ["1D", "1W", "1M", "3M", "6M", "1Y"];

function formatINR(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
}

function generateHistory(stock, range) {
  const pointCount = range === "1D" ? 24 : range === "1W" ? 28 : 30;
  const volatility = Math.max(stock.price * 0.012, 1);
  const seed = stock.symbol
    .split("")
    .reduce((total, character) => total + character.charCodeAt(0), 0);

  let current = stock.price * (1 - stock.changePercent / 100);

  return Array.from({ length: pointCount }, (_, index) => {
    const wave = Math.sin((index + seed) * 0.72) * volatility * 0.35;
    const drift =
      (stock.price - stock.price * (1 - stock.changePercent / 100)) *
      (index / Math.max(pointCount - 1, 1));

    current =
      stock.price * (1 - stock.changePercent / 100) +
      drift +
      wave +
      Math.sin((index + seed) * 1.8) * volatility * 0.18;

    return {
      time:
        range === "1D"
          ? `${String(Math.floor((index / pointCount) * 6) + 9).padStart(2, "0")}:${String((index * 7) % 60).padStart(2, "0")}`
          : range === "1W"
            ? `Day ${index + 1}`
            : `${index + 1}`,
      price: Number(current.toFixed(2)),
    };
  });
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-4">
      <p className="text-xs font-medium text-stone-500">{label}</p>
      <p className="mt-2 text-base font-bold tabular-nums text-stone-900">
        {value ?? "—"}
      </p>
    </div>
  );
}

export default function StockDetailPage() {
  const { symbol } = useParams();
  const stock = stocks.find(
    (item) => item.symbol.toLowerCase() === symbol?.toLowerCase()
  );

  const [range, setRange] = useState("1M");
  const [orderSide, setOrderSide] = useState("buy");
  const [quantity, setQuantity] = useState("1");
  const [watchlisted, setWatchlisted] = useState(false);
  const [notice, setNotice] = useState("");

  const history = useMemo(
    () => (stock ? generateHistory(stock, range) : []),
    [stock, range]
  );

  if (!stock) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-stone-50 px-5">
        <div className="max-w-md rounded-2xl border border-stone-200 bg-white p-8 text-center">
          <Info size={32} className="mx-auto text-stone-400" />
          <h1 className="mt-4 text-2xl font-bold text-stone-900">
            Stock not found
          </h1>
          <p className="mt-2 text-sm leading-6 text-stone-500">
            This symbol isn't available in the current sample dataset.
          </p>
          <Link
            to="/markets"
            className="mt-6 inline-flex rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Back to markets
          </Link>
        </div>
      </main>
    );
  }

  const positive = stock.change >= 0;
  const numericQuantity = Number(quantity);
  const orderValue = stock.price * (Number.isFinite(numericQuantity) ? numericQuantity : 0);

  function submitOrder(event) {
    event.preventDefault();
    setNotice("");

    if (!Number.isInteger(numericQuantity) || numericQuantity <= 0) {
      setNotice("Enter a valid whole-number quantity.");
      return;
    }

    setNotice(
      `${orderSide === "buy" ? "Buy" : "Sell"} preview: ${numericQuantity} share${numericQuantity > 1 ? "s" : ""} of ${stock.symbol} for ${formatINR(orderValue)}. No real order has been placed.`
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8f7] text-stone-900">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link
            to="/markets"
            className="inline-flex items-center gap-2 text-sm font-semibold text-stone-500 hover:text-emerald-700"
          >
            <ArrowLeft size={17} />
            Back to markets
          </Link>

          <span className="rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-800">
            DEMO DATA
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-5 py-7 sm:px-8">
        {/* Stock heading */}
        <section className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-7">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-sm font-bold text-emerald-800">
                  {stock.symbol.slice(0, 2)}
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    {stock.symbol}
                  </h1>
                  <p className="mt-1 text-sm text-stone-500">{stock.name}</p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="text-3xl font-bold tracking-tight tabular-nums sm:text-4xl">
                  {formatINR(stock.price)}
                </span>

                <span
                  className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm font-semibold ${
                    positive
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {positive ? (
                    <ArrowUpRight size={16} />
                  ) : (
                    <ArrowDownRight size={16} />
                  )}
                  {positive ? "+" : ""}
                  {Number(stock.change).toFixed(2)} (
                  {positive ? "+" : ""}
                  {Number(stock.changePercent).toFixed(2)}%)
                </span>
              </div>

              <p className="mt-3 flex items-center gap-1.5 text-xs text-stone-400">
                <Clock3 size={13} />
                Illustrative price · Not a live exchange quote
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setWatchlisted((current) => !current)}
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                  watchlisted
                    ? "border-amber-300 bg-amber-50 text-amber-800"
                    : "border-stone-200 text-stone-700 hover:bg-stone-50"
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
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Trade stock
                <TrendingUp size={17} />
              </button>
            </div>
          </div>
        </section>

        {/* Chart and trade ticket */}
        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <section className="min-w-0 rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-lg font-bold">Price history</h2>
                <p className="mt-1 text-sm text-stone-500">
                  {stock.symbol} · Sample price series
                </p>
              </div>

              <div className="flex flex-wrap gap-1 rounded-xl bg-stone-100 p-1">
                {timeRanges.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setRange(item)}
                    className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                      range === item
                        ? "bg-white text-emerald-700 shadow-sm"
                        : "text-stone-500 hover:text-stone-900"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-7 h-72 w-full sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="stockPriceFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#059669" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#059669" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    stroke="#e7e5e4"
                    strokeDasharray="4 4"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="time"
                    tick={{ fill: "#a8a29e", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    minTickGap={28}
                  />

                  <YAxis
                    domain={["auto", "auto"]}
                    orientation="right"
                    tick={{ fill: "#a8a29e", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    width={65}
                    tickFormatter={(value) => `₹${Number(value).toLocaleString("en-IN")}`}
                  />

                  <Tooltip
                    formatter={(value) => [formatINR(Number(value)), "Sample price"]}
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid #e7e5e4",
                      fontSize: 12,
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke="#059669"
                    strokeWidth={2.5}
                    fill="url(#stockPriceFill)"
                    activeDot={{ r: 5, fill: "#059669", stroke: "#ffffff", strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <p className="mt-3 text-xs leading-5 text-stone-400">
              The chart is generated from seeded sample values for demonstration.
              It does not represent verified historical exchange prices.
            </p>
          </section>

          {/* Paper trading ticket */}
          <section
            id="trade-ticket"
            className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Trade {stock.symbol}</h2>
              <Wallet size={19} className="text-stone-400" />
            </div>

            <p className="mt-1 text-sm text-stone-500">
              Paper trading order preview
            </p>

            <div className="mt-5 grid grid-cols-2 gap-2 rounded-xl bg-stone-100 p-1">
              <button
                type="button"
                onClick={() => {
                  setOrderSide("buy");
                  setNotice("");
                }}
                className={`rounded-lg py-2.5 text-sm font-semibold transition ${
                  orderSide === "buy"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-stone-600 hover:text-stone-900"
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
                    ? "bg-red-600 text-white shadow-sm"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                Sell
              </button>
            </div>

            <form onSubmit={submitOrder} className="mt-5 space-y-5">
              <div>
                <label
                  htmlFor="quantity"
                  className="mb-2 block text-sm font-semibold text-stone-700"
                >
                  Quantity (shares)
                </label>

                <input
                  id="quantity"
                  type="number"
                  min="1"
                  step="1"
                  value={quantity}
                  onChange={(event) => setQuantity(event.target.value)}
                  required
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>

              <div className="space-y-3 rounded-xl bg-stone-50 p-4">
                <div className="flex justify-between gap-3 text-sm">
                  <span className="text-stone-500">Price per share</span>
                  <span className="font-semibold tabular-nums">
                    {formatINR(stock.price)}
                  </span>
                </div>

                <div className="flex justify-between gap-3 text-sm">
                  <span className="text-stone-500">Quantity</span>
                  <span className="font-semibold tabular-nums">
                    {Number.isFinite(numericQuantity) && numericQuantity > 0
                      ? numericQuantity
                      : 0}
                  </span>
                </div>

                <div className="border-t border-stone-200 pt-3">
                  <div className="flex justify-between gap-3">
                    <span className="text-sm font-semibold text-stone-700">
                      Estimated total
                    </span>
                    <span className="text-base font-bold tabular-nums text-stone-900">
                      {formatINR(
                        Number.isFinite(numericQuantity) && numericQuantity > 0
                          ? orderValue
                          : 0
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className={`w-full rounded-xl px-4 py-3.5 text-sm font-semibold text-white transition ${
                  orderSide === "buy"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                Preview {orderSide === "buy" ? "buy" : "sell"} order
              </button>
            </form>

            {notice && (
              <div
                role="status"
                className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm leading-6 text-emerald-800"
              >
                <div className="mb-1 flex items-center gap-2 font-semibold">
                  <Check size={16} />
                  Order preview
                </div>
                {notice}
              </div>
            )}

            <div className="mt-5 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3">
              <Info size={15} className="mt-0.5 shrink-0 text-amber-700" />
              <p className="text-xs leading-5 text-amber-800">
                Preview only. This does not execute a trade, update holdings,
                or deduct virtual funds.
              </p>
            </div>
          </section>
        </div>

        {/* Statistics */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-bold">Key statistics</h2>
            <p className="mt-1 text-sm text-stone-500">
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

        {/* Company information */}
        <section className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
          <h2 className="text-lg font-bold">About {stock.name}</h2>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-stone-600">
            {stock.description ||
              `${stock.name} is part of the ${stock.sector || "Indian equity"} market universe in this demonstration application. Company information and market values should be verified against a reliable source before being treated as factual.`}
          </p>
          <div className="mt-5 flex items-center gap-2 text-xs text-stone-400">
            <Info size={14} />
            Company and price data are for educational demonstration only.
          </div>
        </section>

        <div className="pb-5 text-center text-xs text-stone-400">
          Throttle Trade · Paper trading simulation · No real orders are placed
        </div>
      </main>
    </div>
  );
}
