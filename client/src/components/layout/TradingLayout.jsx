
import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
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

        <div className="mx-auto w-full min-w-0 max-w-[1800px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
