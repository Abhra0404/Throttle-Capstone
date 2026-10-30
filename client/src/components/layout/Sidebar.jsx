
import {
  Activity,
  ArrowLeftRight,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  LayoutDashboard,
  LogOut,
  Star,
  Wallet,
  X,
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { usePortfolio } from "../../context/PortfolioContext";

const navigation = [
  { label: "Overview", icon: LayoutDashboard, to: "/dashboard" },
  { label: "Markets", icon: ChartNoAxesCombined, to: "/markets" },
  { label: "Buy / Sell", icon: ArrowLeftRight, to: "/trade" },
  { label: "Portfolio", icon: BriefcaseBusiness, to: "/portfolio" },
  { label: "Watchlist", icon: Star, to: "/watchlist" },
];

function Brand() {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-400 text-slate-950 shadow-md shadow-emerald-950/20">
        <Activity size={19} strokeWidth={2.5} />
      </div>

      <div className="min-w-0">
        <div className="text-[17px] font-bold tracking-tight text-white">
          throttle<span className="text-emerald-400">.</span>
        </div>
        <div className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.17em] text-slate-500">
          Trade terminal
        </div>
      </div>
    </div>
  );
}

export default function Sidebar({ open, onClose, setActive }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cash } = usePortfolio();

  const formatINR = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(value) || 0);

  const initials = user?.name
    ? user.name
        .split(" ")
        .filter(Boolean)
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "TT";

  function handleLogout() {
    logout();
    onClose?.();
    navigate("/", { replace: true });
  }

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px] lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        aria-label="Main sidebar"
        className={`fixed inset-y-0 left-0 z-50 flex w-[250px] flex-col border-r border-slate-800/80 bg-[#090e19] text-slate-300 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="flex h-[68px] shrink-0 items-center justify-between border-b border-slate-800/70 px-4">
          <Brand />

          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/40 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav
          aria-label="Primary navigation"
          className="flex-1 space-y-5 overflow-y-auto px-3 py-5"
        >
          <div>
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-600">
              Workspace
            </p>

            <div className="space-y-1">
              {navigation.map(({ label, icon: Icon, to }) => {
                const active =
                  to === "/markets"
                    ? location.pathname === "/markets" ||
                      location.pathname.startsWith("/markets/")
                    : location.pathname === to ||
                      (to === "/dashboard" &&
                        location.pathname === "/");

                return (
                  <NavLink
                    key={to}
                    to={to}
                    end
                    onClick={() => {
                      setActive?.(label);
                      onClose?.();
                    }}
                    aria-current={active ? "page" : undefined}
                    className={`group relative flex min-h-10 items-center gap-3 rounded-lg px-3 text-[12px] font-medium transition-colors duration-150 ${
                      active
                        ? "bg-emerald-400/[0.09] text-emerald-300"
                        : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
                    }`}
                  >
                    {active && (
                      <span
                        aria-hidden="true"
                        className="absolute bottom-2 left-0 top-2 w-[2px] rounded-r-full bg-emerald-400"
                      />
                    )}

                    <Icon
                      size={17}
                      strokeWidth={active ? 2.1 : 1.8}
                      className={`shrink-0 transition-colors ${
                        active
                          ? "text-emerald-300"
                          : "text-slate-500 group-hover:text-slate-300"
                      }`}
                    />

                    <span className="flex-1">{label}</span>

                    {active && (
                      <span
                        aria-hidden="true"
                        className="h-1.5 w-1.5 rounded-full bg-emerald-400"
                      />
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>

          {/* Paper account */}
          <div className="px-1">
            <div className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-600">
              Account
            </div>

            <div className="rounded-xl border border-slate-800/80 bg-[#0c1220] p-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-400/10 text-sky-300">
                  <Wallet size={16} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-[11px] text-slate-500">
                    Available cash
                  </p>
                  <p className="mt-0.5 truncate text-[13px] font-semibold tabular-nums text-slate-100">
                    {formatINR(cash)}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-slate-800/80 pt-2.5">
                <span className="text-[10px] text-slate-500">
                  Virtual funds
                </span>

                <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Demo active
                </span>
              </div>
            </div>
          </div>
        </nav>

        {/* User profile and logout */}
        <div className="shrink-0 border-t border-slate-800/80 p-3">
          <div className="flex items-center gap-2.5 rounded-xl p-2 transition hover:bg-slate-800/40">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10 text-[11px] font-bold text-emerald-300">
              {initials}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-slate-200">
                {user?.name || "Trader account"}
              </p>
              <p className="mt-0.5 truncate text-[10px] text-slate-500">
                {user?.email || "Paper trading"}
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              aria-label="Log out"
              title="Log out"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-rose-400/10 hover:text-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-400/40"
            >
              <LogOut size={16} />
            </button>
          </div>

          <p className="mt-2 px-2 text-[9px] text-slate-600">
            Throttle Trade · Demo environment
          </p>
        </div>
      </aside>
    </>
  );
}
