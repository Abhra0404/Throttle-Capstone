
import { Router } from "express";

import authenticate from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";
import validateQuery from "../middleware/validate-query.middleware.js";

import {
  tradeSchema,
  stockQuerySchema,
} from "../validators/trading.validator.js";

import {
  listStocks,
  stockDetails,
  portfolioOverview,
  createTrade,
  orderHistory,
} from "../controllers/trading.controller.js";

const router = Router();

// Public stock catalogue
router.get(
  "/stocks",
  validateQuery(stockQuerySchema),
  listStocks
);

router.get("/stocks/:symbol", stockDetails);

// Protected trading and portfolio endpoints
router.use(authenticate);

router.get("/portfolio", portfolioOverview);
router.post("/orders", validate(tradeSchema), createTrade);
router.get(
  "/orders",
  validateQuery(stockQuerySchema.pick({ page: true, limit: true })),
  orderHistory
);

export default router;
