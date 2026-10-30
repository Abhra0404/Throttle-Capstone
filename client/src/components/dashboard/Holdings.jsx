
import { BriefcaseBusiness, ArrowDownRight, ArrowUpRight } from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

export default function Holdings() {
  const { holdings } = usePortfolio();

  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-800/80 bg-[#0c1220]">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 p-5 sm:p-6">
        <div>
          <h2 className="text-lg font-bold text-white">Your holdings</h2>
          <p className="mt-1 text-sm text-slate-400">
            Stocks in your portfolio
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            document
              .getElementById("portfolio")
              ?.scrollIntoView({ behavior: "smooth", block: "start" })
          }
          className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-emerald-400/30 hover:bg-emerald-400/5 hover:text-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
        >
          View portfolio
          <span aria-hidden="true">→</span>
        </button>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[680px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-800/80 bg-slate-900/30">
              {["Instrument", "Qty.", "Avg. price", "Current price", "Returns"].map(
                (heading) => (
                  <th
                    key={heading}
                    className="whitespace-nowrap px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6"
                  >
                    {heading}
                  </th>
                ),
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/70">
            {holdings.length > 0 ? (
              holdings.map((holding) => {
                const quantity = Number(holding.quantity) || 0;
                const averagePrice = Number(holding.averagePrice) || 0;
                const currentPrice = Number(holding.currentPrice) || 0;

                const pnl = (currentPrice - averagePrice) * quantity;
                const invested = averagePrice * quantity;
                const percentage =
                  invested > 0 ? (pnl / invested) * 100 : 0;
                const positive = pnl >= 0;

                return (
                  <tr
                    key={holding.symbol}
                    className="transition hover:bg-slate-800/25"
                  >
                    <td className="px-5 py-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-400/15 bg-emerald-400/10 text-xs font-bold text-emerald-300">
                          {holding.symbol.slice(0, 2)}
                        </div>

                        <div className="min-w-0">
                          <p className="font-semibold text-slate-100">
                            {holding.symbol}
                          </p>
                          <p className="mt-0.5 max-w-[180px] truncate text-xs text-slate-500">
                            {holding.name}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-sm tabular-nums text-slate-300 sm:px-6">
                      {quantity}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-sm tabular-nums text-slate-300 sm:px-6">
                      {money(averagePrice)}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-sm tabular-nums text-slate-300 sm:px-6">
                      {money(currentPrice)}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 sm:px-6">
                      <div
                        className={`inline-flex flex-col gap-1 ${
                          positive ? "text-emerald-300" : "text-red-300"
                        }`}
                      >
                        <span className="flex items-center gap-1 text-sm font-semibold tabular-nums">
                          {positive ? (
                            <ArrowUpRight size={14} />
                          ) : (
                            <ArrowDownRight size={14} />
                          )}
                          {positive ? "+" : ""}
                          {money(pnl)}
                        </span>

                        <span className="text-xs tabular-nums">
                          {positive ? "+" : ""}
                          {percentage.toFixed(2)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-slate-500">
                      <BriefcaseBusiness size={23} />
                    </div>

                    <div>
                      <p className="font-semibold text-slate-200">
                        No holdings yet
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Buy shares through Quick Trade to see them here.
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="border-t border-slate-800/70 px-5 py-3 sm:px-6">
        <p className="text-xs text-slate-500">
          Returns are calculated from average purchase price and current portfolio value.
        </p>
      </div>
    </section>
  );
}
