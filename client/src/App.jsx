import { useState } from "react";
import Sidebar from "./components/layout/Sidebar";
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
import { usePortfolio } from "./context/PortfolioContext";

export default function App() {
  const [active, setActive] = useState("Overview");
  const [range, setRange] = useState("1D");
  const [selectedSymbol, setSelectedSymbol] = useState("RELIANCE");
  const [menuOpen, setMenuOpen] = useState(false);
  const { cash, holdingsValue, investedValue, totalPnL, totalPortfolioValue } =
    usePortfolio();

  const formatINR = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(value);

  return (
    <div className="app-shell">
      <Sidebar
        active={active}
        setActive={setActive}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <main className="main-area">

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
              value={formatINR(totalPortfolioValue)}
              note="Virtual cash + holdings"
              icon={Wallet}
            />

            <MetricCard
              label="Total returns"
              value={formatINR(totalPnL)}
              note="Realized + unrealized P/L"
              icon={ChartNoAxesCombined}
            />

            <MetricCard
              label="Available cash"
              value={formatINR(cash)}
              note="Ready to trade"
              icon={BriefcaseBusiness}
              color="blue"
            />

            <MetricCard
              label="Invested amount"
              value={formatINR(investedValue)}
              note={`Current holdings value: ${formatINR(holdingsValue)}`}
              icon={Activity}
              color="purple"
            />
          </section>

          <section className="main-grid" id="watchlist">
            <PortfolioChart range={range} setRange={setRange} />

            <Watchlist
              selectedSymbol={selectedSymbol}
              setSelectedSymbol={setSelectedSymbol}
            />
          </section>

          <section className="bottom-grid" id="portfolio">
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
