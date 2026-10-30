
import { useState } from "react";
import { Plus, Search, X } from "lucide-react";
import { stocks } from "../../data/mockData";

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

function Change({ value }) {
  const positive = Number(value) >= 0;

  return (
    <span
      className={`text-xs font-semibold tabular-nums ${
        positive ? "text-emerald-300" : "text-red-300"
      }`}
    >
      {positive ? "+" : ""}
      {Number(value || 0).toFixed(2)}%
    </span>
  );
}

export default function Watchlist({
  selectedSymbol,
  setSelectedSymbol,
}) {
  const [search, setSearch] = useState("");

  const filteredStocks = stocks.filter((stock) =>
    `${stock.symbol} ${stock.name}`
      .toLowerCase()
      .includes(search.toLowerCase().trim()),
  );

  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-800/80 bg-[#0c1220]">
      <div className="flex items-center justify-between gap-3 border-b border-slate-800/80 p-5">
        <div>
          <h2 className="text-lg font-bold text-white">Market watch</h2>
          <p className="mt-1 text-sm text-slate-400">
            Your tracked stocks
          </p>
        </div>

        <button
          type="button"
          aria-label="Focus stock search"
          title="Focus stock search"
          onClick={() => document.getElementById("market-watch-search")?.focus()}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-slate-900/60 text-slate-400 transition hover:border-emerald-400/30 hover:bg-emerald-400/10 hover:text-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
        >
          <Plus size={18} />
        </button>
      </div>

      <div className="p-4 pb-2">
        <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-[#080d17] px-3 py-2.5 transition focus-within:border-emerald-400/50 focus-within:ring-2 focus-within:ring-emerald-400/10">
          <Search size={16} className="shrink-0 text-slate-500" />

          <input
            id="market-watch-search"
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search stocks..."
            aria-label="Search stocks"
            className="min-w-0 flex-1 bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-600"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className="rounded p-1 text-slate-500 transition hover:text-white"
            >
              <X size={14} />
            </button>
          )}

          {!search && (
            <kbd className="hidden rounded border border-slate-700 px-1.5 py-0.5 text-[10px] text-slate-500 sm:inline">
              Search
            </kbd>
          )}
        </div>
      </div>

      <div className="max-h-[420px] overflow-y-auto px-2 py-2">
        {filteredStocks.map((stock) => {
          const active = selectedSymbol === stock.symbol;
          const positive = Number(stock.changePercent) >= 0;

          return (
            <button
              key={stock.symbol}
              type="button"
              aria-pressed={active}
              onClick={() => setSelectedSymbol(stock.symbol)}
              className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
                active
                  ? "border-emerald-400/20 bg-emerald-400/[0.07]"
                  : "border-transparent hover:bg-slate-800/50"
              }`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-xs font-bold ${
                  active
                    ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                    : "border-slate-700 bg-slate-900 text-slate-300"
                }`}
              >
                {stock.symbol.slice(0, 2)}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-100">
                  {stock.symbol}
                </p>
                <p className="mt-0.5 truncate text-xs text-slate-500">
                  {stock.name}
                </p>
              </div>

              <div className="shrink-0 text-right">
                <p className="text-sm font-semibold tabular-nums text-slate-200">
                  {money(stock.price)}
                </p>
                <div className="mt-1">
                  <Change value={stock.changePercent} />
                </div>
              </div>

              <span
                className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                  positive ? "bg-emerald-400" : "bg-red-400"
                }`}
              />
            </button>
          );
        })}

        {filteredStocks.length === 0 && (
          <div className="flex flex-col items-center px-4 py-10 text-center">
            <Search size={22} className="text-slate-600" />
            <p className="mt-3 text-sm font-medium text-slate-300">
              No stocks found
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Try another symbol or company name.
            </p>
            <button
              type="button"
              onClick={() => setSearch("")}
              className="mt-3 text-xs font-semibold text-emerald-300 hover:text-emerald-200"
            >
              Clear search
            </button>
          </div>
        )}
      </div>

      <div className="border-t border-slate-800/80 p-4">
        <button
          type="button"
          onClick={() => setSearch("")}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-2.5 text-sm font-medium text-slate-400 transition hover:border-slate-700 hover:text-emerald-300"
        >
          View all stocks
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  );
}
