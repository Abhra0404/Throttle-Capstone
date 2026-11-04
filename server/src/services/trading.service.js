
import {
  executeTrade as executeTradeRepository,
  findStocks,
  findStockBySymbol,
  findPortfolioByUserId,
  findOrdersByUserId,
  countOrdersByUserId,
} from "../repositories/trading.repository.js";

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

export const getStocks = (query) => findStocks(query);

export const getStockDetails = async (symbol) => {
  const stock = await findStockBySymbol(symbol.toUpperCase());

  if (!stock) {
    throw createError("Stock not found.", 404);
  }

  return stock;
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
