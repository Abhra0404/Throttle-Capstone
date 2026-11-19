-- Throttle application SQL query catalogue
-- PostgreSQL parameter placeholders use $1, $2, ... .
-- The application currently stores watchlists in browser localStorage, so no
-- watchlists query is executed by the server.

-- ============================================================================
-- Authentication and users
-- ============================================================================

-- READ: Find a user during registration duplicate-email validation or login.
SELECT
  u."id",
  u."name",
  u."email",
  u."password_hash",
  u."created_at",
  u."updated_at"
FROM "users" AS u
WHERE u."email" = $1;

-- READ: Load the authenticated user and their portfolio for GET /auth/me.
SELECT
  u."id",
  u."name",
  u."email",
  u."created_at",
  p."id" AS "portfolio_id",
  p."cash_balance",
  p."created_at" AS "portfolio_created_at"
FROM "users" AS u
LEFT JOIN "portfolios" AS p
  ON p."user_id" = u."id"
WHERE u."id" = $1;

-- WRITE: Create a user during registration.
INSERT INTO "users" (
  "name",
  "email",
  "password_hash"
)
VALUES ($1, $2, $3)
RETURNING
  "id",
  "name",
  "email",
  "created_at";

-- WRITE: Create the new user's initial portfolio during registration.
INSERT INTO "portfolios" (
  "user_id",
  "cash_balance"
)
VALUES ($1, 500000.00)
RETURNING
  "id",
  "cash_balance",
  "created_at";

-- ============================================================================
-- Stock catalogue
-- ============================================================================

-- READ: List active stocks with optional case-insensitive search and sector
-- filtering. $1 is search text (NULL for no search), $2 is sector (NULL for
-- no sector), $3 is the zero-based offset, and $4 is the page size.
SELECT
  s."id",
  s."symbol",
  s."name",
  s."sector",
  s."current_price",
  s."change",
  s."change_percent"
FROM "stocks" AS s
WHERE s."is_active" = TRUE
  AND ($1 IS NULL
    OR s."symbol" ILIKE '%' || $1 || '%'
    OR s."name" ILIKE '%' || $1 || '%')
  AND ($2 IS NULL OR s."sector" ILIKE $2)
ORDER BY s."symbol" ASC
OFFSET $3
LIMIT $4;

-- READ: Count the active stocks matching the same catalogue filters.
SELECT COUNT(*) AS "total"
FROM "stocks" AS s
WHERE s."is_active" = TRUE
  AND ($1 IS NULL
    OR s."symbol" ILIKE '%' || $1 || '%'
    OR s."name" ILIKE '%' || $1 || '%')
  AND ($2 IS NULL OR s."sector" ILIKE $2);

-- READ: Load the active stock detail used by the trade and stock-detail pages.
SELECT
  s."id",
  s."symbol",
  s."name",
  s."sector",
  s."current_price",
  s."change",
  s."change_percent",
  s."volume"
FROM "stocks" AS s
WHERE s."symbol" = $1
  AND s."is_active" = TRUE
LIMIT 1;

-- WRITE: Seed a stock or update its market values when the symbol already
-- exists. $1-$7 are symbol, name, sector, current price, change,
-- change-percent, and volume.
INSERT INTO "stocks" (
  "symbol",
  "name",
  "sector",
  "current_price",
  "change",
  "change_percent",
  "volume",
  "is_active"
)
VALUES ($1, $2, $3, $4, $5, $6, $7, TRUE)
ON CONFLICT ("symbol") DO UPDATE
SET
  "name" = EXCLUDED."name",
  "sector" = EXCLUDED."sector",
  "current_price" = EXCLUDED."current_price",
  "change" = EXCLUDED."change",
  "change_percent" = EXCLUDED."change_percent",
  "is_active" = TRUE,
  "updated_at" = CURRENT_TIMESTAMP
RETURNING "id", "symbol";

-- ============================================================================
-- Portfolio overview
-- ============================================================================

-- READ: Load the user's portfolio, current holdings, and related stock data.
-- The application calculates invested value, market value, and unrealized P&L
-- from these joined rows.
SELECT
  p."id" AS "portfolio_id",
  p."cash_balance",
  h."id" AS "holding_id",
  h."quantity",
  h."average_price",
  s."id" AS "stock_id",
  s."symbol",
  s."name",
  s."current_price",
  s."change",
  s."change_percent"
FROM "portfolios" AS p
LEFT JOIN "holdings" AS h
  ON h."portfolio_id" = p."id"
LEFT JOIN "stocks" AS s
  ON s."id" = h."stock_id"
WHERE p."user_id" = $1
ORDER BY h."created_at" ASC;

-- READ: Load executed sell P&L values for the portfolio overview.
SELECT
  o."realized_pnl"
FROM "orders" AS o
JOIN "portfolios" AS p
  ON p."id" = o."portfolio_id"
WHERE p."user_id" = $1
  AND o."side" = 'SELL'
  AND o."status" = 'EXECUTED';

-- ============================================================================
-- Order history
-- ============================================================================

-- READ: Return a user's paginated order history with stock details.
-- $2 is the zero-based offset and $3 is the page size.
SELECT
  o."id",
  o."side",
  o."status",
  o."quantity",
  o."price",
  o."total",
  o."realized_pnl",
  o."created_at",
  s."symbol",
  s."name"
FROM "orders" AS o
JOIN "portfolios" AS p
  ON p."id" = o."portfolio_id"
JOIN "stocks" AS s
  ON s."id" = o."stock_id"
WHERE p."user_id" = $1
ORDER BY o."created_at" DESC
OFFSET $2
LIMIT $3;

-- READ: Count a user's orders for pagination.
SELECT COUNT(*) AS "total"
FROM "orders" AS o
JOIN "portfolios" AS p
  ON p."id" = o."portfolio_id"
WHERE p."user_id" = $1;

-- ============================================================================
-- Trade execution
-- ============================================================================
-- The following statements execute inside one SERIALIZABLE transaction.
-- The application retries the transaction when PostgreSQL reports a
-- serialization conflict. $1 is the user ID, $2 is the stock symbol, and
-- $3 is the requested quantity.

-- READ: Find the user's portfolio before executing a trade.
SELECT
  p."id",
  p."cash_balance"
FROM "portfolios" AS p
WHERE p."user_id" = $1
FOR UPDATE;

-- READ: Find the active stock and server-authoritative execution price.
SELECT
  s."id",
  s."symbol",
  s."name",
  s."current_price",
  s."is_active"
FROM "stocks" AS s
WHERE s."symbol" = $2
  AND s."is_active" = TRUE
FOR SHARE;

-- READ: Find an existing holding before a BUY or SELL.
SELECT
  h."id",
  h."portfolio_id",
  h."stock_id",
  h."quantity",
  h."average_price"
FROM "holdings" AS h
WHERE h."portfolio_id" = $4
  AND h."stock_id" = $5
FOR UPDATE;

-- WRITE: BUY branch - subtract the server-calculated trade total from cash.
UPDATE "portfolios"
SET
  "cash_balance" = "cash_balance" - $6,
  "updated_at" = CURRENT_TIMESTAMP
WHERE "id" = $4;

-- WRITE: BUY branch - create or update the holding with its weighted average
-- price. $3 is the requested quantity and $9 is the new average price.
INSERT INTO "holdings" (
  "portfolio_id",
  "stock_id",
  "quantity",
  "average_price"
)
VALUES ($4, $5, $3, $9)
ON CONFLICT ("portfolio_id", "stock_id") DO UPDATE
SET
  "quantity" = EXCLUDED."quantity",
  "average_price" = EXCLUDED."average_price",
  "updated_at" = CURRENT_TIMESTAMP;

-- WRITE: SELL branch - add the server-calculated trade total to cash.
UPDATE "portfolios"
SET
  "cash_balance" = "cash_balance" + $6,
  "updated_at" = CURRENT_TIMESTAMP
WHERE "id" = $4;

-- WRITE: SELL branch - remove a holding when its remaining quantity is zero.
DELETE FROM "holdings"
WHERE "id" = $10;

-- WRITE: SELL branch - otherwise reduce the holding quantity.
UPDATE "holdings"
SET
  "quantity" = $7,
  "updated_at" = CURRENT_TIMESTAMP
WHERE "id" = $10;

-- WRITE: Record the executed trade after the portfolio mutation. $11 is the
-- side, $12 is the execution price, $13 is the trade total, and $14 is the
-- realized P&L.
INSERT INTO "orders" (
  "portfolio_id",
  "stock_id",
  "side",
  "quantity",
  "price",
  "total",
  "realized_pnl"
)
VALUES ($4, $5, $11, $3, $12, $13, $14)
RETURNING
  "id",
  "side",
  "status",
  "quantity",
  "price",
  "total",
  "realized_pnl",
  "created_at";

-- READ: Load the stock relation returned with the newly created order.
SELECT
  o."id" AS "order_id",
  s."symbol",
  s."name"
FROM "orders" AS o
JOIN "stocks" AS s
  ON s."id" = o."stock_id"
WHERE o."id" = $15;
