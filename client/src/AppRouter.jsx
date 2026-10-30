
import { Navigate, Route, Routes } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import StockDetailPage from "./pages/StockDetailPage";
import MarketsPage from "./pages/MarketsPage";
import OverviewPage from "./pages/OverviewPage";
import TradePage from "./pages/TradePage";
import PortfolioPage from "./pages/PortfolioPage";
import WatchlistPage from "./pages/WatchlistPage";

import TradingLayout from "./components/layout/TradingLayout";
import ProtectedRoute from "./components/layout/ProtectedRoute";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      <Route element={<TradingLayout />}>
        {/* Public market browsing */}
        <Route path="/markets" element={<MarketsPage />} />
        <Route path="/markets/:symbol" element={<StockDetailPage />} />

        {/* Signed-in paper trading workspace */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<OverviewPage />} />
          <Route path="/trade" element={<TradePage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/watchlist" element={<WatchlistPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
