import { env } from "../config/env.js";

const quoteCache = new Map();
const CACHE_MS = 60 * 1000;

const apiKey = env.MARKET_API_KEY;
const providerName = "Twelve Data";

function toSymbol(symbol) {
  return symbol.includes(".") ? symbol : `${symbol}.NSE`;
}

function number(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

async function fetchQuote(symbol) {
  if (!apiKey) return null;

  const cacheKey = symbol.toUpperCase();
  const cached = quoteCache.get(cacheKey);
  if (cached && Date.now() - cached.time < CACHE_MS) {
    return cached.value;
  }

  const url = new URL("https://api.twelvedata.com/quote");
  url.searchParams.set("symbol", toSymbol(cacheKey));
  url.searchParams.set("apikey", apiKey);

  const response = await fetch(url);
  if (!response.ok) return null;

  const quote = await response.json();
  if (quote.status === "error" || !quote.close) return null;

  const close = number(quote.close);
  const previousClose = number(quote.previous_close, close);
  const change = number(quote.change, close - previousClose);
  const changePercent = number(
    quote.percent_change,
    previousClose ? ((close - previousClose) / previousClose) * 100 : 0
  );

  const value = {
    price: close,
    currentPrice: close,
    change,
    changePercent,
    volume: number(quote.volume),
    name: quote.name || null,
    exchange: quote.exchange || null,
    source: "LIVE",
  };

  quoteCache.set(cacheKey, { time: Date.now(), value });
  return value;
}

export async function hydrateStock(stock) {
  if (!stock) return stock;

  try {
    const live = await fetchQuote(stock.symbol);
    if (!live) return { ...stock, source: "DATABASE" };

    return {
      ...stock,
      ...live,
      name: live.name || stock.name,
      sector: stock.sector,
      source: "LIVE",
    };
  } catch {
    return { ...stock, source: "DATABASE" };
  }
}

export async function hydrateStocks(stocks) {
  if (!apiKey || stocks.length === 0) {
    return stocks.map((stock) => ({ ...stock, source: "DATABASE" }));
  }

  const hydrated = [];
  const batchSize = 4;

  for (let index = 0; index < stocks.length; index += batchSize) {
    const batch = stocks.slice(index, index + batchSize);
    const values = await Promise.all(
      batch.map((stock) =>
        hydrateStock(stock).catch(() => ({ ...stock, source: "DATABASE" }))
      )
    );
    hydrated.push(...values);
  }

  return hydrated;
}

export function getMarketStatus() {
  return {
    provider: providerName,
    configured: Boolean(apiKey),
    source: apiKey ? "LIVE_WITH_DATABASE_FALLBACK" : "DATABASE_ONLY",
  };
}

export async function searchLiveCompanies(search, limit = 20) {
  if (!apiKey || !search) return [];

  const url = new URL("https://api.twelvedata.com/symbol_search");
  url.searchParams.set("symbol", search);
  url.searchParams.set("apikey", apiKey);

  const response = await fetch(url);
  if (!response.ok) return [];

  const result = await response.json();
  if (!Array.isArray(result.data)) return [];

  return result.data
    .filter((company) =>
      ["NSE", "BSE"].includes(company.exchange) ||
      company.mic_code === "XNSE" ||
      company.mic_code === "XBOM"
    )
    .slice(0, limit)
    .map((company) => ({
      id: null,
      symbol: company.symbol,
      name: company.instrument_name || company.symbol,
      sector: null,
      currentPrice: 0,
      change: 0,
      changePercent: 0,
      volume: 0,
      source: "LIVE",
    }));
}
