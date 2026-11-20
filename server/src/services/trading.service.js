
import {
  executeTrade as executeTradeRepository,
  findStocks,
  findStockBySymbol,
  findPortfolioByUserId,
  findOrdersByUserId,
  countOrdersByUserId,
  upsertMarketStock,
} from "../repositories/trading.repository.js";
import {
  hydrateStock,
  hydrateStocks,
  getMarketStatus,
  searchLiveCompanies,
} from "./market.service.js";

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

export const getStocks = async (query) => {
  const result = await findStocks(query);
  const liveSearch =
    query.search && getMarketStatus().configured
      ? await searchLiveCompanies(query.search, query.limit)
      : [];

  const stocks =
    liveSearch.length > 0
      ? await hydrateStocks(liveSearch)
      : await hydrateStocks(result.stocks);

  await Promise.all(
    stocks
      .filter((stock) => stock.source === "LIVE")
      .map((stock) => upsertMarketStock(stock).catch(() => null))
  );

  return {
    ...result,
    stocks,
    market: getMarketStatus(),
  };
};

export const getStockDetails = async (symbol) => {
  const stock = await findStockBySymbol(symbol.toUpperCase());

  if (!stock) {
    throw createError("Stock not found.", 404);
  }

  return hydrateStock(stock);
};

export const getPortfolio = async (userId) => {
  const portfolio = await findPortfolioByUserId(userId);

  if (!portfolio) {
    throw createError("Portfolio not found.", 404);
  }

  return portfolio;
};

export const placeTrade = async (userId, tradeData) => {
  return executeTradeRepository(userId, tradeData);
};

export const getOrderHistory = async (userId, query) => {
  const [orders, total] = await Promise.all([
    findOrdersByUserId(userId, query),
    countOrdersByUserId(userId),
  ]);

  return {
    orders,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit),
    },
  };
};
