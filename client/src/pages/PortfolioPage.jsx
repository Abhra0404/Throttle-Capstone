
import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowDownLeft, BriefcaseBusiness } from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";

const formatINR = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

export default function PortfolioPage() {
  const {
    cash,
    holdings,
    orders,
    holdingsValue,
    investedValue,
    totalPnL,
    totalPortfolioValue,
  } = usePortfolio();

  const pnlColor = (value) =>
    Number(value) >= 0 ? "text-emerald-400" : "text-rose-400";

  return (
    <div className="mx-auto max-w-7xl space-y-6 text-slate-100">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
          Your account
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Portfolio</h1>
        <p className="mt-2 text-sm text-slate-400">
          Review your virtual capital, positions, returns, and paper orders.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Total portfolio value", totalPortfolioValue],
          ["Available cash", cash],
          ["Current holdings value", holdingsValue],
          ["Invested amount", investedValue],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5"
          >
            <p className="text-sm text-slate-400">{label}</p>
            <p className="mt-3 text-xl font-semibold">{formatINR(value)}</p>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-950/70">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 p-5">
          <div>
            <h2 className="font-semibold">Your holdings</h2>
            <p className="mt-1 text-sm text-slate-400">
              Positions in your paper account
            </p>
          </div>
          <Link
            to="/markets"
            className="rounded-lg border border-slate-700 px-3 py-2 text-sm hover:bg-slate-900"
          >
            Explore markets
          </Link>
        </div>

        {holdings.length === 0 ? (
          <div className="p-10 text-center">
            <BriefcaseBusiness className="mx-auto text-slate-500" size={28} />
            <p className="mt-3 font-medium">No holdings yet</p>
            <p className="mt-1 text-sm text-slate-400">
              Place a paper buy order to start building your portfolio.
            </p>
            <Link
              to="/trade"
              className="mt-4 inline-block rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950"
            >
              Go to Buy / Sell
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-medium">Stock</th>
                  <th className="px-5 py-4 font-medium">Qty</th>
                  <th className="px-5 py-4 font-medium">Avg. cost</th>
                  <th className="px-5 py-4 font-medium">Current price</th>
                  <th className="px-5 py-4 font-medium">Market value</th>
                  <th className="px-5 py-4 font-medium">Unrealized P/L</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((holding) => {
                  const quantity = Number(holding.quantity) || 0;
                  const averagePrice = Number(holding.averagePrice) || 0;
                  const currentPrice = Number(holding.currentPrice) || averagePrice;
                  const marketValue = currentPrice * quantity;
                  const pnl = (currentPrice - averagePrice) * quantity;

                  return (
                    <tr
                      key={holding.symbol}
                      className="border-t border-slate-800/80 hover:bg-slate-900/50"
                    >
                      <td className="px-5 py-4">
                        <Link
                          to={`/markets/${holding.symbol}`}
                          className="font-medium hover:text-emerald-300"
                        >
                          {holding.symbol}
                        </Link>
                        <p className="mt-1 text-xs text-slate-500">
                          {holding.name}
                        </p>
                      </td>
                      <td className="px-5 py-4">{quantity}</td>
                      <td className="px-5 py-4">{formatINR(averagePrice)}</td>
                      <td className="px-5 py-4">{formatINR(currentPrice)}</td>
                      <td className="px-5 py-4">{formatINR(marketValue)}</td>
                      <td className={`px-5 py-4 font-medium ${pnlColor(pnl)}`}>
                        {formatINR(pnl)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-950/70">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 p-5">
          <div>
            <h2 className="font-semibold">Order history</h2>
            <p className="mt-1 text-sm text-slate-400">
              Your recorded paper trades
            </p>
          </div>
          <div className={`text-sm font-semibold ${pnlColor(totalPnL)}`}>
            Total returns: {formatINR(totalPnL)}
          </div>
        </div>

        {orders.length === 0 ? (
          <p className="p-8 text-center text-sm text-slate-400">
            No paper orders have been placed yet.
          </p>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {orders.map((order, index) => {
              const isBuy = String(order.side).toLowerCase() === "buy";

              return (
                <div
                  key={order.id || `${order.symbol}-${order.side}-${index}`}
                  className="flex flex-wrap items-center justify-between gap-4 p-5"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`rounded-xl p-2 ${
                        isBuy
                          ? "bg-emerald-400/10 text-emerald-300"
                          : "bg-rose-400/10 text-rose-300"
                      }`}
                    >
                      {isBuy ? (
                        <ArrowDownLeft size={18} />
                      ) : (
                        <ArrowUpRight size={18} />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">
                        {order.symbol} · {String(order.side).toUpperCase()}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {order.quantity} shares · {formatINR(order.price)} each
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold">
                    {formatINR(order.total ?? order.quantity * order.price)}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
