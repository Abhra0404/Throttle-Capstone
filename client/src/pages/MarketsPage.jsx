
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
  }).format(value);
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
        comparison = a.changePercent - b.changePercent;
      } else if (sortBy === "volume") {
        comparison = (a.volume || 0) - (b.volume || 0);
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

    return result;
  }, [search, category, sortBy, sortDirection, watchlist, showWatchlistOnly]);

  function toggleWatchlist(symbol) {
    setWatchlist((current) =>
      current.includes(symbol)
        ? current.filter((item) => item !== symbol)
        : [...current, symbol]
    );
  }

  function handleSort(field) {
    if (sortBy === field) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortDirection(field === "symbol" ? "asc" : "desc");
    }
  }

  const sortIcon = (field) => {
    if (sortBy !== field) {
      return <ChevronDown size={13} className="text-stone-400" />;
    }

    return sortDirection === "asc" ? (
      <ArrowUp size={13} className="text-emerald-600" />
    ) : (
      <ArrowDown size={13} className="text-emerald-600" />
    );
  };

  return (
    <div className="min-h-screen bg-[#f7f8f7] text-stone-900">
      {/* Page header */}
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <div>
            <Link
              to="/dashboard"
              className="text-sm font-semibold text-stone-500 transition hover:text-emerald-700"
            >
              ← Back to dashboard
            </Link>

            <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
              Markets
            </h1>

            <p className="mt-1 text-sm text-stone-500">
              Explore Indian equities and discover trading opportunities.
            </p>
          </div>

          <Link
            to="/dashboard"
            className="hidden rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 sm:inline-flex"
          >
            Open dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 px-5 py-8 sm:px-8">
        {/* Sample data notice */}
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <span className="mt-0.5 rounded-md bg-amber-100 px-2 py-1 text-[10px] font-bold tracking-wide text-amber-800">
            DEMO
          </span>

          <div>
            <p className="text-sm font-semibold text-amber-900">
              Sample market data
            </p>
            <p className="mt-1 text-xs leading-5 text-amber-800">
              Prices and movements are seeded demonstration data, not live NSE
              quotes. This platform uses virtual trading funds.
            </p>
          </div>
        </div>

        {/* Market indices */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">Market overview</h2>
              <p className="mt-1 text-sm text-stone-500">
                Key Indian market indices
              </p>
            </div>

            <span className="text-xs text-stone-400">Sample values</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {marketIndices.map((index) => {
              const positive = index.change >= 0;

              return (
                <article
                  key={index.symbol}
                  className="rounded-2xl border border-stone-200 bg-white p-5 transition hover:border-emerald-200 hover:shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-stone-500">
                        {index.name}
                      </p>
                      <p className="mt-2 text-2xl font-bold tracking-tight">
                        {Number(index.value).toLocaleString("en-IN", {
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>

                    <div
                      className={`rounded-xl p-2 ${
                        positive
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {positive ? (
                        <TrendingUp size={20} />
                      ) : (
                        <ArrowDownRight size={20} />
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <span
                      className={`text-sm font-semibold ${
                        positive ? "text-emerald-700" : "text-red-600"
                      }`}
                    >
                      {positive ? "+" : ""}
                      {Number(index.change).toFixed(2)}
                    </span>

                    <span
                      className={`rounded-md px-2 py-1 text-xs font-semibold ${
                        positive
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-red-50 text-red-700"
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

        {/* Stock list */}
        <section className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
          <div className="border-b border-stone-200 p-5 sm:p-6">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div>
                <h2 className="text-lg font-bold">Explore stocks</h2>
                <p className="mt-1 text-sm text-stone-500">
                  {filteredStocks.length} stocks found
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowWatchlistOnly((current) => !current)}
                className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                  showWatchlistOnly
                    ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                    : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
                }`}
              >
                <Star
                  size={16}
                  className={showWatchlistOnly ? "fill-emerald-600" : ""}
                />
                {showWatchlistOnly ? "Showing watchlist" : "My watchlist"}
              </button>
            </div>

            {/* Search and filters */}
            <div className="mt-5 flex flex-col gap-3 lg:flex-row">
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by company, symbol, or sector..."
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 py-3 pl-10 pr-10 text-sm outline-none transition placeholder:text-stone-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 overflow-x-auto">
                <SlidersHorizontal
                  size={17}
                  className="shrink-0 text-stone-400"
                />

                {categories.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item)}
                    className={`shrink-0 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                      category === item
                        ? "bg-stone-900 text-white"
                        : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          {filteredStocks.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left">
                <thead className="border-b border-stone-200 bg-stone-50">
                  <tr>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-stone-500">
                      Stock
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-stone-500">
                      <button
                        type="button"
                        onClick={() => handleSort("price")}
                        className="ml-auto flex items-center gap-1"
                      >
                        Price {sortIcon("price")}
                      </button>
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-stone-500">
                      <button
                        type="button"
                        onClick={() => handleSort("change")}
                        className="ml-auto flex items-center gap-1"
                      >
                        Change {sortIcon("change")}
                      </button>
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-stone-500">
                      <button
                        type="button"
                        onClick={() => handleSort("volume")}
                        className="ml-auto flex items-center gap-1"
                      >
                        Volume {sortIcon("volume")}
                      </button>
                    </th>

                    <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-stone-500">
                      Watchlist
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-stone-100">
                  {filteredStocks.map((stock) => {
                    const positive = stock.change >= 0;
                    const watched = watchlist.includes(stock.symbol);

                    return (
                      <tr
                        key={stock.symbol}
                        className="transition hover:bg-stone-50"
                      >
                        <td className="px-5 py-4">
                          <Link
                            to={`/markets/${stock.symbol}`}
                            className="group flex items-center gap-3"
                          >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-xs font-bold text-stone-700 transition group-hover:bg-emerald-50 group-hover:text-emerald-700">
                              {stock.symbol.slice(0, 2)}
                            </div>

                            <div>
                              <p className="font-semibold text-stone-900 group-hover:text-emerald-700">
                                {stock.symbol}
                              </p>
                              <p className="mt-1 max-w-56 truncate text-xs text-stone-500">
                                {stock.name}
                              </p>
                            </div>
                          </Link>
                        </td>

                        <td className="px-5 py-4 text-right">
                          <span className="font-semibold tabular-nums text-stone-900">
                            {formatINR(stock.price)}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-right">
                          <div
                            className={`inline-flex items-center gap-1 font-semibold tabular-nums ${
                              positive ? "text-emerald-700" : "text-red-600"
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
                              positive ? "text-emerald-700" : "text-red-600"
                            }`}
                          >
                            {positive ? "+" : ""}
                            {Number(stock.change).toFixed(2)}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-right text-sm tabular-nums text-stone-600">
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
                            className={`rounded-lg p-2 transition ${
                              watched
                                ? "text-amber-500 hover:bg-amber-50"
                                : "text-stone-300 hover:bg-stone-100 hover:text-amber-500"
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
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100 text-stone-500">
                <Search size={22} />
              </div>

              <h3 className="mt-4 font-semibold text-stone-900">
                No stocks found
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-stone-500">
                Try another search or change the selected market filter.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setCategory("All stocks");
                  setShowWatchlistOnly(false);
                }}
                className="mt-4 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
              >
                Clear all filters
              </button>
            </div>
          )}

          <div className="border-t border-stone-200 bg-stone-50 px-5 py-4">
            <p className="text-xs leading-5 text-stone-500">
              Sample data for educational and demonstration purposes only.
              Prices are not live exchange quotes or investment advice.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
