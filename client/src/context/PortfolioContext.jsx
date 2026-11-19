/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
/* eslint-disable react-hooks/set-state-in-effect */
import api from "../services/api";
import { useAuth } from "./AuthContext";

const PortfolioContext = createContext(null);

const WATCHLIST_STORAGE_KEY = "throttle-watchlist-v1";
const DEFAULT_WATCHLIST = ["RELIANCE", "TCS"];

const emptyPortfolio = {
  cashBalance: 0,
  holdings: [],
  realizedPnl: 0,
  totalInvested: 0,
  marketValue: 0,
  totalValue: 0,
  unrealizedPnl: 0,
  totalPnl: 0,
  totalPnlPercent: 0,
};

function readWatchlist(key) {
  try {
    const saved = localStorage.getItem(key);
    if (saved === null) return DEFAULT_WATCHLIST;

    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? [...new Set(parsed)] : DEFAULT_WATCHLIST;
  } catch {
    return DEFAULT_WATCHLIST;
  }
}

function getErrorMessage(error) {
  return (
    error.response?.data?.message ||
    (error.request
      ? "Unable to reach the trading service. Check your connection and try again."
      : error.message) ||
    "Something went wrong. Please try again."
  );
}

function normalizeHolding(holding) {
  return {
    ...holding,
    quantity: Number(holding.quantity) || 0,
    averagePrice: Number(holding.averagePrice) || 0,
    currentPrice: Number(holding.currentPrice) || 0,
    invested: Number(holding.invested) || 0,
    currentValue: Number(holding.currentValue) || 0,
    unrealizedPnl: Number(holding.unrealizedPnl) || 0,
  };
}

function normalizeOrder(order) {
  return {
    ...order,
    symbol: order.symbol || order.stock?.symbol,
    name: order.name || order.stock?.name,
    quantity: Number(order.quantity) || 0,
    price: Number(order.price) || 0,
    total: Number(order.total) || 0,
    realizedPnl: Number(order.realizedPnl) || 0,
  };
}

export function PortfolioProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [portfolio, setPortfolio] = useState(emptyPortfolio);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTrading, setIsTrading] = useState(false);
  const [error, setError] = useState("");

  const [watchlist, setWatchlist] = useState(() =>
    user?.id
      ? readWatchlist(`${WATCHLIST_STORAGE_KEY}:${user.id}`)
      : DEFAULT_WATCHLIST,
  );
  const [watchlistOwner, setWatchlistOwner] = useState(user?.id || null);

  useEffect(() => {
    if (!user?.id) {
      setWatchlist(DEFAULT_WATCHLIST);
      setWatchlistOwner(null);
      return;
    }

    setWatchlist(
      readWatchlist(`${WATCHLIST_STORAGE_KEY}:${user.id}`),
    );
    setWatchlistOwner(user.id);
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id || watchlistOwner !== user.id) return;

    try {
      localStorage.setItem(
        `${WATCHLIST_STORAGE_KEY}:${user.id}`,
        JSON.stringify(watchlist),
      );
    } catch (error) {
      console.error("Could not save watchlist:", error);
    }
  }, [watchlist, user?.id, watchlistOwner]);

  const refreshPortfolio = useCallback(async () => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    setError("");

    try {
      const [portfolioResponse, ordersResponse] = await Promise.all([
        api.get("/trading/portfolio"),
        api.get("/trading/orders", { params: { page: 1, limit: 100 } }),
      ]);

      const serverPortfolio = portfolioResponse.data.data.portfolio;
      const serverOrders = ordersResponse.data.data.orders;

      setPortfolio({
        ...emptyPortfolio,
        ...serverPortfolio,
        cashBalance: Number(serverPortfolio.cashBalance) || 0,
        totalInvested: Number(serverPortfolio.totalInvested) || 0,
        marketValue: Number(serverPortfolio.marketValue) || 0,
        totalValue: Number(serverPortfolio.totalValue) || 0,
        realizedPnl: Number(serverPortfolio.realizedPnl) || 0,
        unrealizedPnl: Number(serverPortfolio.unrealizedPnl) || 0,
        totalPnl: Number(serverPortfolio.totalPnl) || 0,
        totalPnlPercent: Number(serverPortfolio.totalPnlPercent) || 0,
        holdings: (serverPortfolio.holdings || []).map(normalizeHolding),
      });
      setOrders((serverOrders || []).map(normalizeOrder));
      return true;
    } catch (requestError) {
      setError(getErrorMessage(requestError));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      setPortfolio(emptyPortfolio);
      setOrders([]);
      setError("");
      return;
    }

    void refreshPortfolio();
  }, [isAuthenticated, user?.id, refreshPortfolio]);

  useEffect(() => {
    const clearPortfolio = () => {
      setPortfolio(emptyPortfolio);
      setOrders([]);
      setError("");
    };

    window.addEventListener("throttle:unauthorized", clearPortfolio);
    return () =>
      window.removeEventListener("throttle:unauthorized", clearPortfolio);
  }, []);

  const addToWatchlist = useCallback((symbol) => {
    const normalized = String(symbol || "").toUpperCase();
    if (!normalized) return;

    setWatchlist((current) =>
      current.includes(normalized) ? current : [...current, normalized],
    );
  }, []);

  const removeFromWatchlist = useCallback((symbol) => {
    setWatchlist((current) => current.filter((item) => item !== symbol));
  }, []);

  const toggleWatchlist = useCallback((symbol) => {
    const normalized = String(symbol || "").toUpperCase();
    if (!normalized) return;

    setWatchlist((current) =>
      current.includes(normalized)
        ? current.filter((item) => item !== normalized)
        : [...current, normalized],
    );
  }, []);

  const executeTrade = useCallback(
    async ({ symbol, side, quantity }) => {
      const normalizedSymbol = String(symbol || "").trim().toUpperCase();
      const normalizedSide = String(side || "").trim().toUpperCase();
      const qty = Number(quantity);

      if (!normalizedSymbol) {
        return { success: false, message: "Invalid stock symbol." };
      }
      if (!["BUY", "SELL"].includes(normalizedSide)) {
        return { success: false, message: "Select buy or sell." };
      }
      if (!Number.isSafeInteger(qty) || qty <= 0) {
        return {
          success: false,
          message: "Quantity must be a positive whole number.",
        };
      }
      if (isTrading) return { success: false, message: "Order is processing." };

      setIsTrading(true);
      setError("");

      try {
        const response = await api.post("/trading/orders", {
          symbol: normalizedSymbol,
          side: normalizedSide,
          quantity: qty,
        });

        await refreshPortfolio();
        return {
          success: true,
          message:
            response.data.message ||
            `${normalizedSide} order executed successfully.`,
          order: response.data.data.order,
        };
      } catch (requestError) {
        const message = getErrorMessage(requestError);
        setError(message);
        return { success: false, message };
      } finally {
        setIsTrading(false);
      }
    },
    [isTrading, refreshPortfolio],
  );

  const value = {
    cash: portfolio.cashBalance,
    holdings: portfolio.holdings,
    orders,
    realizedPnL: portfolio.realizedPnl,
    holdingsValue: portfolio.marketValue,
    investedValue: portfolio.totalInvested,
    unrealizedPnL: portfolio.unrealizedPnl,
    totalPnL: portfolio.totalPnl,
    totalPortfolioValue: portfolio.totalValue,
    isLoading,
    isTrading,
    error,
    executeTrade,
    refreshPortfolio,
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    toggleWatchlist,
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);

  if (!context) {
    throw new Error("usePortfolio must be used inside a PortfolioProvider.");
  }

  return context;
}
