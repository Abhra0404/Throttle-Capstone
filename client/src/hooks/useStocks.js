/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useState } from "react";
import api from "../services/api";

function messageFor(error) {
  return (
    error.response?.data?.message ||
    (error.request
      ? "The market data service is unavailable."
      : error.message) ||
    "Unable to load market data."
  );
}

function normalize(stock) {
  return {
    ...stock,
    price: Number(stock.currentPrice ?? stock.price) || 0,
    currentPrice: Number(stock.currentPrice ?? stock.price) || 0,
    change: Number(stock.change) || 0,
    changePercent: Number(stock.changePercent) || 0,
    volume: Number(stock.volume) || 0,
  };
}

export function useStocks({ search = "", sector = "" } = {}) {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadToken, setReloadToken] = useState(0);

  const retry = useCallback(() => setReloadToken((value) => value + 1), []);

  useEffect(() => {
    let active = true;
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError("");

      try {
        const response = await api.get("/trading/stocks", {
          params: { search: search.trim() || undefined, sector: sector || undefined, page: 1, limit: 100 },
        });

        if (active) {
          setStocks((response.data.data.stocks || []).map(normalize));
        }
      } catch (requestError) {
        if (active) {
          setStocks([]);
          setError(messageFor(requestError));
        }
      } finally {
        if (active) setLoading(false);
      }
    }, search ? 300 : 0);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [search, sector, reloadToken]);

  return { stocks, loading, error, retry };
}

export function useStock(symbol) {
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(Boolean(symbol));
  const [error, setError] = useState("");
  const [reloadToken, setReloadToken] = useState(0);

  const retry = useCallback(() => setReloadToken((value) => value + 1), []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    api
      .get(`/trading/stocks/${encodeURIComponent(symbol || "")}`)
      .then((response) => {
        if (!active) return;
        const value = response.data.data.stock;
        setStock({
          ...value,
          price: Number(value.currentPrice) || 0,
          currentPrice: Number(value.currentPrice) || 0,
          change: Number(value.change) || 0,
          changePercent: Number(value.changePercent) || 0,
          volume: Number(value.volume) || 0,
        });
      })
      .catch((requestError) => {
        if (!active) return;
        setStock(null);
        setError(
          requestError.response?.data?.message || "Unable to load this stock.",
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [symbol, reloadToken]);

  return { stock, loading, error, retry };
}
