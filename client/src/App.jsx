import { useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  ChevronDown,
  CircleHelp,
  Clock3,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Star,
  Wallet,
  X,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "./App.css";

const marketIndices = [
  { name: "NIFTY 50", value: "25,843.15", change: "+0.72%", positive: true },
  { name: "SENSEX", value: "84,376.29", change: "+0.58%", positive: true },
  { name: "BANK NIFTY", value: "58,412.70", change: "-0.24%", positive: false },
];

const stocks = [
  { symbol: "RELIANCE", name: "Reliance Industries", price: 1458.25, change: 1.42 },
  { symbol: "TCS", name: "Tata Consultancy Services", price: 3218.6, change: -0.63 },
  { symbol: "HDFCBANK", name: "HDFC Bank", price: 968.4, change: 0.84 },
  { symbol: "INFY", name: "Infosys Limited", price: 1512.75, change: 1.16 },
  { symbol: "ICICIBANK", name: "ICICI Bank", price: 1284.3, change: -0.32 },
  { symbol: "BHARTIARTL", name: "Bharti Airtel", price: 1934.5, change: 2.08 },
];

const holdings = [
  { symbol: "RELIANCE", name: "Reliance Industries", qty: 12, avg: 1390, price: 1458.25 },
  { symbol: "INFY", name: "Infosys Limited", qty: 20, avg: 1540, price: 1512.75 },
  { symbol: "HDFCBANK", name: "HDFC Bank", qty: 15, avg: 925, price: 968.4 },
];

const chartData = {
  "1D": [84, 90, 86, 105, 98, 113, 107, 125, 117, 139, 132, 151, 143, 166, 158, 179],
  "1W": [62, 72, 67, 83, 78, 89, 95, 86, 108, 102, 120, 115, 134, 143, 137, 159],
  "1M": [55, 63, 60, 75, 68, 82, 77, 96, 91, 104, 99, 123, 117, 139, 147, 166],
  "1Y": [40, 52, 46, 65, 61, 78, 72, 92, 85, 104, 97, 126, 118, 145, 154, 179],
};

const chartLabels = [
  "09:15", "09:45", "10:15", "10:45",
  "11:15", "11:45", "12:15", "12:45",
  "13:15", "13:45", "14:15", "14:45",
  "15:15", "15:45", "16:15", "16:45",
];

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);

function Brand() {
  return (
    <div className="brand">
      <div className="brand-mark">
        <Activity size={21} strokeWidth={2.4} />
      </div>
      <div>
        <div className="brand-name">throttle<span>.</span></div>
        <div className="brand-subtitle">TRADE TERMINAL</div>
      </div>
    </div>
  );
}

function Sidebar({ active, setActive, open, onClose }) {
  const navigation = [
    { label: "Overview", icon: LayoutDashboard },
    { label: "Markets", icon: ChartNoAxesCombined },
    { label: "Portfolio", icon: BriefcaseBusiness },
    { label: "Watchlist", icon: Star },
  ];

  return (
    <>
      {open && <button className="mobile-scrim" onClick={onClose} aria-label="Close navigation" />}
      <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
        <div className="sidebar-top">
          <Brand />
          <button className="icon-button sidebar-close" onClick={onClose} aria-label="Close menu">
            <X size={19} />
          </button>
        </div>

        <div className="workspace-label">WORKSPACE</div>
        <nav className="nav-list">
          {navigation.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={`nav-item ${active === label ? "nav-item-active" : ""}`}
              onClick={() => {
                setActive(label);
                onClose();
              }}
            >
              <Icon size={18} />
              <span>{label}</span>
              {label === "Watchlist" && <span className="nav-count">6</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-divider" />
        <div className="workspace-label">YOUR ACCOUNT</div>
        <div className="account-card">
          <div className="account-icon"><Wallet size={18} /></div>
          <div className="account-copy">
            <span>Paper account</span>
            <strong>₹10,00,000</strong>
          </div>
          <span className="status-dot" />
        </div>

        <div className="sidebar-bottom">
          <button className="nav-item" onClick={() => setActive("Settings")}>
            <Settings size={18} /><span>Settings</span>
          </button>
          <button className="nav-item" onClick={() => setActive("Help")}>
            <CircleHelp size={18} /><span>Help & support</span>
          </button>
          <div className="profile">
            <div className="avatar">TT</div>
            <div className="profile-copy">
              <strong>Trader account</strong>
              <span>Paper trading</span>
            </div>
            <button className="icon-button" aria-label="Account options"><ChevronDown size={16} /></button>
          </div>
        </div>
      </aside>
    </>
  );
}

function Change({ value }) {
  const positive = value >= 0;
  const Icon = positive ? ArrowUpRight : ArrowDownRight;

  return (
    <span className={`change ${positive ? "positive" : "negative"}`}>
      <Icon size={14} />
      {Math.abs(value).toFixed(2)}%
    </span>
  );
}

function MetricCard({ label, value, change, note, icon: Icon, color = "green" }) {
  return (
    <div className="metric-card">
      <div className="metric-heading">
        <span>{label}</span>
        <div className={`metric-icon metric-icon-${color}`}><Icon size={18} /></div>
      </div>
      <div className="metric-value">{value}</div>
      <div className="metric-footer">
        {change !== undefined ? <Change value={change} /> : <span className="metric-note">{note}</span>}
        {change !== undefined && <span className="metric-note">{note}</span>}
      </div>
    </div>
  );
}

function StockChart({ range, setRange, selectedStock }) {
  const data = chartData[range].map((value, index) => ({
    time: chartLabels[index],
    price: value,
  }));
  const last = data[data.length - 1].price;
  const first = data[0].price;
  const change = ((last - first) / first) * 100;

  return (
    <section className="panel chart-panel">
      <div className="panel-heading chart-heading">
        <div>
          <div className="section-kicker">PORTFOLIO PERFORMANCE</div>
          <h2>Portfolio value</h2>
          <p className="muted">Your simulated account over time</p>
        </div>
        <div className="range-switcher">
          {Object.keys(chartData).map((item) => (
            <button
              key={item}
              className={range === item ? "range-active" : ""}
              onClick={() => setRange(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="chart-total">
        <strong>₹10,84,250.00</strong>
        <span className="chart-gain"><ArrowUpRight size={15} /> ₹84,250.00 (8.42%)</span>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 8, bottom: 0, left: -18 }}>
            <defs>
              <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#36d399" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#36d399" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#252b34" strokeDasharray="3 5" vertical={false} />
            <XAxis dataKey="time" tick={{ fill: "#727d8b", fontSize: 10 }} tickLine={false} axisLine={false} minTickGap={32} />
            <YAxis tick={{ fill: "#727d8b", fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
            <Tooltip
              contentStyle={{ background: "#171b22", border: "1px solid #303744", borderRadius: 10, color: "#f4f6f8" }}
              labelStyle={{ color: "#8994a3", marginBottom: 5 }}
              formatter={(value) => [`₹${Number(value).toLocaleString("en-IN")}`, "Portfolio index"]}
            />
            <Area type="monotone" dataKey="price" stroke="#36d399" strokeWidth={2.3} fill="url(#portfolioGradient)" activeDot={{ r: 4, fill: "#36d399", stroke: "#171b22", strokeWidth: 2 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="chart-footer">
        <span><span className="legend-dot" /> Portfolio value</span>
        <span className="muted">Illustrative chart · not live data</span>
      </div>
    </section>
  );
}

function MarketOverview() {
  return (
    <section className="indices-grid">
      {marketIndices.map((index) => (
        <div className="index-card" key={index.name}>
          <div className="index-top">
            <span>{index.name}</span>
            <span className={`index-indicator ${index.positive ? "indicator-up" : "indicator-down"}`}>
              {index.positive ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}
            </span>
          </div>
          <strong>{index.value}</strong>
          <div className="index-bottom">
            <span className={index.positive ? "positive-text" : "negative-text"}>{index.change}</span>
            <span className="muted">Today</span>
          </div>
        </div>
      ))}
    </section>
  );
}

function Watchlist({ selectedSymbol, setSelectedSymbol }) {
  const [search, setSearch] = useState("");
  const filtered = stocks.filter((stock) =>
    `${stock.symbol} ${stock.name}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <h2>Market watch</h2>
          <p className="muted">Your tracked stocks</p>
        </div>
        <button className="icon-button" aria-label="Add stock"><Plus size={18} /></button>
      </div>
      <div className="search-box">
        <Search size={15} />
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search stocks..." />
        <kbd>⌘ K</kbd>
      </div>
      <div className="stock-list">
        {filtered.map((stock) => (
          <button
            key={stock.symbol}
            className={`stock-row ${selectedSymbol === stock.symbol ? "stock-row-active" : ""}`}
            onClick={() => setSelectedSymbol(stock.symbol)}
          >
            <div className="stock-logo">{stock.symbol.slice(0, 2)}</div>
            <div className="stock-info">
              <strong>{stock.symbol}</strong>
              <span>{stock.name}</span>
            </div>
            <div className="stock-price">
              <strong>{money(stock.price)}</strong>
              <Change value={stock.change} />
            </div>
          </button>
        ))}
        {filtered.length === 0 && <div className="empty-state">No stocks match your search.</div>}
      </div>
      <button className="text-button" onClick={() => setSearch("")}>View all tracked stocks <span>→</span></button>
    </section>
  );
}

function Holdings() {
  return (
    <section className="panel holdings-panel">
      <div className="panel-heading">
        <div>
          <h2>Your holdings</h2>
          <p className="muted">Stocks in your portfolio</p>
        </div>
        <button className="subtle-button">View portfolio <span>→</span></button>
      </div>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg. price</th>
              <th>Current price</th>
              <th>Returns</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((holding) => {
              const pnl = (holding.price - holding.avg) * holding.qty;
              const pct = ((holding.price - holding.avg) / holding.avg) * 100;
              return (
                <tr key={holding.symbol}>
                  <td>
                    <div className="table-stock">
                      <div className="stock-logo small-logo">{holding.symbol.slice(0, 2)}</div>
                      <div><strong>{holding.symbol}</strong><span>{holding.name}</span></div>
                    </div>
                  </td>
                  <td>{holding.qty}</td>
                  <td>{money(holding.avg)}</td>
                  <td>{money(holding.price)}</td>
                  <td>
                    <div className={pnl >= 0 ? "return-positive" : "return-negative"}>
                      <strong>{pnl >= 0 ? "+" : ""}{money(pnl)}</strong>
                      <span>{pct >= 0 ? "+" : ""}{pct.toFixed(2)}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function OrderTicket({ selectedSymbol }) {
  const [side, setSide] = useState("BUY");
  const [quantity, setQuantity] = useState("1");
  const [message, setMessage] = useState("");
  const stock = stocks.find((item) => item.symbol === selectedSymbol) || stocks[0];
  const validQuantity = Number.isInteger(Number(quantity)) && Number(quantity) > 0;
  const total = validQuantity ? Number(quantity) * stock.price : 0;

  function handleSubmit(event) {
    event.preventDefault();
    if (!validQuantity) {
      setMessage("Enter a valid whole-number quantity.");
      return;
    }
    setMessage("Preview only — order execution will be added with the backend.");
  }

  return (
    <section className="panel order-panel">
      <div className="panel-heading">
        <div>
          <h2>Quick trade</h2>
          <p className="muted">Simulated market order</p>
        </div>
        <div className="order-mode"><Activity size={14} /> PAPER</div>
      </div>

      <div className="order-tabs">
        <button className={side === "BUY" ? "buy-tab active" : ""} onClick={() => { setSide("BUY"); setMessage(""); }}>Buy</button>
        <button className={side === "SELL" ? "sell-tab active" : ""} onClick={() => { setSide("SELL"); setMessage(""); }}>Sell</button>
      </div>

      <form onSubmit={handleSubmit}>
        <label className="field-label">Instrument</label>
        <div className="instrument-field">
          <div className="stock-logo small-logo">{stock.symbol.slice(0, 2)}</div>
          <div className="instrument-copy"><strong>{stock.symbol}</strong><span>{stock.name}</span></div>
          <div className="instrument-price"><strong>{money(stock.price)}</strong><span>Mock price</span></div>
        </div>

        <label className="field-label" htmlFor="quantity">Quantity</label>
        <div className="quantity-field">
          <button type="button" onClick={() => { setQuantity(String(Math.max(1, (Number(quantity) || 1) - 1))); setMessage(""); }} aria-label="Decrease quantity">−</button>
          <input id="quantity" inputMode="numeric" value={quantity} onChange={(event) => { setQuantity(event.target.value); setMessage(""); }} />
          <button type="button" onClick={() => { setQuantity(String((Number(quantity) || 0) + 1)); setMessage(""); }} aria-label="Increase quantity">+</button>
        </div>

        <div className="order-summary">
          <span>Estimated order value</span>
          <strong>{money(total)}</strong>
        </div>
        <div className="order-summary">
          <span>Order type</span>
          <span className="market-type">Market</span>
        </div>
        <button className={`submit-order ${side === "SELL" ? "submit-sell" : ""}`} type="submit">
          {side === "BUY" ? "Review buy order" : "Review sell order"}
          <ArrowUpRight size={16} />
        </button>
        {message && <p className="form-message">{message}</p>}
        <p className="order-disclaimer"><ShieldCheck size={14} /> Paper trading only. No real money involved.</p>
      </form>
    </section>
  );
}

export default function App() {
  const [active, setActive] = useState("Overview");
  const [range, setRange] = useState("1D");
  const [selectedSymbol, setSelectedSymbol] = useState("RELIANCE");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar active={active} setActive={setActive} open={menuOpen} onClose={() => setMenuOpen(false)} />

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-button mobile-menu" onClick={() => setMenuOpen(true)} aria-label="Open menu">
              <Menu size={20} />
            </button>
            <div className="breadcrumb"><span>Workspace</span><span className="breadcrumb-separator">/</span><strong>{active}</strong></div>
          </div>
          <div className="topbar-actions">
            <div className="market-status"><span className="status-dot" /> Demo environment</div>
            <button className="icon-button notification-button" aria-label="Notifications"><Bell size={18} /><span /></button>
            <div className="topbar-avatar">TT</div>
          </div>
        </header>

        <div className="page-content">
          <section className="welcome-row">
            <div>
              <div className="section-kicker">WEDNESDAY, OCTOBER 21</div>
              <h1>Market overview<span>.</span></h1>
              <p>Here's how your paper portfolio is performing today.</p>
            </div>
            <div className="welcome-actions">
              <div className="data-badge"><Clock3 size={14} /> Sample market data</div>
              <button className="primary-button" onClick={() => document.getElementById("quick-trade")?.scrollIntoView({ behavior: "smooth", block: "center" })}>
                <Plus size={17} /> New trade
              </button>
            </div>
          </section>

          <MarketOverview />

          <section className="metrics-grid">
            <MetricCard label="Total portfolio value" value="₹10,84,250" change={8.42} note="vs. initial capital" icon={Wallet} />
            <MetricCard label="Total returns" value="+₹84,250" change={8.42} note="all-time return" icon={ChartNoAxesCombined} />
            <MetricCard label="Available cash" value="₹6,42,180" note="Ready to trade" icon={BriefcaseBusiness} color="blue" />
            <MetricCard label="Invested amount" value="₹4,42,070" note="Across 3 holdings" icon={Activity} color="purple" />
          </section>

          <section className="main-grid">
            <StockChart range={range} setRange={setRange} selectedStock={selectedSymbol} />
            <Watchlist selectedSymbol={selectedSymbol} setSelectedSymbol={setSelectedSymbol} />
          </section>

          <section className="bottom-grid">
            <Holdings />
            <div id="quick-trade"><OrderTicket selectedSymbol={selectedSymbol} /></div>
          </section>

          <footer className="page-footer">
            <span>© 2026 Throttle Trade</span>
            <span><ShieldCheck size={14} /> Educational simulation · Not investment advice</span>
            <span className="footer-version">DEMO BUILD 0.1</span>
          </footer>
        </div>
      </main>
    </div>
  );
}
