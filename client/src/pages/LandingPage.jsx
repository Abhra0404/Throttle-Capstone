
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  ChartNoAxesCombined,
  ShieldCheck,
  Wallet,
  Zap,
} from "lucide-react";

const marketData = [
  { symbol: "NIFTY 50", value: "24,812.05", change: "+0.84%", positive: true },
  { symbol: "SENSEX", value: "81,330.56", change: "+0.62%", positive: true },
  { symbol: "BANK NIFTY", value: "54,219.80", change: "-0.21%", positive: false },
];

// const sampleStocks = [
//   { symbol: "RELIANCE", name: "Reliance Industries", price: "₹1,462.30", change: "+1.42%", positive: true },
//   { symbol: "TCS", name: "Tata Consultancy Services", price: "₹3,284.50", change: "+0.86%", positive: true },
//   { symbol: "INFY", name: "Infosys Limited", price: "₹1,548.20", change: "-0.34%", positive: false },
// ];

const features = [
  {
    icon: ChartNoAxesCombined,
    title: "Track the market",
    description:
      "Explore Indian equities, review price movements, and follow the stocks that matter to you.",
  },
  {
    icon: Zap,
    title: "Practice trading",
    description:
      "Place simulated trades and learn how orders, positions, and portfolio values work.",
  },
  {
    icon: ShieldCheck,
    title: "Learn without risk",
    description:
      "Experiment with virtual money instead of putting your real capital on the line.",
  },
];

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white">
        <ChartNoAxesCombined size={21} />
      </div>
      <span className="text-lg font-bold tracking-tight text-stone-900">
        Throttle<span className="text-emerald-600">Trade</span>
      </span>
    </Link>
  );
}

function MiniChart() {
  return (
    <svg
      viewBox="0 0 500 190"
      className="h-full w-full"
      role="img"
      aria-label="Illustrative stock price chart"
    >
      {[35, 75, 115, 155].map((y) => (
        <line
          key={y}
          x1="0"
          y1={y}
          x2="500"
          y2={y}
          stroke="#e7e5e4"
          strokeDasharray="4 5"
        />
      ))}
      <defs>
        <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#059669" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#059669" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M0,145 L30,128 L58,139 L85,100 L110,112 L140,85 L165,99 L194,66 L222,82 L251,54 L280,73 L310,42 L338,58 L367,32 L395,49 L425,20 L453,35 L480,12 L500,18 L500,190 L0,190 Z"
        fill="url(#chartFill)"
      />
      <path
        d="M0,145 L30,128 L58,139 L85,100 L110,112 L140,85 L165,99 L194,66 L222,82 L251,54 L280,73 L310,42 L338,58 L367,32 L395,49 L425,20 L453,35 L480,12 L500,18"
        fill="none"
        stroke="#059669"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="480" cy="12" r="5" fill="#059669" />
    </svg>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-stone-50 text-stone-900">
      <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-stone-50/90 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Logo />

          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm font-medium text-stone-600 transition hover:text-emerald-700">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-stone-600 transition hover:text-emerald-700">
              How it works
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-stone-700 transition hover:bg-stone-200/70 sm:inline-flex"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              Get started <ArrowRight size={16} />
            </Link>
          </div>
        </nav>
      </header>

      <main>
        <section className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-2 lg:gap-16 lg:py-28">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-sm font-medium text-emerald-800">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Your trading journey starts here
            </div>

            <h1 className="max-w-2xl text-4xl font-bold leading-[1.12] tracking-tight text-stone-950 sm:text-5xl lg:text-6xl">
              Learn the market.
              <span className="mt-2 block text-emerald-600">
                Trade with confidence.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-stone-600 sm:text-lg">
              Explore Indian stocks, build your portfolio, and practice trading
              with virtual money. Learn by doing, without risking real capital.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/15 transition hover:-translate-y-0.5 hover:bg-emerald-700"
              >
                Start paper trading <ArrowRight size={17} />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-xl border border-stone-300 bg-white px-6 py-3.5 text-sm font-semibold text-stone-700 transition hover:border-stone-400 hover:bg-stone-100"
              >
                Explore features
              </a>
            </div>

            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-stone-500">
              <span className="flex items-center gap-2">
                <ShieldCheck size={17} className="text-emerald-600" />
                Virtual money
              </span>
              <span className="flex items-center gap-2">
                <ChartNoAxesCombined size={17} className="text-emerald-600" />
                Indian equities
              </span>
              <span className="flex items-center gap-2">
                <Wallet size={17} className="text-emerald-600" />
                Portfolio tracking
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-5 rounded-[2rem] bg-emerald-100/60 blur-3xl" />
            <div className="relative rounded-3xl border border-stone-200 bg-white p-5 shadow-2xl shadow-stone-300/30 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-stone-500">
                    Portfolio value
                  </p>
                  <p className="mt-2 text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl">
                    ₹10,24,850
                  </p>
                  <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
                    <ArrowUpRight size={17} />
                    +₹24,850 (2.48%)
                  </p>
                </div>
                <span className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                  DEMO DATA
                </span>
              </div>

              <div className="mt-7 h-48 sm:h-56">
                <MiniChart />
              </div>

              <div className="mt-3 flex justify-between border-t border-stone-100 pt-4 text-xs font-medium text-stone-400">
                <span>9:30 AM</span>
                <span>11:00 AM</span>
                <span>12:30 PM</span>
                <span>2:00 PM</span>
                <span>3:30 PM</span>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-stone-50 p-4">
                  <p className="text-xs text-stone-500">Virtual balance</p>
                  <p className="mt-1.5 text-lg font-bold text-stone-900">₹5,00,000</p>
                </div>
                <div className="rounded-2xl bg-emerald-50 p-4">
                  <p className="text-xs text-emerald-700">Today's return</p>
                  <p className="mt-1.5 text-lg font-bold text-emerald-800">+₹4,250</p>
                </div>
              </div>

              <p className="mt-4 text-center text-xs text-stone-400">
                Illustrative portfolio · Not live market data
              </p>
            </div>
          </div>
        </section>

        <section className="border-y border-stone-200 bg-white">
          <div className="mx-auto max-w-7xl px-5 py-7 sm:px-8">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold text-stone-700">
                Explore the market
              </p>
              <span className="text-xs text-stone-400">Illustrative sample prices</span>
            </div>
            <div className="grid gap-5 sm:grid-cols-3 sm:gap-8">
              {marketData.map((item) => (
                <div key={item.symbol} className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium text-stone-500">{item.symbol}</p>
                    <p className="mt-1 text-lg font-bold text-stone-900">{item.value}</p>
                  </div>
                  <span className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold ${item.positive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                    {item.change}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">
              Built for learning
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl">
              A smarter way to practice trading
            </h2>
            <p className="mt-4 leading-7 text-stone-600">
              Get comfortable with market concepts using a simple, approachable
              paper-trading experience.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {features.map(({ icon: Icon, title, description }, index) => (
              <article
                key={title}
                className="rounded-2xl border border-stone-200 bg-white p-7 transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-stone-200/50"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                  <Icon size={23} />
                </div>
                <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-stone-400">
                  0{index + 1}
                </p>
                <h3 className="mt-2 text-xl font-bold text-stone-900">{title}</h3>
                <p className="mt-3 leading-7 text-stone-600">{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="border-y border-stone-200 bg-white">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">
                  Getting started
                </p>
                <h2 className="mt-4 text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl">
                  From curious to confident, one trade at a time.
                </h2>
                <p className="mt-5 max-w-xl leading-7 text-stone-600">
                  Practice the process, understand your decisions, and learn how
                  your portfolio responds to market movements.
                </p>
                <Link
                  to="/signup"
                  className="mt-7 inline-flex items-center gap-2 font-semibold text-emerald-700 hover:text-emerald-800"
                >
                  Create your account <ArrowRight size={17} />
                </Link>
              </div>

              <div className="space-y-4">
                {[
                  ["01", "Create your account", "Start with a simple sign-up flow."],
                  ["02", "Explore Indian stocks", "Search, sort, and inspect stock details."],
                  ["03", "Place simulated trades", "Use virtual funds to practice buying and selling."],
                ].map(([number, title, description]) => (
                  <div key={number} className="flex gap-5 rounded-2xl border border-stone-200 p-5">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-sm font-bold text-emerald-700">
                      {number}
                    </span>
                    <div>
                      <h3 className="font-bold text-stone-900">{title}</h3>
                      <p className="mt-1 text-sm leading-6 text-stone-600">{description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="relative overflow-hidden rounded-3xl bg-stone-950 px-7 py-12 text-center sm:px-14 sm:py-16">
            <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />
            <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-emerald-700/20 blur-3xl" />
            <div className="relative">
              <p className="text-sm font-semibold uppercase tracking-widest text-emerald-400">
                Your next step
              </p>
              <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Make your first move. Without risking your money.
              </h2>
              <p className="mx-auto mt-4 max-w-xl leading-7 text-stone-300">
                Build your confidence with a virtual portfolio and simulated trades.
              </p>
              <Link
                to="/signup"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-emerald-400"
              >
                Get started for free <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-7 text-sm text-stone-500 sm:px-8 md:flex-row md:items-center md:justify-between">
          <Logo />
          <p>Paper trading for learning purposes. Sample data is illustrative.</p>
          <p>© {new Date().getFullYear()} Throttle Trade</p>
        </div>
      </footer>
    </div>
  );
}
