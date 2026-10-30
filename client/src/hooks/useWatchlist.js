
import { useCallback, useEffect, useState } from "react";
import { stocks } from "../data/mockData";

const STORAGE_KEY = "throttle-watchlist-v1";
const DEFAULT_SYMBOLS = stocks.slice(0, 5).map((stock) => stock.symbol);

function getValidSymbols(value) {
  if (!Array.isArray(value)) return DEFAULT_SYMBOLS;

  const validSymbols = new Set(stocks.map((stock) => stock.symbol));

  return [...new Set(value)].filter(
    (symbol) => typeof symbol === "string" && validSymbols.has(symbol)
  );
}

function readWatchlist() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    return saved === null
      ? DEFAULT_SYMBOLS
      : getValidSymbols(JSON.parse(saved));
  } catch {
    return DEFAULT_SYMBOLS;
  }
}

export function useWatchlist() {
  const [symbols, setSymbols] = useState(readWatchlist);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(symbols));
    } catch {
      // Keep the current in-memory watchlist if storage is unavailable.
    }
  }, [symbols]);

  const addStock = useCallback((symbol) => {
    setSymbols((current) =>
      current.includes(symbol) ? current : [...current, symbol]
    );
  }, []);

  const removeStock = useCallback((symbol) => {
    setSymbols((current) => current.filter((item) => item !== symbol));
  }, []);

  const toggleStock = useCallback((symbol) => {
    setSymbols((current) =>
      current.includes(symbol)
        ? current.filter((item) => item !== symbol)
        : [...current, symbol]
    );
  }, []);

  return { symbols, addStock, removeStock, toggleStock };
}
