import { env } from "../config/env.js";

const quoteCache = new Map();
const CACHE_MS = 15 * 1000;

const apiKey = env.MARKET_API_KEY;
const providerName = "NSE India";

function number(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function yahooSymbol(symbol) {
  if (symbol.includes(".")) return symbol;
  return `${symbol}.NS`;
}

async function fetchNseQuote(symbol) {
  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/131 Safari/537.36",
    Accept: "application/json,text/plain,*/*",
  };

  const homepage = await fetch("https://www.nseindia.com", { headers });
  if (!homepage.ok) return null;

  const setCookies =
    typeof homepage.headers.getSetCookie === "function"
      ? homepage.headers.getSetCookie()
      : [];
  const cookie = setCookies
    .map((value) => value.split(";")[0])
    .filter(Boolean)
    .join("; ");

  const url = new URL("https://www.nseindia.com/api/quote-equity");
  url.searchParams.set("symbol", symbol);

  const response = await fetch(url, {
    headers: {
      ...headers,
      Referer: "https://www.nseindia.com/get-quotes/equity",
      ...(cookie ? { Cookie: cookie } : {}),
    },
  });
  if (!response.ok) return null;

  const quote = await response.json();
  const priceInfo = quote?.priceInfo;
  const close = number(
    priceInfo?.lastPrice,
    number(quote?.metadata?.lastPrice)
  );
  const previousClose = number(
    priceInfo?.previousClose,
    number(quote?.metadata?.previousClose, close)
  );
  if (!close) return null;

  const change = number(
    priceInfo?.change,
    close - previousClose
  );
  const changePercent = number(
    priceInfo?.pChange,
    previousClose ? (change / previousClose) * 100 : 0
  );

  return {
    price: close,
    currentPrice: close,
    change,
    changePercent,
    volume: number(
      quote?.securityWiseDP?.quantityTraded,
      number(quote?.preOpenMarket?.totalTradedVolume)
    ),
    name:
      quote?.info?.companyName ||
      quote?.metadata?.companyName ||
      null,
    exchange: "NSE",
    source: "LIVE",
  };
}

async function fetchYahooQuote(symbol) {
  const cacheKey = symbol.toUpperCase();
  const cached = quoteCache.get(cacheKey);
  if (cached && Date.now() - cached.time < CACHE_MS) {
    return cached.value;
  }

  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooSymbol(cacheKey))}?interval=1m&range=1d`;
  const response = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
  });
  if (!response.ok) return null;

  const payload = await response.json();
  const result = payload?.chart?.result?.[0];
  const meta = result?.meta;
  if (!meta) return null;

  const close = number(
    meta.regularMarketPrice,
    number(meta.previousClose)
  );
  const previousClose = number(
    meta.chartPreviousClose,
    number(meta.previousClose, close)
  );
  const change = close - previousClose;
  const changePercent =
    previousClose === 0 ? 0 : (change / previousClose) * 100;

  const value = {
    price: close,
    currentPrice: close,
    change,
    changePercent,
    volume: number(meta.regularMarketVolume),
    name: meta.longName || meta.shortName || null,
    exchange: meta.exchangeName || null,
    source: "LIVE",
  };

  quoteCache.set(cacheKey, { time: Date.now(), value });
  return value;
}

async function fetchTwelveDataQuote(symbol) {
  if (!apiKey) return null;

  const url = new URL("https://api.twelvedata.com/quote");
  url.searchParams.set("symbol", yahooSymbol(symbol).replace(".NS", ".NSE"));
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

  return {
    price: close,
    currentPrice: close,
    change,
    changePercent,
    volume: number(quote.volume),
    name: quote.name || null,
    exchange: quote.exchange || null,
    source: "LIVE",
  };
}

async function fetchQuote(symbol) {
  const cacheKey = symbol.toUpperCase();
  const cached = quoteCache.get(cacheKey);
  if (cached && Date.now() - cached.time < CACHE_MS) {
    return cached.value;
  }

  const quote =
    (await fetchNseQuote(cacheKey)) ||
    (await fetchYahooQuote(cacheKey)) ||
    (await fetchTwelveDataQuote(cacheKey));

  if (quote) {
    quoteCache.set(cacheKey, { time: Date.now(), value: quote });
  }

  return quote;
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
  if (stocks.length === 0) {
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
    configured: true,
    fallbackProvider:
      apiKey ? "Yahoo Finance / Twelve Data" : "Yahoo Finance",
    source: "LIVE_WITH_DATABASE_FALLBACK",
  };
}

export async function searchLiveCompanies(search, limit = 20) {
  if (!search) return [];

  const url = new URL("https://query1.finance.yahoo.com/v1/finance/search");
  url.searchParams.set("q", search);
  url.searchParams.set("quotesCount", String(limit));
  url.searchParams.set("newsCount", "0");

  const response = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
  });
  if (!response.ok) return [];

  const result = await response.json();
  if (!Array.isArray(result.quotes)) return [];

  return result.quotes
    .filter((company) => company.symbol?.endsWith(".NS") ||
      company.symbol?.endsWith(".BO"))
    .slice(0, limit)
    .map((company) => ({
      id: null,
      symbol: company.symbol.replace(/\.(NS|BO)$/, ""),
      name: company.longname || company.shortname || company.symbol,
      sector: null,
      currentPrice: 0,
      change: 0,
      changePercent: 0,
      volume: 0,
      source: "LIVE",
    }));
}
