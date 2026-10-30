import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { holdings as initialHoldings } from "../data/mockData";

const PortfolioContext = createContext(null);

const INITIAL_CASH = 500000;
const STORAGE_KEY = "throttle-portfolio-v1";
const WATCHLIST_STORAGE_KEY = "throttle-watchlist-v1";
const DEFAULT_WATCHLIST = ["RELIANCE", "TCS"];

function createInitialPortfolio() {
  const startingHoldings = initialHoldings.map((holding) => ({
    symbol: holding.symbol,
    name: holding.name,
    quantity: Number(holding.quantity) || 0,
    averagePrice: Number(holding.averagePrice) || 0,
    currentPrice: Number(holding.currentPrice) || 0,
  }));

  return {
    cash: INITIAL_CASH,
    holdings: startingHoldings,
    orders: [],
    realizedPnL: 0,
  };
}

function loadPortfolio() {
  if (typeof window === "undefined") {
    return createInitialPortfolio();
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const parsed = JSON.parse(saved);

      if (
        typeof parsed.cash === "number" &&
        Array.isArray(parsed.holdings) &&
        Array.isArray(parsed.orders)
      ) {
        return {
          cash: parsed.cash,
          holdings: parsed.holdings,
          orders: parsed.orders,
          realizedPnL: Number(parsed.realizedPnL) || 0,
        };
      }
    }
  } catch (error) {
    console.error("Could not load portfolio:", error);
  }

  return createInitialPortfolio();
}

export function PortfolioProvider({ children }) {
  const [portfolio, setPortfolio] = useState(loadPortfolio);

  const [watchlist, setWatchlist] = useState(() => {
    try {
      const saved = localStorage.getItem(WATCHLIST_STORAGE_KEY);

      if (saved === null) return DEFAULT_WATCHLIST;

      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? [...new Set(parsed)] : DEFAULT_WATCHLIST;
    } catch {
      return DEFAULT_WATCHLIST;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(watchlist));
    } catch (error) {
      console.error("Could not save watchlist:", error);
    }
  }, [watchlist]);

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

  // Keep the latest portfolio available to trade handlers immediately.
  const portfolioRef = useRef(portfolio);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          cash: portfolio.cash,
          holdings: portfolio.holdings,
          orders: portfolio.orders,
          realizedPnL: portfolio.realizedPnL,
        }),
      );
    } catch (error) {
      console.error("Could not save portfolio:", error);
    }
  }, [portfolio]);

  const commitPortfolio = useCallback((nextPortfolio) => {
    portfolioRef.current = nextPortfolio;
    setPortfolio(nextPortfolio);
  }, []);

  const executeTrade = useCallback(
    ({ symbol, name, side, quantity, price }) => {
      const normalizedSide = String(side || "").toLowerCase();
      const normalizedSymbol = String(symbol || "").toUpperCase();
      const qty = Number(quantity);
      const tradePrice = Number(price);

      if (!normalizedSymbol) {
        return { success: false, message: "Invalid stock symbol." };
      }

      if (!["buy", "sell"].includes(normalizedSide)) {
        return { success: false, message: "Select buy or sell." };
      }

      if (!Number.isSafeInteger(qty) || qty <= 0) {
        return {
          success: false,
          message: "Quantity must be a positive whole number.",
        };
      }

      if (!Number.isFinite(tradePrice) || tradePrice <= 0) {
        return { success: false, message: "Invalid stock price." };
      }

      const total = qty * tradePrice;

      if (!Number.isFinite(total)) {
        return { success: false, message: "Invalid order value." };
      }

      // Always use the most recently committed portfolio.
      const current = portfolioRef.current;

      const existingHolding = current.holdings.find(
        (holding) => holding.symbol.toUpperCase() === normalizedSymbol,
      );

      if (normalizedSide === "buy" && total > current.cash) {
        return {
          success: false,
          message: "Insufficient virtual cash for this order.",
        };
      }

      if (
        normalizedSide === "sell" &&
        (!existingHolding || existingHolding.quantity < qty)
      ) {
        return {
          success: false,
          message: "You do not own enough shares to sell.",
        };
      }

      const updatedHoldings = current.holdings.map((holding) => ({
        ...holding,
      }));

      const holdingIndex = updatedHoldings.findIndex(
        (holding) => holding.symbol.toUpperCase() === normalizedSymbol,
      );

      let updatedCash = current.cash;
      let updatedRealizedPnL = current.realizedPnL;

      if (normalizedSide === "buy") {
        updatedCash -= total;

        if (holdingIndex >= 0) {
          const holding = updatedHoldings[holdingIndex];
          const newQuantity = holding.quantity + qty;

          holding.averagePrice =
            (holding.quantity * holding.averagePrice + total) / newQuantity;

          holding.quantity = newQuantity;
          holding.currentPrice = tradePrice;
          holding.name = name || holding.name;
        } else {
          updatedHoldings.push({
            symbol: normalizedSymbol,
            name: name || normalizedSymbol,
            quantity: qty,
            averagePrice: tradePrice,
            currentPrice: tradePrice,
          });
        }
      } else {
        const holding = updatedHoldings[holdingIndex];

        updatedCash += total;
        updatedRealizedPnL += (tradePrice - holding.averagePrice) * qty;

        holding.quantity -= qty;
        holding.currentPrice = tradePrice;

        if (holding.quantity === 0) {
          updatedHoldings.splice(holdingIndex, 1);
        }
      }

      const order = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        symbol: normalizedSymbol,
        name: name || normalizedSymbol,
        side: normalizedSide,
        quantity: qty,
        price: tradePrice,
        total,
        timestamp: new Date().toISOString(),
        status: "Executed",
      };

      const nextPortfolio = {
        ...current,
        cash: updatedCash,
        holdings: updatedHoldings,
        orders: [order, ...current.orders],
        realizedPnL: updatedRealizedPnL,
      };

      commitPortfolio(nextPortfolio);

      return {
        success: true,
        message: `${normalizedSide === "buy" ? "Bought" : "Sold"} ${qty} share${
          qty === 1 ? "" : "s"
        } of ${normalizedSymbol}.`,
        order,
      };
    },
    [commitPortfolio],
  );

  const updatePrices = useCallback(
    (priceUpdates) => {
      const current = portfolioRef.current;

      const nextPortfolio = {
        ...current,
        holdings: current.holdings.map((holding) => {
          const nextPrice = Number(priceUpdates[holding.symbol]);

          if (!Number.isFinite(nextPrice) || nextPrice <= 0) {
            return holding;
          }

          return {
            ...holding,
            currentPrice: nextPrice,
          };
        }),
      };

      commitPortfolio(nextPortfolio);
    },
    [commitPortfolio],
  );

  const resetPortfolio = useCallback(() => {
    commitPortfolio(createInitialPortfolio());
  }, [commitPortfolio]);

  const holdingsValue = portfolio.holdings.reduce(
    (total, holding) => total + holding.quantity * holding.currentPrice,
    0,
  );

  const investedValue = portfolio.holdings.reduce(
    (total, holding) => total + holding.quantity * holding.averagePrice,
    0,
  );

  const unrealizedPnL = holdingsValue - investedValue;
  const totalPnL = portfolio.realizedPnL + unrealizedPnL;

  const value = {
    cash: portfolio.cash,
    holdings: portfolio.holdings,
    orders: portfolio.orders,
    realizedPnL: portfolio.realizedPnL,
    holdingsValue,
    investedValue,
    unrealizedPnL,
    totalPnL,
    totalPortfolioValue: portfolio.cash + holdingsValue,
    executeTrade,
    updatePrices,
    resetPortfolio,
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
