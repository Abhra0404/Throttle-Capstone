
import { Link } from "react-router-dom";
import {
  ArrowDownLeft,
  ArrowUpRight,
  BriefcaseBusiness,
  TrendingDown,
  TrendingUp,
  Wallet,
  ChartNoAxesCombined,
  IndianRupee,
  RefreshCw,
  ExternalLink,
} from "lucide-react";

import { usePortfolio } from "../context/PortfolioContext";
import { ErrorState, LoadingState } from "../components/ui/DataState";

const formatINR = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

const formatSignedINR = (value) => {
  const amount = Number(value) || 0;
  return `${amount > 0 ? "+" : amount < 0 ? "-" : ""}${formatINR(Math.abs(amount))}`;
};

const formatPercent = (value) => {
  const amount = Number(value) || 0;
  return `${amount > 0 ? "+" : ""}${amount.toFixed(2)}%`;
};

const getPnLColor = (value) =>
  Number(value) > 0
    ? "text-emerald-400"
    : Number(value) < 0
      ? "text-rose-400"
      : "text-slate-400";

const getPnLBg = (value) =>
  Number(value) > 0
    ? "bg-emerald-400/10"
    : Number(value) < 0
      ? "bg-rose-400/10"
      : "bg-slate-800";

function StatCard({ label, value, icon: Icon, subtitle, pnl }) {
  return (
    <div className="rounded-2xl border border-slate-800/80 bg-[#111827] p-5 transition-colors hover:border-slate-700">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-400">{label}</p>
        <div className="rounded-xl bg-slate-800/80 p-2.5 text-slate-300">
          <Icon size={18} />
        </div>
      </div>

      <p
        className={`mt-5 text-2xl font-semibold tracking-tight ${
          pnl !== undefined ? getPnLColor(pnl) : "text-white"
        }`}
      >
        {value}
      </p>

      {subtitle && (
        <p className="mt-2 text-xs text-slate-500">{subtitle}</p>
      )}
    </div>
  );
}

function PnLIndicator({ value, percentage }) {
  const positive = Number(value) > 0;
  const negative = Number(value) < 0;
  const Icon = positive ? TrendingUp : TrendingDown;

  return (
    <div className={`inline-flex flex-col items-end ${getPnLColor(value)}`}>
      <span className="flex items-center gap-1 font-semibold tabular-nums">
        {positive ? "+" : negative ? "-" : ""}
        {formatINR(Math.abs(Number(value) || 0))}
      </span>
      {percentage !== undefined && (
        <span className="mt-1 flex items-center gap-1 text-xs">
          {(positive || negative) && <Icon size={12} />}
          {formatPercent(percentage)}
        </span>
      )}
    </div>
  );
}

function SectionHeader({ title, description, action }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 px-5 py-5">
      <div>
        <h2 className="font-semibold text-white">{title}</h2>
        <p className="mt-1 text-xs text-slate-500">{description}</p>
      </div>
      {action}
    </div>
  );
}

export default function PortfolioPage() {
  const {
    cash,
    holdings,
    orders,
    holdingsValue,
    investedValue,
    realizedPnL,
    unrealizedPnL,
    totalPnlPercent,
    totalPnL,
    totalPortfolioValue,
    isLoading,
    error,
    refreshPortfolio,
  } = usePortfolio();

  const totalHoldings = holdings.length;

  const allocation = holdings.map((holding) => {
    const quantity = Number(holding.quantity) || 0;
    const averagePrice = Number(holding.averagePrice) || 0;
    const currentPrice = Number(holding.currentPrice) || averagePrice;
    const marketValue = currentPrice * quantity;
    const invested = averagePrice * quantity;
    const pnl = marketValue - invested;
    const pnlPercent =
      invested > 0 ? (pnl / invested) * 100 : 0;

    return {
      ...holding,
      quantity,
      averagePrice,
      currentPrice,
      marketValue,
      invested,
      pnl,
      pnlPercent,
      allocationPercent:
        Number(holdingsValue) > 0
          ? (marketValue / Number(holdingsValue)) * 100
          : 0,
    };
  });

  return (
    <div className="mx-auto max-w-7xl space-y-7 pb-10 text-slate-100">
      {/* Page heading */}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
            <ChartNoAxesCombined size={15} />
            Trading account
          </div>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
            My Portfolio
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Track your investments, holdings and trading performance.
          </p>
        </div>

        <button
          onClick={refreshPortfolio}
          disabled={isLoading}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-slate-600 hover:bg-slate-800 disabled:opacity-50"
        >
          <RefreshCw
            size={15}
            className={isLoading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </header>

      {isLoading && <LoadingState label="Loading portfolio..." />}

      {error && (
        <ErrorState message={error} onRetry={refreshPortfolio} />
      )}

      {!isLoading && !error && (
        <>
          {/* Portfolio value overview */}
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Total portfolio value"
              value={formatINR(totalPortfolioValue)}
              icon={Wallet}
              subtitle="Cash balance + current holdings"
            />

            <StatCard
              label="Invested amount"
              value={formatINR(investedValue)}
              icon={IndianRupee}
              subtitle="Capital deployed in stocks"
            />

            <StatCard
              label="Available balance"
              value={formatINR(cash)}
              icon={BriefcaseBusiness}
              subtitle="Available buying power"
            />

            <StatCard
              label="Total returns"
              value={formatSignedINR(totalPnL)}
              icon={Number(totalPnL) >= 0 ? TrendingUp : TrendingDown}
              pnl={totalPnL}
              subtitle={formatPercent(totalPnlPercent)}
            />
          </section>

          {/* Realized and unrealized returns */}
          <section className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center justify-between rounded-2xl border border-slate-800/80 bg-[#111827] p-5">
              <div>
                <p className="text-sm text-slate-400">Unrealized P&L</p>
                <p className={`mt-2 text-xl font-semibold ${getPnLColor(unrealizedPnL)}`}>
                  {formatSignedINR(unrealizedPnL)}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Returns on your current holdings
                </p>
              </div>
              <div className={`rounded-xl p-3 ${getPnLBg(unrealizedPnL)} ${getPnLColor(unrealizedPnL)}`}>
                <TrendingUp size={22} />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-slate-800/80 bg-[#111827] p-5">
              <div>
                <p className="text-sm text-slate-400">Realized P&L</p>
                <p className={`mt-2 text-xl font-semibold ${getPnLColor(realizedPnL)}`}>
                  {formatSignedINR(realizedPnL)}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Returns from completed sell orders
                </p>
              </div>
              <div className={`rounded-xl p-3 ${getPnLBg(realizedPnL)} ${getPnLColor(realizedPnL)}`}>
                <IndianRupee size={22} />
              </div>
            </div>
          </section>

          {/* Holdings */}
          <section className="overflow-hidden rounded-2xl border border-slate-800/80 bg-[#111827]">
            <SectionHeader
              title="My Holdings"
              description={`${totalHoldings} stocks in your portfolio`}
              action={
                <Link
                  to="/markets"
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-emerald-400/50 hover:text-emerald-400"
                >
                  Explore markets
                  <ExternalLink size={13} />
                </Link>
              }
            />

            {holdings.length === 0 ? (
              <div className="px-5 py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-slate-400">
                  <BriefcaseBusiness size={25} />
                </div>

                <h3 className="mt-4 font-semibold text-white">
                  Your portfolio is empty
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-sm text-slate-400">
                  You haven't invested in any stocks yet. Explore the market
                  and place your first paper trade.
                </p>

                <Link
                  to="/trade"
                  className="mt-5 inline-flex items-center rounded-xl bg-emerald-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
                >
                  Start trading
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[950px] text-left text-sm">
                  <thead className="bg-slate-900/60 text-[11px] uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="px-5 py-4 font-medium">Instrument</th>
                      <th className="px-5 py-4 text-right font-medium">Qty</th>
                      <th className="px-5 py-4 text-right font-medium">Avg. cost</th>
                      <th className="px-5 py-4 text-right font-medium">LTP</th>
                      <th className="px-5 py-4 text-right font-medium">Invested</th>
                      <th className="px-5 py-4 text-right font-medium">Market value</th>
                      <th className="px-5 py-4 text-right font-medium">P&L</th>
                    </tr>
                  </thead>

                  <tbody>
                    {allocation.map((holding) => {
                      const positive = holding.pnl >= 0;

                      return (
                        <tr
                          key={holding.symbol}
                          className="border-t border-slate-800/70 transition hover:bg-slate-900/50"
                        >
                          <td className="px-5 py-4">
                            <Link
                              to={`/markets/${holding.symbol}`}
                              className="group flex items-center gap-3"
                            >
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-xs font-bold text-slate-300">
                                {holding.symbol.slice(0, 3)}
                              </div>

                              <div>
                                <p className="font-semibold text-white transition group-hover:text-emerald-400">
                                  {holding.symbol}
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                  {holding.name}
                                </p>
                              </div>
                            </Link>
                          </td>

                          <td className="px-5 py-4 text-right font-medium tabular-nums text-slate-300">
                            {holding.quantity}
                          </td>

                          <td className="px-5 py-4 text-right tabular-nums text-slate-400">
                            {formatINR(holding.averagePrice)}
                          </td>

                          <td className="px-5 py-4 text-right font-medium tabular-nums text-white">
                            {formatINR(holding.currentPrice)}
                          </td>

                          <td className="px-5 py-4 text-right tabular-nums text-slate-400">
                            {formatINR(holding.invested)}
                          </td>

                          <td className="px-5 py-4 text-right font-medium tabular-nums text-white">
                            {formatINR(holding.marketValue)}
                          </td>

                          <td className="px-5 py-4 text-right">
                            <PnLIndicator
                              value={holding.pnl}
                              percentage={holding.pnlPercent}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {holdings.length > 0 && (
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 px-5 py-4">
                <p className="text-xs text-slate-500">
                  Showing all {totalHoldings} holdings
                </p>
                <p className="text-sm font-semibold text-white">
                  Holdings value: {formatINR(holdingsValue)}
                </p>
              </div>
            )}
          </section>

          {/* Portfolio allocation */}
          {holdings.length > 0 && (
            <section className="rounded-2xl border border-slate-800/80 bg-[#111827] p-5">
              <div className="mb-6">
                <h2 className="font-semibold text-white">
                  Portfolio Allocation
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Distribution of your invested stocks by current market value
                </p>
              </div>

              <div className="flex h-3 overflow-hidden rounded-full bg-slate-800">
                {allocation.map((holding, index) => (
                  <div
                    key={holding.symbol}
                    title={`${holding.symbol}: ${holding.allocationPercent.toFixed(2)}%`}
                    style={{
                      width: `${holding.allocationPercent}%`,
                    }}
                    className={`h-full ${
                      [
                        "bg-emerald-400",
                        "bg-sky-400",
                        "bg-violet-400",
                        "bg-amber-400",
                        "bg-cyan-400",
                        "bg-rose-400",
                      ][index % 6]
                    }`}
                  />
                ))}
              </div>

              <div className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                {allocation.map((holding, index) => (
                  <div
                    key={holding.symbol}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <span
                        className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                          [
                            "bg-emerald-400",
                            "bg-sky-400",
                            "bg-violet-400",
                            "bg-amber-400",
                            "bg-cyan-400",
                            "bg-rose-400",
                          ][index % 6]
                        }`}
                      />
                      <span className="truncate text-sm font-medium text-slate-300">
                        {holding.symbol}
                      </span>
                    </div>

                    <span className="text-sm tabular-nums text-slate-400">
                      {holding.allocationPercent.toFixed(2)}%
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Order history */}
          <section className="overflow-hidden rounded-2xl border border-slate-800/80 bg-[#111827]">
            <SectionHeader
              title="Recent Transactions"
              description="Your paper trading activity"
              action={
                <Link
                  to="/trade"
                  className="text-xs font-semibold text-emerald-400 transition hover:text-emerald-300"
                >
                  Trade stocks →
                </Link>
              }
            />

            {orders.length === 0 ? (
              <div className="p-10 text-center">
                <p className="text-sm text-slate-400">
                  No transactions yet. Your completed paper trades will appear here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-800/70">
                {orders.slice(0, 10).map((order, index) => {
                  const isBuy =
                    String(order.side).toLowerCase() === "buy";

                  const status = String(
                    order.status || "EXECUTED"
                  ).toUpperCase();

                  const quantity = Number(order.quantity) || 0;
                  const price = Number(order.price) || 0;
                  const total =
                    Number(order.total) || quantity * price;

                  return (
                    <div
                      key={order.id || `${order.symbol}-${order.side}-${index}`}
                      className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 transition hover:bg-slate-900/40"
                    >
                      <div className="flex min-w-[180px] items-center gap-3">
                        <div
                          className={`rounded-xl p-2.5 ${
                            isBuy
                              ? "bg-emerald-400/10 text-emerald-400"
                              : "bg-rose-400/10 text-rose-400"
                          }`}
                        >
                          {isBuy ? (
                            <ArrowDownLeft size={19} />
                          ) : (
                            <ArrowUpRight size={19} />
                          )}
                        </div>

                        <div>
                          <p className="font-semibold text-white">
                            {order.symbol}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {quantity} shares · {formatINR(price)} / share
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold tabular-nums text-white">
                          {formatINR(total)}
                        </p>
                        <p
                          className={`mt-1 text-xs font-semibold ${
                            isBuy
                              ? "text-emerald-400"
                              : "text-rose-400"
                          }`}
                        >
                          {isBuy ? "BUY" : "SELL"}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-bold tracking-wider ${
                          status === "EXECUTED" || status === "COMPLETED"
                            ? "bg-emerald-400/10 text-emerald-400"
                            : status === "PENDING"
                              ? "bg-amber-400/10 text-amber-400"
                              : "bg-rose-400/10 text-rose-400"
                        }`}
                      >
                        {status}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {orders.length > 10 && (
              <div className="border-t border-slate-800 px-5 py-3 text-center text-xs text-slate-500">
                Showing the 10 most recent transactions
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
