
import { Router } from "express";

import authenticate from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";

import {
  tradeSchema,
  stockQuerySchema,
} from "../validators/trading.validator.js";

import {
  marketStatus,
  listStocks,
  stockDetails,
  portfolioOverview,
  createTrade,
  orderHistory,
} from "../controllers/trading.controller.js";

const router = Router();

// Public stock catalogue
router.get("/market/status", marketStatus);

router.get(
  "/stocks",
  validate(stockQuerySchema, "query"),
  listStocks
);

router.get("/stocks/:symbol", stockDetails);

// Protected trading and portfolio endpoints
router.use(authenticate);

router.get("/portfolio", portfolioOverview);
router.post("/orders", validate(tradeSchema), createTrade);
router.get(
  "/orders",
  validate(
    stockQuerySchema.pick({ page: true, limit: true }),
    "query"
  ),
  orderHistory
);

export default router;
