import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDownRight,
  ArrowUpRight,
  ChevronDown,
  Search,
  Star,
  TrendingUp,
  X,
} from "lucide-react";
import { marketIndices } from "../data/mockData";
import { useStocks } from "../hooks/useStocks";
import { usePortfolio } from "../context/PortfolioContext";
import { EmptyState, ErrorState, LoadingState } from "../components/ui/DataState";

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
  const [sector, setSector] = useState("");
  const [sortBy, setSortBy] = useState("symbol");
  const [sortDirection, setSortDirection] = useState("asc");
  const { watchlist, toggleWatchlist } = usePortfolio();
  const { stocks, loading, error, retry } = useStocks({ search, sector });

  const sectors = useMemo(
    () => [...new Set(stocks.map((stock) => stock.sector).filter(Boolean))].sort(),
    [stocks],
  );

  const filteredStocks = useMemo(() => {
    const result = stocks.filter((stock) => {
      if (category === "Gainers") return stock.change >= 0;
      if (category === "Losers") return stock.change < 0;
      return true;
    });

    return result.sort((a, b) => {
      const values = {
        symbol: String(a.symbol).localeCompare(String(b.symbol)),
        price: a.price - b.price,
        change: a.changePercent - b.changePercent,
        volume: a.volume - b.volume,
      };
      return sortDirection === "asc" ? values[sortBy] : -values[sortBy];
    });
  }, [stocks, category, sortBy, sortDirection]);

  function handleSort(field) {
    if (sortBy === field) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }
    setSortBy(field);
    setSortDirection(field === "symbol" ? "asc" : "desc");
  }

  function sortIcon(field) {
    return (
      <ChevronDown
        size={13}
        className={sortBy === field ? "text-emerald-400" : "text-slate-600"}
        style={{
          transform: sortBy === field && sortDirection === "asc" ? "rotate(180deg)" : undefined,
        }}
      />
    );
  }

  return (
    <div className="min-w-0 space-y-7">
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-400">
            Trading terminal
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
            Markets<span className="text-emerald-400">.</span>
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
            Search, compare, and trade the stocks available in the seeded market catalogue.
          </p>
        </div>
        <Link
          to="/trade"
          className="inline-flex w-fit items-center gap-2 rounded-xl bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
        >
          Trade a stock
          <ArrowUpRight size={16} />
        </Link>
      </header>

      <div className="flex items-start gap-3 rounded-xl border border-amber-400/20 bg-amber-400/5 px-4 py-3.5">
        <span className="rounded-md border border-amber-400/20 bg-amber-400/10 px-2 py-1 text-[10px] font-bold tracking-wide text-amber-300">
          DEMO DATA
        </span>
        <p className="text-xs leading-5 text-amber-100/70">
          Prices are seeded backend data, not live NSE quotes. Orders still execute against the server catalogue.
        </p>
      </div>

      <section>
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white">Market overview</h2>
            <p className="mt-1 text-sm text-slate-500">Illustrative Indian market indices</p>
          </div>
          <span className="text-xs text-slate-600">Seeded values</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {marketIndices.map((index) => {
            const positive = Number(index.change) >= 0;
            return (
              <article key={index.symbol} className="rounded-2xl border border-slate-800/80 bg-[#0c1220] p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-400">{index.name}</p>
                  {positive ? <TrendingUp size={18} className="text-emerald-400" /> : <ArrowDownRight size={18} className="text-rose-400" />}
                </div>
                <p className="mt-4 text-2xl font-bold tabular-nums text-white">
                  {Number(index.value).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                </p>
                <p className={`mt-2 text-sm font-semibold ${positive ? "text-emerald-400" : "text-rose-400"}`}>
                  {positive ? "+" : ""}{Number(index.change).toFixed(2)} ({positive ? "+" : ""}{Number(index.changePercent).toFixed(2)}%)
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-800/80 bg-[#0c1220]">
        <div className="border-b border-slate-800/80 p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-lg font-bold text-white">Explore stocks</h2>
              <p className="mt-1 text-sm text-slate-500">{loading ? "Loading catalogue..." : `${filteredStocks.length} stocks found`}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  aria-pressed={category === item}
                  className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${category === item ? "bg-emerald-400 text-slate-950" : "bg-slate-900 text-slate-400 hover:text-white"}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <div className="relative min-w-0 flex-1">
              <Search size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search company or symbol..."
                aria-label="Search stocks"
                className="w-full rounded-xl border border-slate-800 bg-[#080d17] py-3 pl-10 pr-10 text-sm text-white outline-none placeholder:text-slate-600 focus:border-emerald-400/50"
              />
              {search && (
                <button type="button" onClick={() => setSearch("")} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                  <X size={15} />
                </button>
              )}
            </div>
            <select
              value={sector}
              onChange={(event) => setSector(event.target.value)}
              aria-label="Filter by sector"
              className="rounded-xl border border-slate-800 bg-[#080d17] px-3 py-3 text-sm text-slate-300 outline-none focus:border-emerald-400/50"
            >
              <option value="">All sectors</option>
              {sectors.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>
        </div>

        {loading ? <LoadingState label="Loading market catalogue..." /> : error ? <ErrorState message={error} onRetry={retry} /> : filteredStocks.length === 0 ? (
          <EmptyState title="No stocks found" description="Try a different search, sector, or movement filter." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left">
              <thead className="border-b border-slate-800/80 bg-slate-900/40">
                <tr>
                  <th className="px-5 py-4 text-xs uppercase tracking-wide text-slate-500">Stock</th>
                  {[
                    ["price", "Price"],
                    ["change", "Change"],
                    ["volume", "Volume"],
                  ].map(([field, label]) => (
                    <th key={field} className="px-5 py-4 text-right text-xs uppercase tracking-wide text-slate-500">
                      <button type="button" onClick={() => handleSort(field)} className="ml-auto flex items-center gap-1 hover:text-white">
                        {label}{sortIcon(field)}
                      </button>
                    </th>
                  ))}
                  <th className="px-5 py-4 text-center text-xs uppercase tracking-wide text-slate-500">Watch</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredStocks.map((stock) => {
                  const positive = stock.change >= 0;
                  const watched = watchlist.includes(stock.symbol);
                  return (
                    <tr key={stock.symbol} className="transition hover:bg-slate-900/60">
                      <td className="px-5 py-4">
                        <Link to={`/markets/${stock.symbol}`} className="flex items-center gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-xs font-bold text-slate-300">{stock.symbol.slice(0, 2)}</span>
                          <span>
                            <span className="block font-semibold text-slate-200 hover:text-emerald-300">{stock.symbol}</span>
                            <span className="mt-1 block max-w-56 truncate text-xs text-slate-500">{stock.name}</span>
                            <span className="mt-1 block text-[11px] text-slate-600">{stock.sector || "Unclassified"}</span>
                          </span>
                        </Link>
                      </td>
                      <td className="px-5 py-4 text-right font-semibold tabular-nums text-slate-200">{formatINR(stock.price)}</td>
                      <td className={`px-5 py-4 text-right font-semibold tabular-nums ${positive ? "text-emerald-400" : "text-rose-400"}`}>
                        <span className="inline-flex items-center gap-1">{positive ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}{positive ? "+" : ""}{stock.change.toFixed(2)} ({positive ? "+" : ""}{stock.changePercent.toFixed(2)}%)</span>
                      </td>
                      <td className="px-5 py-4 text-right tabular-nums text-slate-400">{stock.volume ? stock.volume.toLocaleString("en-IN") : "—"}</td>
                      <td className="px-5 py-4 text-center">
                        <button type="button" onClick={() => toggleWatchlist(stock.symbol)} aria-label={`${watched ? "Remove" : "Add"} ${stock.symbol} ${watched ? "from" : "to"} watchlist`} className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-800 hover:text-amber-300">
                          <Star size={17} className={watched ? "fill-amber-400 text-amber-400" : ""} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
