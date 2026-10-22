import { useState } from "react";
import Sidebar from "./components/layout/Sidebar";
import Topbar from "./components/layout/Topbar";
import {
  Activity,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  Clock3,
  Plus,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import "./App.css";
import MarketOverview from "./components/dashboard/MarketOverview";
import MetricCard from "./components/dashboard/MetricCard";
import Watchlist from "./components/dashboard/Watchlist";
import Holdings from "./components/dashboard/Holdings";
import QuickTrade from "./components/dashboard/QuickTrade";
import PortfolioChart from "./components/dashboard/PortfolioChart";


export default function App() {
  const [active, setActive] = useState("Overview");
  const [range, setRange] = useState("1D");
  const [selectedSymbol, setSelectedSymbol] = useState("RELIANCE");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar
        active={active}
        setActive={setActive}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <main className="main-area">
        <Topbar active={active} onOpenMenu={() => setMenuOpen(true)} />

        <div className="page-content">
          <section className="welcome-row">
            <div>
              <div className="section-kicker">WEDNESDAY, OCTOBER 21</div>
              <h1>
                Market overview<span>.</span>
              </h1>
              <p>Here's how your paper portfolio is performing today.</p>
            </div>
            <div className="welcome-actions">
              <div className="data-badge">
                <Clock3 size={14} /> Sample market data
              </div>
              <button
                className="primary-button"
                onClick={() =>
                  document
                    .getElementById("quick-trade")
                    ?.scrollIntoView({ behavior: "smooth", block: "center" })
                }
              >
                <Plus size={17} /> New trade
              </button>
            </div>
          </section>

          <MarketOverview />

          <section className="metrics-grid">
            <MetricCard
              label="Total portfolio value"
              value="₹10,84,250"
              change={8.42}
              note="vs. initial capital"
              icon={Wallet}
            />

            <MetricCard
              label="Total returns"
              value="+₹84,250"
              change={8.42}
              note="all-time return"
              icon={ChartNoAxesCombined}
            />

            <MetricCard
              label="Available cash"
              value="₹6,42,180"
              note="Ready to trade"
              icon={BriefcaseBusiness}
              color="blue"
            />

            <MetricCard
              label="Invested amount"
              value="₹4,42,070"
              note="Across 3 holdings"
              icon={Activity}
              color="purple"
            />
          </section>

          <section className="main-grid">
            <PortfolioChart range={range} setRange={setRange} />

            <Watchlist
              selectedSymbol={selectedSymbol}
              setSelectedSymbol={setSelectedSymbol}
            />
          </section>

          <section className="bottom-grid">
            <Holdings />

            <div id="quick-trade">
              <QuickTrade selectedSymbol={selectedSymbol} />
            </div>
          </section>

          <footer className="page-footer">
            <span>© 2026 Throttle Trade</span>
            <span>
              <ShieldCheck size={14} /> Educational simulation · Not investment
              advice
            </span>
            <span className="footer-version">DEMO BUILD 0.1</span>
          </footer>
        </div>
      </main>
    </div>
  );
}
