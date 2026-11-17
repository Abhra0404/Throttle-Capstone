-- Throttle Trade PostgreSQL schema
-- Corresponds to the Prisma models: User, Portfolio, Stock, Holding, Order, Watchlist.
-- Intended for an empty database/schema.

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE "OrderSide" AS ENUM ('BUY', 'SELL');
CREATE TYPE "OrderStatus" AS ENUM ('EXECUTED', 'REJECTED', 'CANCELLED');

CREATE TABLE "users" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" VARCHAR(100) NOT NULL,
  "email" VARCHAR(255) NOT NULL UNIQUE,
  "password_hash" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "portfolios" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL UNIQUE,
  "cash_balance" DECIMAL(18,2) NOT NULL DEFAULT 500000.00,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "portfolios_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id")
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "stocks" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "symbol" VARCHAR(20) NOT NULL UNIQUE,
  "name" VARCHAR(150) NOT NULL,
  "sector" VARCHAR(100),
  "current_price" DECIMAL(18,2) NOT NULL,
  "change" DECIMAL(18,2) NOT NULL DEFAULT 0,
  "change_percent" DECIMAL(8,4) NOT NULL DEFAULT 0,
  "volume" BIGINT NOT NULL DEFAULT 0,
  "is_active" BOOLEAN NOT NULL DEFAULT TRUE,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "holdings" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "portfolio_id" UUID NOT NULL,
  "stock_id" UUID NOT NULL,
  "quantity" INTEGER NOT NULL,
  "average_price" DECIMAL(18,2) NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "holdings_portfolio_id_stock_id_key"
    UNIQUE ("portfolio_id", "stock_id"),
  CONSTRAINT "holdings_portfolio_id_fkey"
    FOREIGN KEY ("portfolio_id") REFERENCES "portfolios"("id")
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "holdings_stock_id_fkey"
    FOREIGN KEY ("stock_id") REFERENCES "stocks"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "orders" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "portfolio_id" UUID NOT NULL,
  "stock_id" UUID NOT NULL,
  "side" "OrderSide" NOT NULL,
  "status" "OrderStatus" NOT NULL DEFAULT 'EXECUTED',
  "quantity" INTEGER NOT NULL,
  "price" DECIMAL(18,2) NOT NULL,
  "total" DECIMAL(18,2) NOT NULL,
  "realized_pnl" DECIMAL(18,2) NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "orders_portfolio_id_fkey"
    FOREIGN KEY ("portfolio_id") REFERENCES "portfolios"("id")
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "orders_stock_id_fkey"
    FOREIGN KEY ("stock_id") REFERENCES "stocks"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "watchlists" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL,
  "stock_id" UUID NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "watchlists_user_id_stock_id_key"
    UNIQUE ("user_id", "stock_id"),
  CONSTRAINT "watchlists_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id")
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "watchlists_stock_id_fkey"
    FOREIGN KEY ("stock_id") REFERENCES "stocks"("id")
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "holdings_stock_id_idx" ON "holdings"("stock_id");
CREATE INDEX "orders_portfolio_id_created_at_idx" ON "orders"("portfolio_id", "created_at");
CREATE INDEX "orders_stock_id_idx" ON "orders"("stock_id");
CREATE INDEX "watchlists_stock_id_idx" ON "watchlists"("stock_id");

COMMIT;
