
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ChartNoAxesCombined,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";

export default function AuthPage({ mode = "login" }) {
  const isSignup = mode === "signup";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    // UI only: backend authentication will be connected later.
    setMessage(
      isSignup
        ? "Signup UI is working. Backend authentication is not connected yet."
        : "Login UI is working. Backend authentication is not connected yet."
    );
  }

  return (
    <main className="grid min-h-screen bg-white lg:grid-cols-2">
      {/* LEFT PANEL — LIGHT THEME */}
      <section className="relative hidden min-h-screen overflow-hidden bg-stone-50 p-10 lg:flex lg:flex-col lg:justify-between xl:p-14">
        <Link to="/" className="flex w-fit items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white">
            <ChartNoAxesCombined size={22} />
          </span>

          <span className="text-xl font-bold tracking-tight text-stone-900">
            Throttle<span className="text-emerald-600">Trade</span>
          </span>
        </Link>

        <div className="relative z-10 max-w-lg">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            YOUR PRACTICE TRADING PLATFORM
          </span>

          <h1 className="mt-7 text-4xl font-bold leading-tight tracking-tight text-stone-950 xl:text-5xl">
            Learn the market.
            <span className="mt-2 block text-emerald-600">
              Practice with confidence.
            </span>
          </h1>

          <p className="mt-5 max-w-md text-base leading-7 text-stone-600">
            Explore Indian equities, practice trading with virtual funds, and
            understand your portfolio without risking real money.
          </p>

          <div className="mt-10 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-stone-500">
                Sample portfolio
              </span>

              <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                DEMO
              </span>
            </div>

            <p className="mt-3 text-3xl font-bold tracking-tight text-stone-950">
              ₹10,24,850
            </p>

            <p className="mt-2 text-sm font-semibold text-emerald-700">
              +2.48% sample return
            </p>

            <div className="mt-5 flex h-20 items-end gap-2">
              {[30, 44, 36, 55, 45, 64, 52, 72, 60, 82, 69, 95].map(
                (height, index) => (
                  <div
                    key={index}
                    className="flex-1 rounded-t-sm bg-emerald-500/80"
                    style={{ height: `${height}%` }}
                  />
                )
              )}
            </div>

            <p className="mt-3 text-xs text-stone-400">
              Illustrative data, not live market prices.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-stone-500">
          <ShieldCheck size={17} className="text-emerald-600" />
          Practice trading without risking real capital.
        </div>

        <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-emerald-100/70 blur-3xl" />
      </section>

      {/* RIGHT PANEL — DARK THEME */}
      <section className="flex min-h-screen flex-col bg-[#111713] px-6 py-6 text-stone-100 sm:px-10 lg:px-14 xl:px-20">
        {/* Top navigation */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-stone-400 transition hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to home
          </Link>

          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2 lg:hidden">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
              <ChartNoAxesCombined size={18} />
            </span>

            <span className="font-bold text-white">
              Throttle<span className="text-emerald-400">Trade</span>
            </span>
          </Link>
        </div>

        {/* Authentication form */}
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12">
          <div className="mb-8">
            <p className="text-sm font-semibold tracking-wider text-emerald-400">
              {isSignup ? "GET STARTED" : "WELCOME BACK"}
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {isSignup ? "Create your account" : "Welcome back"}
            </h2>

            <p className="mt-3 leading-6 text-stone-400">
              {isSignup
                ? "Set up your account and start exploring paper trading."
                : "Log in to continue your paper-trading journey."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name — signup only */}
            {isSignup && (
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-stone-300"
                >
                  Full name
                </label>

                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  className="w-full rounded-xl border border-[#354139] bg-[#1a221d] px-4 py-3 text-sm text-white outline-none transition placeholder:text-stone-500 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-stone-300"
              >
                Email address
              </label>

              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="w-full rounded-xl border border-[#354139] bg-[#1a221d] px-4 py-3 text-sm text-white outline-none transition placeholder:text-stone-500 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              />
            </div>

            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-stone-300"
                >
                  Password
                </label>

                {!isSignup && (
                  <button
                    type="button"
                    onClick={() =>
                      setMessage(
                        "Password reset will be added with backend authentication."
                      )
                    }
                    className="text-xs font-semibold text-emerald-400 transition hover:text-emerald-300"
                  >
                    Forgot password?
                  </button>
                )}
              </div>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={
                    isSignup ? "new-password" : "current-password"
                  }
                  placeholder={
                    isSignup ? "Create a password" : "Enter your password"
                  }
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  minLength={8}
                  required
                  className="w-full rounded-xl border border-[#354139] bg-[#1a221d] px-4 py-3 pr-12 text-sm text-white outline-none transition placeholder:text-stone-500 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((previous) => !previous)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-stone-500 transition hover:text-stone-200"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              {isSignup && (
                <p className="mt-2 text-xs text-stone-500">
                  Use at least 8 characters.
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-950/30 transition hover:bg-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/20"
            >
              {isSignup ? "Create account" : "Log in"}
              <ArrowRight size={17} />
            </button>
          </form>

          {/* Feedback */}
          {message && (
            <p
              role="status"
              className="mt-5 rounded-xl border border-emerald-800 bg-emerald-950/60 p-3 text-sm leading-6 text-emerald-300"
            >
              {message}
            </p>
          )}

          {/* Login/signup switch */}
          <p className="mt-7 text-center text-sm text-stone-400">
            {isSignup
              ? "Already have an account?"
              : "New to Throttle Trade?"}{" "}
            <Link
              to={isSignup ? "/login" : "/signup"}
              className="font-semibold text-emerald-400 transition hover:text-emerald-300"
            >
              {isSignup ? "Log in" : "Create an account"}
            </Link>
          </p>

          <p className="mt-8 text-center text-xs leading-5 text-stone-500">
            Throttle Trade is a paper-trading platform. Prices and portfolio
            figures shown in sample views are illustrative.
          </p>
        </div>
      </section>
    </main>
  );
}
