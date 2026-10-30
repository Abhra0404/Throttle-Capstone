
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AuthPage({ mode = "login" }) {
  const isSignup = mode === "signup";
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    if (isSignup && name.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (isSignup) {
      signup(name, normalizedEmail);
    } else {
      login(normalizedEmail);
    }

    const destination =
      location.state?.from?.pathname
        ? `${location.state.from.pathname}${location.state.from.search || ""}${location.state.from.hash || ""}`
        : "/dashboard";

    navigate(destination, { replace: true });
  }

  return (
    <main className="min-h-screen bg-white text-[#17211b] lg:grid lg:grid-cols-2">
      <section className="relative hidden min-h-screen flex-col justify-between overflow-hidden border-r border-[#e8eee9] p-10 lg:flex xl:p-14">
        <Link to="/" className="relative flex w-fit items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#dff8e8] text-[#087a42]">
            <Activity size={23} />
          </div>
          <span className="text-2xl font-bold tracking-tight">
            throttle<span className="text-[#078447]">.</span>
          </span>
        </Link>

        <div className="relative my-12 max-w-xl">
          <span className="inline-flex rounded-full border border-[#dcebe1] bg-[#f4fbf6] px-3 py-2 text-xs font-semibold text-[#087a42]">
            PAPER TRADING, WITHOUT THE RISK
          </span>

          <h1 className="mt-6 text-5xl font-semibold leading-[1.12] tracking-tight xl:text-6xl">
            Learn the market.
            <br />
            <span className="text-[#078447]">Build your edge.</span>
          </h1>

          <p className="mt-6 max-w-md text-base leading-7 text-[#68766d]">
            Explore Indian equities, practise trading strategies, and
            understand your portfolio with virtual money.
          </p>

          <div className="mt-9 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-[#e7eee9] p-4">
              <p className="text-sm text-[#68766d]">Virtual starting cash</p>
              <p className="mt-2 text-xl font-semibold">₹5,00,000</p>
            </div>
            <div className="rounded-2xl border border-[#e7eee9] p-4">
              <p className="text-sm text-[#68766d]">Real money at risk</p>
              <p className="mt-2 text-xl font-semibold">₹0</p>
            </div>
          </div>
        </div>

        <p className="text-xs text-[#8a978e]">
          Educational simulation only. Market data is illustrative.
        </p>
      </section>

      <section className="flex min-h-screen items-center justify-center bg-[#101713] px-5 py-12 text-white sm:px-10">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="mb-10 inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-white lg:hidden"
          >
            <Activity size={19} className="text-emerald-400" />
            throttle.
          </Link>

          <p className="text-sm font-medium text-emerald-400">
            {isSignup ? "CREATE YOUR ACCOUNT" : "WELCOME BACK"}
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            {isSignup ? "Start practising." : "Sign in to Throttle."}
          </h2>

          <p className="mt-3 text-sm leading-6 text-white/55">
            {isSignup
              ? "Create your demo account to start building your paper portfolio."
              : "Continue to your paper-trading workspace."}
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {isSignup && (
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium">
                  Full name
                </label>
                <div className="relative">
                  <UserRound
                    size={17}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35"
                  />
                  <input
                    id="name"
                    autoComplete="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Your name"
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-10 pr-3 text-sm outline-none transition placeholder:text-white/30 focus:border-emerald-400"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium">
                Email address
              </label>
              <div className="relative">
                <Mail
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35"
                />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-10 pr-3 text-sm outline-none transition placeholder:text-white/30 focus:border-emerald-400"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <LockKeyhole
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35"
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={isSignup ? "new-password" : "current-password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="At least 8 characters"
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-10 pr-12 text-sm outline-none transition placeholder:text-white/30 focus:border-emerald-400"
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/45 hover:text-white"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {error && (
              <p role="alert" className="rounded-xl bg-rose-500/10 p-3 text-sm text-rose-300">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 text-sm font-semibold text-[#07150d] transition hover:bg-emerald-400"
            >
              {isSignup ? "Create demo account" : "Continue to dashboard"}
              <ArrowRight size={17} />
            </button>

            <p className="text-center text-xs leading-5 text-white/40">
              Demo access only. This form does not verify credentials against
              a server.
            </p>
          </form>

          <p className="mt-7 text-center text-sm text-white/55">
            {isSignup ? "Already have a demo account?" : "New to Throttle?"}{" "}
            <Link
              to={isSignup ? "/login" : "/signup"}
              className="font-semibold text-emerald-400 hover:text-emerald-300"
            >
              {isSignup ? "Sign in" : "Create an account"}
            </Link>
          </p>

          <Link
            to="/markets"
            className="mt-8 flex items-center justify-center text-sm text-white/45 transition hover:text-white/80"
          >
            Explore markets first
          </Link>
        </div>
      </section>
    </main>
  );
}
