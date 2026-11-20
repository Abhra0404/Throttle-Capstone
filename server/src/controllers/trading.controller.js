
import {
  getStocks,
  getStockDetails,
  getPortfolio,
  placeTrade,
  getOrderHistory,
} from "../services/trading.service.js";
import { getMarketStatus } from "../services/market.service.js";

export const marketStatus = async (req, res) => {
  res.status(200).json({
    success: true,
    data: getMarketStatus(),
  });
};

export const listStocks = async (req, res) => {
  const result = await getStocks(req.validatedQuery);

  res.status(200).json({
    success: true,
    data: result,
  });
};

export const stockDetails = async (req, res) => {
  const stock = await getStockDetails(req.params.symbol);

  res.status(200).json({
    success: true,
    data: { stock },
  });
};

export const portfolioOverview = async (req, res) => {
  const portfolio = await getPortfolio(req.user.userId);

  res.status(200).json({
    success: true,
    data: { portfolio },
  });
};

export const createTrade = async (req, res) => {
  const order = await placeTrade(req.user.userId, req.body);

  res.status(201).json({
    success: true,
    message: `${order.side} order executed successfully.`,
    data: { order },
  });
};

export const orderHistory = async (req, res) => {
  const result = await getOrderHistory(
    req.user.userId,
    req.validatedQuery
  );

  res.status(200).json({
    success: true,
    data: result,
  });
};
