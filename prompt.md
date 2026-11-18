
# Task: Integrate Throttle Trade Frontend with Backend

You are working on Throttle Trade, a paper-trading platform for Indian equities.

Your task is to replace the existing client-side mock portfolio and trading logic with the existing Node.js, Express, Prisma, and PostgreSQL backend.

## 1. Existing Architecture

### Frontend
- React 19
- Vite
- JavaScript (NOT TypeScript)
- Tailwind CSS v4
- React Router 7
- Axios
- Lucide React
- Recharts

### Backend
- Node.js
- Express.js
- PostgreSQL
- Prisma ORM 7
- JWT authentication
- bcryptjs
- Zod validation

The project has separate `client/` and `server/` directories.

## 2. Existing Database Models

The Prisma schema already contains:

- User
- Portfolio
- Stock
- Holding
- Order
- Watchlist

Important fields include:

**Portfolio**
- id
- userId
- cashBalance

**Holding**
- id
- portfolioId
- stockId
- quantity
- averagePrice

**Order**
- id
- portfolioId
- stockId
- side
- status
- quantity
- price
- total
- realizedPnl
- createdAt

**Stock**
- id
- symbol
- name
- sector
- currentPrice
- change
- changePercent
- volume
- isActive

Inspect the actual Prisma schema before making assumptions about field names, relationships, enums, or types.

## 3. Existing Backend APIs

Authentication:
- POST `/api/v1/auth/register`
- POST `/api/v1/auth/login`
- GET `/api/v1/auth/me`

Trading:
- GET `/api/v1/trading/stocks`
- GET `/api/v1/trading/stocks/:symbol`
- GET `/api/v1/trading/portfolio`
- POST `/api/v1/trading/orders`
- GET `/api/v1/trading/orders`

All protected routes require a JWT Bearer token.

The authentication integration is already implemented in the frontend through:
- `src/services/api.js`
- `src/context/AuthContext.jsx`
- `src/pages/AuthPage.jsx`

Do not rewrite working authentication functionality.

## 4. Main Objective

Replace the existing `PortfolioContext.jsx` implementation.

Currently, it:
- Initializes portfolio data from mock holdings.
- Stores portfolio state in localStorage.
- Executes buy/sell trades locally.
- Calculates cash and P&L in the browser.
- Generates fake orders locally.
- Stores watchlist data in localStorage.

This must be changed so that PostgreSQL is the source of truth.

## 5. PortfolioContext Integration

Create a backend-integrated PortfolioContext that:

1. Fetches the authenticated user's portfolio from GET `/trading/portfolio`.
2. Fetches order history from GET `/trading/orders`.
3. Stores the fetched data in React state.
4. Provides loading and error states.
5. Refreshes portfolio and orders after successful trades.
6. Does not initialize authenticated users with mock holdings.
7. Does not persist portfolio balances, holdings, or orders in localStorage.
8. Handles logout and account switching without exposing previous users' data.
9. Handles expired JWT sessions appropriately.
10. Preserves the existing `usePortfolio()` API wherever practical.

Keep the watchlist in localStorage temporarily if no backend watchlist endpoints exist.

## 6. Trading Integration

Replace local trade execution with POST `/trading/orders`.

Expected request:

{
  "symbol": "RELIANCE",
  "side": "BUY",
  "quantity": 5,
  "price": 1428.50
}

Verify this request structure against the actual backend Zod validator before implementing it.

The backend must remain responsible for:
- Checking available virtual cash.
- Checking available shares before selling.
- Calculating order totals.
- Updating cash balances.
- Creating and updating holdings.
- Calculating weighted average purchase price.
- Calculating realized P&L.
- Creating order records.
- Executing the transaction atomically.

The frontend must not independently calculate or commit financial transactions.

The frontend should:
- Validate basic form inputs.
- Submit the order.
- Display success/error messages.
- Refresh portfolio and order history after success.
- Prevent duplicate submissions while an order is processing.

## 7. Portfolio Calculations

Preserve the following values in the context API:

- cash
- holdings
- orders
- realizedPnL
- holdingsValue
- investedValue
- unrealizedPnL
- totalPnL
- totalPortfolioValue

Use current stock prices from the backend wherever available.

Calculate display-only metrics from the fetched server data.

Use careful numeric conversion because Prisma Decimal and BigInt values may be serialized as strings.

Do not introduce floating-point calculations into server-side financial transaction logic.

## 8. Watchlist

Preserve existing functionality:
- addToWatchlist
- removeFromWatchlist
- toggleWatchlist
- watchlist

If watchlist endpoints already exist, integrate them.

Otherwise, retain localStorage persistence for the watchlist only.

Do not implement duplicate watchlist functionality.

## 9. Frontend Components to Integrate

Inspect these components and update their API interactions as necessary:

- `src/components/dashboard/QuickTrade.jsx`
- `src/components/dashboard/Holdings.jsx`
- `src/components/dashboard/MarketOverview.jsx`
- `src/components/dashboard/PortfolioChart.jsx`
- `src/components/dashboard/Watchlist.jsx`
- `src/pages/TradePage.jsx`
- `src/pages/PortfolioPage.jsx`
- `src/pages/OverviewPage.jsx`
- `src/pages/StockDetailPage.jsx`
- `src/pages/MarketsPage.jsx`
- `src/pages/WatchlistPage.jsx`

Preserve the current UI design.

Do not redesign components or introduce a new visual theme.

Avoid unnecessary component rewrites.

## 10. Data Flow

Implement this architecture:

React Components
       |
       v
PortfolioContext
       |
       v
Axios API Service
       |
       v
Express Trading API
       |
       v
Trading Service
       |
       v
Prisma ORM
       |
       v
PostgreSQL

The backend is the source of truth for all financial data.

## 11. Error Handling

Handle:
- Unauthorized requests.
- Expired JWT.
- Insufficient virtual cash.
- Insufficient shares.
- Invalid stock symbols.
- Invalid quantities.
- Invalid prices.
- Network failures.
- Server errors.

Display meaningful error messages in the UI.

Do not silently swallow API errors.

## 12. Important Constraints

- Use JavaScript only. Do not introduce TypeScript.
- Preserve the existing React Router configuration.
- Preserve existing Tailwind styling.
- Do not modify the Prisma schema unless absolutely necessary.
- Do not create duplicate backend endpoints.
- Do not remove existing features.
- Do not use mock portfolio data for authenticated users.
- Do not store financial state in localStorage.
- Do not implement client-side trade execution.
- Keep the code modular and maintainable.
- Avoid unnecessary dependencies.

## 13. Implementation Workflow

Before modifying anything:

1. Inspect the complete frontend and backend folder structures.
2. Read the actual Prisma schema.
3. Inspect trading controllers, services, repositories, routes, and validators.
4. Identify the exact API response structures.
5. Inspect all components consuming `usePortfolio()`.
6. Identify existing assumptions and compatibility requirements.

Then implement incrementally:

Phase 1: API service and portfolio fetching.

Phase 2: PortfolioContext replacement.

Phase 3: Buy/sell order integration.

Phase 4: Holdings and order history integration.

Phase 5: Watchlist integration or temporary local persistence.

Phase 6: Dashboard and stock-page integration.

Phase 7: Error handling and loading states.

Phase 8: End-to-end verification.

After each phase:
- Explain the files modified.
- Explain the implementation.
- Provide commands to run.
- Verify that existing functionality remains intact.

## 14. Acceptance Criteria

The implementation is complete when:

- A newly registered user receives ₹5,00,000 virtual cash.
- Different users have isolated portfolios.
- Portfolio data is fetched from PostgreSQL.
- Buying shares updates the database correctly.
- Selling shares updates the database correctly.
- Insufficient cash prevents a purchase.
- Insufficient holdings prevent a sale.
- Average purchase price is calculated correctly.
- Realized P&L is calculated correctly.
- Order history persists after refresh.
- Portfolio state persists after logout and login.
- No duplicate trades are created from repeated clicks.
- Existing dashboard UI continues working.
- No authenticated portfolio data depends on localStorage.

First inspect the repository and report the existing implementation and API response contracts. Then proceed with the integration without making assumptions or unnecessarily rewriting working code.
