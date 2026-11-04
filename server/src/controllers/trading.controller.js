
import asyncHandler from "../utils/asyncHandler.js";

import {
  getStocks,
  getStockDetails,
  getPortfolio,
  placeTrade,
  getOrderHistory,
} from "../services/trading.service.js";

export const listStocks = asyncHandler(async (req, res) => {
  const result = await getStocks(req.validatedQuery);

  res.status(200).json({
    success: true,
    data: result,
  });
});

export const stockDetails = asyncHandler(async (req, res) => {
  const stock = await getStockDetails(req.params.symbol);

  res.status(200).json({
    success: true,
    data: { stock },
  });
});

export const portfolioOverview = asyncHandler(async (req, res) => {
  const portfolio = await getPortfolio(req.user.userId);

  res.status(200).json({
    success: true,
    data: { portfolio },
  });
});

export const createTrade = asyncHandler(async (req, res) => {
  const order = await placeTrade(req.user.userId, req.body);

  res.status(201).json({
    success: true,
    message: `${order.side} order executed successfully.`,
    data: { order },
  });
});

export const orderHistory = asyncHandler(async (req, res) => {
  const result = await getOrderHistory(
    req.user.userId,
    req.validatedQuery
  );

  res.status(200).json({
    success: true,
    data: result,
  });
});
