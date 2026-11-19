
import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Menu, ChevronRight, CircleHelp } from "lucide-react";
import Sidebar from "./Sidebar";

function getPageTitle(pathname) {
  if (pathname.startsWith("/markets/")) return "Markets";
  if (pathname === "/markets") return "Markets";
  if (pathname === "/trade") return "Buy / Sell";
  if (pathname === "/portfolio") return "Portfolio";
  if (pathname === "/watchlist") return "Watchlist";
  return "Overview";
}

export default function TradingLayout() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const active = getPageTitle(location.pathname);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100">
      <Sidebar
        active={active}
        setActive={() => {}}
        open={menuOpen}
        onClose={closeMenu}
      />

      <main className="min-h-screen min-w-0 lg:ml-[270px]">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-800/80 bg-[#070b12]/90 px-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open navigation"
              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white lg:hidden"
            >
              <Menu size={19} />
            </button>
            <span className="text-sm font-medium text-slate-500">Throttle Trade</span>
            <ChevronRight size={14} className="text-slate-700" />
            <span className="text-sm font-semibold text-slate-200">{active}</span>
          </div>
          <a href="mailto:support@throttle.trade" className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-emerald-300">
            <CircleHelp size={15} />
            Help
          </a>
        </header>
        <div className="mx-auto w-full min-w-0 max-w-[1800px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
