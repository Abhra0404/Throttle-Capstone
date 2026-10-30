
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Star, StarOff, ArrowUpRight } from "lucide-react";
import { stocks } from "../data/mockData";

const STORAGE_KEY = "throttle-watchlist-v1";

const formatINR = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

export default function WatchlistPage() {
  const [symbols, setSymbols] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");

      if (Array.isArray(saved)) {
        setSymbols(saved.filter((symbol) =>
          stocks.some((stock) => stock.symbol === symbol)
        ));
      } else {
        setSymbols(stocks.slice(0, 5).map((stock) => stock.symbol));
      }
    } catch {
      setSymbols(stocks.slice(0, 5).map((stock) => stock.symbol));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(symbols));
  }, [symbols]);

  const watchedStocks = useMemo(
    () => stocks.filter((stock) => symbols.includes(stock.symbol)),
    [symbols]
  );

  const availableStocks = useMemo(() => {
    const query = search.trim().toLowerCase();

    return stocks.filter((stock) => {
      const matchesSearch =
        stock.symbol.toLowerCase().includes(query) ||
        stock.name.toLowerCase().includes(query);

      return matchesSearch && !symbols.includes(stock.symbol);
    });
  }, [search, symbols]);

  function addStock(symbol) {
    setSymbols((current) =>
      current.includes(symbol) ? current : [...current, symbol]
    );
  }

  function removeStock(symbol) {
    setSymbols((current) => current.filter((item) => item !== symbol));
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 text-slate-100">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
          Market tracking
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Watchlist</h1>
        <p className="mt-2 text-sm text-slate-400">
          Keep your preferred stocks together and access them quickly.
        </p>
      </header>

      <section className="rounded-2xl border border-slate-800 bg-slate-950/70">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 p-5">
          <div>
            <h2 className="font-semibold">Tracked stocks</h2>
            <p className="mt-1 text-sm text-slate-400">
              {watchedStocks.length} stocks in your watchlist
            </p>
          </div>
          <Link
            to="/markets"
            className="rounded-lg border border-slate-700 px-3 py-2 text-sm hover:bg-slate-900"
          >
            Browse markets
          </Link>
        </div>

        {watchedStocks.length === 0 ? (
          <div className="p-10 text-center">
            <Star className="mx-auto text-slate-500" size={28} />
            <p className="mt-3 font-medium">Your watchlist is empty</p>
            <p className="mt-1 text-sm text-slate-400">
              Add a stock below to keep it close at hand.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {watchedStocks.map((stock) => {
              const price = Number(stock.price) || 0;
              const change = Number(stock.changePercent) || 0;
              const positive = change >= 0;

              return (
                <div
                  key={stock.symbol}
                  className="flex flex-wrap items-center justify-between gap-4 p-5 transition hover:bg-slate-900/50"
                >
                  <Link
                    to={`/markets/${stock.symbol}`}
                    className="min-w-0 flex-1"
                  >
                    <p className="font-semibold hover:text-emerald-300">
                      {stock.symbol}
                    </p>
                    <p className="mt-1 truncate text-sm text-slate-400">
                      {stock.name}
                    </p>
                  </Link>

                  <div className="text-right">
                    <p className="font-medium">{formatINR(price)}</p>
                    <p
                      className={`mt-1 text-xs ${
                        positive ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {positive ? "+" : ""}
                      {change.toFixed(2)}%
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/trade`}
                      className="rounded-lg bg-emerald-400 px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-300"
                    >
                      Trade
                    </Link>
                    <button
                      type="button"
                      onClick={() => removeStock(stock.symbol)}
                      aria-label={`Remove ${stock.symbol} from watchlist`}
                      title="Remove from watchlist"
                      className="rounded-lg border border-slate-700 p-2 text-slate-400 hover:border-rose-500/50 hover:text-rose-300"
                    >
                      <StarOff size={17} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
        <div className="mb-4">
          <h2 className="font-semibold">Discover stocks</h2>
          <p className="mt-1 text-sm text-slate-400">
            Add more stocks to your watchlist.
          </p>
        </div>

        <div className="relative mb-4">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by company or symbol..."
            className="w-full rounded-xl border border-slate-700 bg-slate-900 py-3 pl-10 pr-4 text-sm outline-none focus:border-emerald-400"
          />
        </div>

        {availableStocks.length === 0 ? (
          <p className="py-5 text-sm text-slate-400">
            No matching stocks available to add.
          </p>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {availableStocks.map((stock) => (
              <div
                key={stock.symbol}
                className="flex items-center justify-between gap-3 py-4"
              >
                <Link to={`/markets/${stock.symbol}`} className="min-w-0">
                  <p className="font-medium hover:text-emerald-300">
                    {stock.symbol}
                  </p>
                  <p className="truncate text-sm text-slate-400">
                    {stock.name}
                  </p>
                </Link>

                <div className="flex items-center gap-3">
                  <span className="text-sm">{formatINR(stock.price)}</span>
                  <button
                    type="button"
                    onClick={() => addStock(stock.symbol)}
                    className="rounded-lg border border-slate-700 p-2 text-emerald-300 hover:bg-emerald-400/10"
                    aria-label={`Add ${stock.symbol} to watchlist`}
                  >
                    <Star size={17} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <p className="flex items-center gap-2 text-xs text-slate-500">
        <ArrowUpRight size={14} />
        Prices and changes are sample data for an educational paper-trading simulation.
      </p>
    </div>
  );
}
