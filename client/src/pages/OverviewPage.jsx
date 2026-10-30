
import { useState } from "react";
import {
  Activity,
  ArrowRight,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  Clock3,
  Plus,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import MarketOverview from "../components/dashboard/MarketOverview";
import Watchlist from "../components/dashboard/Watchlist";
import Holdings from "../components/dashboard/Holdings";
import PortfolioChart from "../components/dashboard/PortfolioChart";
import { usePortfolio } from "../context/PortfolioContext";

const formatINR = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

function MetricCard({
  label,
  value,
  note,
  icon: Icon,
  tone = "emerald",
  featured = false,
}) {
  const tones = {
    emerald: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/15",
    blue: "bg-sky-400/10 text-sky-300 ring-sky-400/15",
    violet: "bg-violet-400/10 text-violet-300 ring-violet-400/15",
    amber: "bg-amber-400/10 text-amber-300 ring-amber-400/15",
  };

  return (
    <article
      className={`relative min-w-0 overflow-hidden rounded-xl border p-4 transition-colors duration-200 sm:p-5 ${
        featured
          ? "border-emerald-400/20 bg-gradient-to-br from-emerald-400/[0.06] to-[#0c1220] hover:border-emerald-400/30"
          : "border-slate-800/80 bg-[#0c1220] hover:border-slate-700"
      }`}
    >
      {featured && (
        <div
          aria-hidden="true"
          className="absolute right-0 top-0 h-20 w-20 rounded-full bg-emerald-400/[0.05] blur-2xl"
        />
      )}

      <div className="relative flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-slate-400">{label}</p>

        <div className={`shrink-0 rounded-lg p-2 ring-1 ${tones[tone]}`}>
          <Icon size={16} strokeWidth={1.8} />
        </div>
      </div>

      <p
        className={`relative mt-4 break-words font-semibold tracking-tight tabular-nums ${
          featured
            ? "text-xl text-white sm:text-2xl"
            : "text-lg text-slate-100 sm:text-xl"
        }`}
      >
        {value}
      </p>

      <p className="relative mt-1.5 text-[11px] leading-4 text-slate-500">
        {note}
      </p>
    </article>
  );
}

function SectionHeading({ eyebrow, title, description, action }) {
  return (
    <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
      <div>
        {eyebrow && (
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
            {eyebrow}
          </p>
        )}

        <h2 className="text-sm font-semibold tracking-tight text-white sm:text-base">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-xs leading-5 text-slate-400">
            {description}
          </p>
        )}
      </div>

      {action}
    </div>
  );
}

function QuickLink({ icon: Icon, title, description, tone, onClick }) {
  const tones = {
    sky: "bg-sky-400/10 text-sky-300 ring-sky-400/10",
    emerald: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/10",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex min-w-0 items-center gap-3 rounded-xl border border-slate-800/80 bg-[#0c1220] p-3.5 text-left transition hover:border-slate-700 hover:bg-[#0e1626] focus:outline-none focus:ring-2 focus:ring-emerald-400/30 sm:p-4"
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1 ${tones[tone]}`}
      >
        <Icon size={18} strokeWidth={1.8} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-slate-100 transition group-hover:text-emerald-300 sm:text-sm">
          {title}
        </p>

        <p className="mt-1 text-[11px] leading-4 text-slate-500 sm:text-xs">
          {description}
        </p>
      </div>

      <ArrowRight
        size={15}
        className="shrink-0 text-slate-600 transition group-hover:translate-x-0.5 group-hover:text-emerald-300"
      />
    </button>
  );
}

export default function OverviewPage() {
  const [range, setRange] = useState("1D");
  const [selectedSymbol, setSelectedSymbol] = useState("RELIANCE");
  const navigate = useNavigate();

  const {
    cash,
    holdingsValue,
    investedValue,
    totalPnL,
    totalPortfolioValue,
  } = usePortfolio();

  const pnlPositive = totalPnL >= 0;

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6 text-slate-100 sm:space-y-7">
      {/* Page header */}
      <header className="flex flex-col justify-between gap-4 border-b border-slate-800/70 pb-5 sm:flex-row sm:items-center sm:pb-6">
        <div className="min-w-0">
          <div className="mb-2.5 inline-flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.05] px-2.5 py-1">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>

            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-300">
              Paper trading workspace
            </span>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-[28px]">
            Overview<span className="text-emerald-400">.</span>
          </h1>

          <p className="mt-1.5 max-w-xl text-xs leading-5 text-slate-400 sm:text-sm">
            Your portfolio, market movements, and trading activity at a glance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-[#0c1220] px-3 py-2">
            <Clock3 size={14} className="text-amber-300" />
            <span className="text-[11px] font-medium text-slate-400">
              Sample market data
            </span>
          </div>

          <button
            type="button"
            onClick={() => navigate("/trade")}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-400 px-3.5 py-2.5 text-xs font-semibold text-slate-950 transition hover:bg-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:ring-offset-2 focus:ring-offset-[#070b12]"
          >
            <Plus size={15} />
            New trade
          </button>
        </div>
      </header>

      {/* Market indices */}
      <section className="min-w-0">
        <SectionHeading
          eyebrow="Market pulse"
          title="Market overview"
          description="A snapshot of tracked market indices."
        />
        <MarketOverview />
      </section>

      {/* Portfolio metrics */}
      <section>
        <SectionHeading
          eyebrow="Your account"
          title="Portfolio summary"
          description="An overview of your virtual investment account."
        />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Total portfolio value"
            value={formatINR(totalPortfolioValue)}
            note="Cash balance + current holdings"
            icon={Wallet}
            tone="emerald"
            featured
          />

          <MetricCard
            label="Total returns"
            value={`${pnlPositive ? "+" : ""}${formatINR(totalPnL)}`}
            note="Realized and unrealized profit/loss"
            icon={ChartNoAxesCombined}
            tone={pnlPositive ? "emerald" : "amber"}
          />

          <MetricCard
            label="Available cash"
            value={formatINR(cash)}
            note="Virtual cash available to trade"
            icon={BriefcaseBusiness}
            tone="blue"
          />

          <MetricCard
            label="Invested amount"
            value={formatINR(investedValue)}
            note={`Current holdings: ${formatINR(holdingsValue)}`}
            icon={Activity}
            tone="violet"
          />
        </div>
      </section>

      {/* Portfolio chart and watchlist */}
      <section className="min-w-0">
        <SectionHeading
          eyebrow="Performance & tracking"
          title="Trading workspace"
          description="Review portfolio performance and follow individual stocks."
        />

        <div className="grid min-w-0 grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(290px,0.85fr)]">
          <div className="min-w-0">
            <PortfolioChart range={range} setRange={setRange} />
          </div>

          <div className="min-w-0">
            <Watchlist
              selectedSymbol={selectedSymbol}
              setSelectedSymbol={setSelectedSymbol}
            />
          </div>
        </div>
      </section>

      {/* Holdings component includes its own card and heading */}
      <section id="portfolio" className="min-w-0 scroll-mt-24">
        <Holdings />
      </section>

      {/* Quick navigation */}
      <section>
        <SectionHeading
          eyebrow="Navigation"
          title="Quick access"
          description="Jump to the tools you need."
        />

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <QuickLink
            icon={ChartNoAxesCombined}
            title="Explore markets"
            description="Browse available stocks and illustrative prices."
            tone="sky"
            onClick={() => navigate("/markets")}
          />

          <QuickLink
            icon={Wallet}
            title="Portfolio analysis"
            description="Review your positions, returns, and orders."
            tone="emerald"
            onClick={() => navigate("/portfolio")}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="flex flex-col gap-2.5 border-t border-slate-800/70 pt-4 text-[11px] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <span>© 2026 Throttle Trade</span>

        <span className="inline-flex items-center gap-1.5">
          <ShieldCheck size={13} className="shrink-0 text-emerald-400/70" />
          Educational simulation · Not investment advice
        </span>

        <span className="font-medium tracking-wide text-slate-600">
          DEMO BUILD 0.1
        </span>
      </footer>
    </div>
  );
}
