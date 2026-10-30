
import { useState } from "react";
import { ArrowDownLeft, ArrowUpRight, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { stocks } from "../data/mockData";
import { usePortfolio } from "../context/PortfolioContext";

const formatINR = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);

export default function TradePage() {
  const [symbol, setSymbol] = useState(stocks[0]?.symbol || "RELIANCE");
  const [side, setSide] = useState("buy");
  const [quantity, setQuantity] = useState("1");
  const [message, setMessage] = useState(null);

  const { cash, executeTrade } = usePortfolio();
  const stock = stocks.find((item) => item.symbol === symbol) || stocks[0];
  const price = Number(stock?.price || 0);
  const qty = Number(quantity);
  const total = price * qty;
  const validOrder =
    Boolean(stock) &&
    Number.isInteger(qty) &&
    qty > 0 &&
    Number.isFinite(price) &&
    price > 0;

  function handleSubmit(event) {
    event.preventDefault();
    setMessage(null);

    if (!validOrder) {
      setMessage({ success: false, text: "Enter a valid quantity." });
      return;
    }

    const result = executeTrade({
      symbol: stock.symbol,
      name: stock.name,
      side,
      quantity: qty,
      price,
    });

    setMessage({
      success: result.success,
      text: result.message,
    });

    if (result.success) {
      setQuantity("1");
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 text-slate-100">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
          Paper trading
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Buy / Sell
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Place simulated orders using sample market prices. No real money or
          exchange orders are involved.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-slate-800 bg-slate-950/70 p-5 sm:p-7"
        >
          <div>
            <label className="mb-2 block text-sm text-slate-400">
              Select stock
            </label>
            <select
              value={symbol}
              onChange={(event) => {
                setSymbol(event.target.value);
                setMessage(null);
              }}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-emerald-400"
            >
              {stocks.map((item) => (
                <option key={item.symbol} value={item.symbol}>
                  {item.symbol} — {item.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setSide("buy");
                setMessage(null);
              }}
              className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 font-medium transition ${
                side === "buy"
                  ? "border-emerald-400 bg-emerald-400/10 text-emerald-300"
                  : "border-slate-700 text-slate-400 hover:bg-slate-900"
              }`}
            >
              <ArrowDownLeft size={18} />
              Buy
            </button>

            <button
              type="button"
              onClick={() => {
                setSide("sell");
                setMessage(null);
              }}
              className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 font-medium transition ${
                side === "sell"
                  ? "border-rose-400 bg-rose-400/10 text-rose-300"
                  : "border-slate-700 text-slate-400 hover:bg-slate-900"
              }`}
            >
              <ArrowUpRight size={18} />
              Sell
            </button>
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-400">
              Quantity (shares)
            </label>
            <input
              type="number"
              min="1"
              step="1"
              value={quantity}
              onChange={(event) => {
                setQuantity(event.target.value);
                setMessage(null);
              }}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 outline-none focus:border-emerald-400"
            />
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
            <div className="flex justify-between gap-4 text-sm">
              <span className="text-slate-400">Sample price</span>
              <span>{formatINR(price)}</span>
            </div>
            <div className="mt-3 flex justify-between gap-4 text-sm">
              <span className="text-slate-400">Quantity</span>
              <span>{validOrder ? qty.toLocaleString("en-IN") : "—"}</span>
            </div>
            <div className="my-4 border-t border-slate-800" />
            <div className="flex justify-between gap-4">
              <span className="font-medium">Estimated order value</span>
              <span className="text-lg font-semibold">{formatINR(validOrder ? total : 0)}</span>
            </div>
          </div>

          {message && (
            <p
              role="status"
              className={`rounded-xl border p-3 text-sm ${
                message.success
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                  : "border-rose-500/30 bg-rose-500/10 text-rose-300"
              }`}
            >
              {message.text}
            </p>
          )}

          <button
            type="submit"
            className={`w-full rounded-xl px-4 py-3 font-semibold transition ${
              side === "buy"
                ? "bg-emerald-400 text-slate-950 hover:bg-emerald-300"
                : "bg-rose-400 text-slate-950 hover:bg-rose-300"
            }`}
          >
            Place paper {side} order
          </button>

          <p className="flex items-start gap-2 text-xs leading-5 text-slate-500">
            <ShieldCheck size={15} className="mt-0.5 shrink-0" />
            This is an educational simulation using sample data, not a real
            brokerage service.
          </p>
        </form>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
            <p className="text-sm text-slate-400">Available virtual cash</p>
            <p className="mt-2 text-2xl font-semibold">{formatINR(cash)}</p>
            <p className="mt-2 text-xs text-slate-500">
              Updated from your paper account.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
            <p className="text-sm font-medium">Selected stock</p>
            <h2 className="mt-3 text-xl font-semibold">
              {stock?.name || "Select a stock"}
            </h2>
            <p className="mt-1 text-sm text-slate-400">{stock?.symbol}</p>
            <p className="mt-5 text-2xl font-semibold">{formatINR(price)}</p>
            <Link
              to={`/markets/${stock?.symbol}`}
              className="mt-5 inline-flex text-sm font-medium text-emerald-300 hover:text-emerald-200"
            >
              View stock details →
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
