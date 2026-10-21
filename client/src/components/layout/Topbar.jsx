import { Bell, Menu } from "lucide-react";

export default function Topbar({ active, onOpenMenu }) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          className="icon-button mobile-menu"
          onClick={onOpenMenu}
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <div className="breadcrumb">
          <span>Workspace</span>
          <span className="breadcrumb-separator">/</span>
          <strong>{active}</strong>
        </div>
      </div>

      <div className="topbar-actions">
        <div className="market-status">
          <span className="status-dot" /> Demo environment
        </div>
        <button className="icon-button notification-button" aria-label="Notifications">
          <Bell size={18} />
          <span />
        </button>
        <div className="topbar-avatar">TT</div>
      </div>
    </header>
  );
}
