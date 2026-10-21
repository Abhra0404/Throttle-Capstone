import {
  Activity,
  ChartNoAxesCombined,
  BriefcaseBusiness,
  ChevronDown,
  CircleHelp,
  LayoutDashboard,
  Settings,
  Star,
  Wallet,
  X,
} from "lucide-react";

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

export default function Sidebar({ active, setActive, open, onClose }) {
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

