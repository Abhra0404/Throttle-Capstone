
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { marketIndices } from "../../data/mockData";

export default function MarketOverview() {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {marketIndices.map((index) => {
        const positive = index.change >= 0;
        const Icon = positive ? ArrowUpRight : ArrowDownRight;

        return (
          <div
            key={index.symbol}
            className="group rounded-2xl border border-slate-800/80 bg-[#0c1220] p-5 transition duration-200 hover:border-slate-700 hover:bg-[#0e1626]"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-slate-400">
                {index.name}
              </span>

              <span
                className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                  positive
                    ? "bg-emerald-400/10 text-emerald-300"
                    : "bg-red-400/10 text-red-300"
                }`}
              >
                <Icon size={17} />
              </span>
            </div>

            <p className="mt-5 text-2xl font-bold tracking-tight tabular-nums text-white">
              {Number(index.value).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <span
                className={`inline-flex items-center rounded-lg px-2 py-1 text-xs font-semibold tabular-nums ${
                  positive
                    ? "bg-emerald-400/10 text-emerald-300"
                    : "bg-red-400/10 text-red-300"
                }`}
              >
                {positive ? "+" : ""}
                {Number(index.change).toFixed(2)} (
                {positive ? "+" : ""}
                {Number(index.changePercent).toFixed(2)}%)
              </span>

              <span className="text-xs text-slate-500">Today</span>
            </div>
          </div>
        );
      })}
    </section>
  );
}
