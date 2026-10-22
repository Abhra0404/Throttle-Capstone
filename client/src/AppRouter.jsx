import { Navigate, Route, Routes } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import MarketsPage from "./pages/MarketsPage";
import StockDetailPage from "./pages/StockDetailPage";
import App from "./App";

function StockDetailPlaceholder() {
  return (
    <div className="min-h-screen bg-stone-50 p-8">
      <h1 className="text-2xl font-bold text-stone-900">Stock Details</h1>
      <p className="mt-2 text-stone-600">
        The stock detail page is coming soon.
      </p>
    </div>
  );
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/dashboard" element={<App />} />
      <Route path="/markets" element={<MarketsPage />} />
      <Route path="/markets/:symbol" element={<StockDetailPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
