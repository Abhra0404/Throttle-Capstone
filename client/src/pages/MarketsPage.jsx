
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowUp,
  ArrowUpRight,
  ChevronDown,
  Search,
  SlidersHorizontal,
  Star,
  TrendingUp,
  X,
} from "lucide-react";
import { stocks, marketIndices } from "../data/mockData";

const categories = ["All stocks", "Gainers", "Losers"];

function formatINR(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
}

export default function MarketsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All stocks");
  const [sortBy, setSortBy] = useState("symbol");
  const [sortDirection, setSortDirection] = useState("asc");
  const [watchlist, setWatchlist] = useState(["RELIANCE", "TCS"]);
  const [showWatchlistOnly, setShowWatchlistOnly] = useState(false);

  const filteredStocks = useMemo(() => {
    let result = [...stocks];
    const query = search.trim().toLowerCase();

    if (query) {
      result = result.filter(
        (stock) =>
          stock.symbol.toLowerCase().includes(query) ||
          stock.name.toLowerCase().includes(query) ||
          (stock.sector || "").toLowerCase().includes(query)
      );
    }

    if (category === "Gainers") {
      result = result.filter((stock) => stock.change >= 0);
    }

    if (category === "Losers") {
      result = result.filter((stock) => stock.change < 0);
    }

    if (showWatchlistOnly) {
      result = result.filter((stock) => watchlist.includes(stock.symbol));
    }

    result.sort((a, b) => {
      let comparison = 0;

      if (sortBy === "symbol") {
        comparison = a.symbol.localeCompare(b.symbol);
      } else if (sortBy === "price") {
        comparison = a.price - b.price;
      } else if (sortBy === "change") {
        comparison =
          (a.changePercent ?? 0) - (b.changePercent ?? 0);
      } else if (sortBy === "volume") {
        comparison = (a.volume || 0) - (b.volume || 0);
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

    return result;
  }, [
    search,
    category,
    sortBy,
    sortDirection,
    watchlist,
    showWatchlistOnly,
  ]);

  function toggleWatchlist(symbol) {
    setWatchlist((current) =>
      current.includes(symbol)
        ? current.filter((item) => item !== symbol)
        : [...current, symbol]
    );
  }

  function handleSort(field) {
    if (sortBy === field) {
      setSortDirection((current) =>
        current === "asc" ? "desc" : "asc"
      );
    } else {
      setSortBy(field);
      setSortDirection(field === "symbol" ? "asc" : "desc");
    }
  }

  function sortIcon(field) {
    if (sortBy !== field) {
      return <ChevronDown size={13} className="text-slate-600" />;
    }

    return sortDirection === "asc" ? (
      <ArrowUp size={13} className="text-emerald-400" />
    ) : (
      <ArrowDown size={13} className="text-emerald-400" />
    );
  }

  const cardClass =
    "rounded-2xl border border-slate-800/80 bg-[#0c1220]";

  return (
    <div className="min-w-0 space-y-8">
      {/* Page heading */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-400">
            Trading terminal
          </p>

          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Markets<span className="text-emerald-400">.</span>
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
            Explore Indian equities, compare market movements, and find
            stocks for your paper-trading portfolio.
          </p>
        </div>

        <Link
          to="/dashboard"
          className="inline-flex w-fit items-center justify-center rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-emerald-400/40 hover:bg-slate-800 hover:text-white"
        >
          Back to overview
        </Link>
      </section>

      {/* Sample data notice */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-400/20 bg-amber-400/5 px-4 py-3.5">
        <span className="mt-0.5 rounded-md border border-amber-400/20 bg-amber-400/10 px-2 py-1 text-[10px] font-bold tracking-wide text-amber-300">
          DEMO
        </span>

        <div>
          <p className="text-sm font-semibold text-amber-200">
            Sample market data
          </p>
          <p className="mt-1 text-xs leading-5 text-amber-100/60">
            Prices and movements are seeded demonstration data, not live
            NSE quotes. All trades use virtual funds.
          </p>
        </div>
      </div>

      {/* Market indices */}
      <section>
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white">
              Market overview
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Key Indian market indices
            </p>
          </div>

          <span className="text-xs text-slate-600">Sample values</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {marketIndices.map((index) => {
            const positive = Number(index.change) >= 0;

            return (
              <article
                key={index.symbol}
                className={`${cardClass} p-5 transition duration-200 hover:border-slate-700 hover:bg-[#0e1625]`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-400">
                      {index.name}
                    </p>

                    <p className="mt-3 text-2xl font-bold tracking-tight tabular-nums text-white">
                      {Number(index.value).toLocaleString("en-IN", {
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>

                  <div
                    className={`rounded-xl p-2.5 ${
                      positive
                        ? "bg-emerald-400/10 text-emerald-400"
                        : "bg-rose-400/10 text-rose-400"
                    }`}
                  >
                    {positive ? (
                      <TrendingUp size={20} />
                    ) : (
                      <ArrowDownRight size={20} />
                    )}
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-2">
                  <span
                    className={`text-sm font-semibold tabular-nums ${
                      positive ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {positive ? "+" : ""}
                    {Number(index.change).toFixed(2)}
                  </span>

                  <span
                    className={`rounded-md px-2 py-1 text-xs font-semibold tabular-nums ${
                      positive
                        ? "bg-emerald-400/10 text-emerald-400"
                        : "bg-rose-400/10 text-rose-400"
                    }`}
                  >
                    {positive ? "+" : ""}
                    {Number(index.changePercent).toFixed(2)}%
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Stock explorer */}
      <section className={`${cardClass} min-w-0 overflow-hidden`}>
        <div className="border-b border-slate-800/80 p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-lg font-bold text-white">
                Explore stocks
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {filteredStocks.length} stocks found
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setShowWatchlistOnly((current) => !current)
              }
              aria-pressed={showWatchlistOnly}
              className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                showWatchlistOnly
                  ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                  : "border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Star
                size={16}
                className={showWatchlistOnly ? "fill-emerald-400" : ""}
              />
              {showWatchlistOnly ? "Showing watchlist" : "My watchlist"}
            </button>
          </div>

          {/* Search and filters */}
          <div className="mt-5 flex flex-col gap-3 lg:flex-row">
            <div className="relative min-w-0 flex-1">
              <Search
                size={18}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search company, symbol, or sector..."
                aria-label="Search stocks"
                className="w-full rounded-xl border border-slate-800 bg-[#080d17] py-3 pl-10 pr-10 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50 focus:ring-4 focus:ring-emerald-400/5"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 transition hover:text-white"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
              <SlidersHorizontal
                size={17}
                className="shrink-0 text-slate-500"
              />

              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  aria-pressed={category === item}
                  className={`shrink-0 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    category === item
                      ? "bg-emerald-400 text-slate-950"
                      : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stocks table */}
        {filteredStocks.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead className="border-b border-slate-800/80 bg-slate-900/50">
                <tr>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Stock
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <button
                      type="button"
                      onClick={() => handleSort("price")}
                      className="ml-auto flex items-center gap-1 transition hover:text-white"
                    >
                      Price {sortIcon("price")}
                    </button>
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <button
                      type="button"
                      onClick={() => handleSort("change")}
                      className="ml-auto flex items-center gap-1 transition hover:text-white"
                    >
                      Change {sortIcon("change")}
                    </button>
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <button
                      type="button"
                      onClick={() => handleSort("volume")}
                      className="ml-auto flex items-center gap-1 transition hover:text-white"
                    >
                      Volume {sortIcon("volume")}
                    </button>
                  </th>

                  <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Watchlist
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800/60">
                {filteredStocks.map((stock) => {
                  const positive = Number(stock.change) >= 0;
                  const watched = watchlist.includes(stock.symbol);

                  return (
                    <tr
                      key={stock.symbol}
                      className="transition hover:bg-slate-900/60"
                    >
                      <td className="px-5 py-4">
                        <Link
                          to={`/markets/${stock.symbol}`}
                          className="group flex items-center gap-3"
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-700/70 bg-slate-800/80 text-xs font-bold text-slate-300 transition group-hover:border-emerald-400/30 group-hover:bg-emerald-400/10 group-hover:text-emerald-300">
                            {stock.symbol.slice(0, 2)}
                          </div>

                          <div className="min-w-0">
                            <p className="font-semibold text-slate-200 transition group-hover:text-emerald-300">
                              {stock.symbol}
                            </p>
                            <p className="mt-1 max-w-56 truncate text-xs text-slate-500">
                              {stock.name}
                            </p>
                          </div>
                        </Link>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <span className="font-semibold tabular-nums text-slate-200">
                          {formatINR(stock.price)}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <div
                          className={`inline-flex items-center gap-1 font-semibold tabular-nums ${
                            positive ? "text-emerald-400" : "text-rose-400"
                          }`}
                        >
                          {positive ? (
                            <ArrowUpRight size={15} />
                          ) : (
                            <ArrowDownRight size={15} />
                          )}

                          {positive ? "+" : ""}
                          {Number(stock.changePercent).toFixed(2)}%
                        </div>

                        <p
                          className={`mt-1 text-xs tabular-nums ${
                            positive ? "text-emerald-400/70" : "text-rose-400/70"
                          }`}
                        >
                          {positive ? "+" : ""}
                          {Number(stock.change).toFixed(2)}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-right text-sm tabular-nums text-slate-400">
                        {stock.volume
                          ? Number(stock.volume).toLocaleString("en-IN")
                          : "—"}
                      </td>

                      <td className="px-5 py-4 text-center">
                        <button
                          type="button"
                          onClick={() => toggleWatchlist(stock.symbol)}
                          aria-label={
                            watched
                              ? `Remove ${stock.symbol} from watchlist`
                              : `Add ${stock.symbol} to watchlist`
                          }
                          aria-pressed={watched}
                          className={`rounded-lg p-2 transition focus:outline-none focus:ring-2 focus:ring-amber-400/40 ${
                            watched
                              ? "text-amber-400 hover:bg-amber-400/10"
                              : "text-slate-600 hover:bg-slate-800 hover:text-amber-400"
                          }`}
                        >
                          <Star
                            size={18}
                            className={watched ? "fill-amber-400" : ""}
                          />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-slate-500">
              <Search size={22} />
            </div>

            <h3 className="mt-4 font-semibold text-white">
              No stocks found
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
              Try another search or change the selected market filter.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategory("All stocks");
                setShowWatchlistOnly(false);
              }}
              className="mt-4 text-sm font-semibold text-emerald-400 transition hover:text-emerald-300"
            >
              Clear all filters
            </button>
          </div>
        )}

        <div className="border-t border-slate-800/80 bg-slate-900/30 px-5 py-4">
          <p className="text-xs leading-5 text-slate-500">
            Sample data for educational and demonstration purposes only.
            Prices are not live exchange quotes or investment advice.
          </p>
        </div>
      </section>
    </div>
  );
}
