# Throttle Trade — Project Development Plan

**Project:** Throttle Trade  
**Description:** Full-stack paper trading platform for Indian equities  
**Team Size:** 4 developers  
**Timeline:** 4 weeks  
**Frontend:** React + JavaScript + Vite  
**Backend:** Node.js + Express.js + JavaScript  
**Database:** PostgreSQL + Prisma ORM  
**Market:** NSE-focused Indian stock market

---

## 1. Project Objective

Build a web application that simulates stock trading using virtual money. Users will be able to explore supported Indian equities, place simulated buy and sell orders, manage portfolios, and analyze their investment performance.

The primary engineering objective is to implement a reliable trading engine with transaction-safe accounting, consistent portfolio state, and protection against duplicate and concurrent order submissions.

The project will be developed as a modular monolith with separate frontend and backend applications.

### Success Criteria

By the end of four weeks:

- Users can register, log in, and access protected resources.
- Users can browse supported stocks and view available price data.
- Users can place simulated market buy and sell orders.
- Cash balances, holdings, trades, and the cash ledger remain consistent.
- Users can view order history, portfolio valuation, and profit/loss.
- Users can create and manage watchlists.
- The application is tested, documented, and deployed.

## 2. Team Structure and Ownership

Each developer owns a primary module. Shared interfaces, database changes, and integration points must be coordinated across the team.

| Team Member | Primary Ownership | Main Deliverable |
|---|---|---|
| Person 1 | Backend foundation and authentication | Secure Express API and shared backend conventions |
| Person 2 | Trading engine and accounting | Transaction-safe buy/sell execution |
| Person 3 | Frontend and user experience | Responsive React trading application |
| Person 4 | Market data, analytics, testing, and deployment | Data integration and verified release |

---

## 3. Individual Responsibilities

### Person 1 — Backend Foundation and Authentication

**Primary ownership:** Backend setup, authentication, authorization, and shared API conventions.

#### Tasks

- [ ] Initialize Express.js application using JavaScript ES modules.
- [ ] Configure environment variables and PostgreSQL connectivity.
- [ ] Set up Prisma client and database migration workflow.
- [ ] Implement user registration and login.
- [ ] Implement password hashing with bcrypt.
- [ ] Implement JWT authentication middleware.
- [ ] Protect private routes and enforce resource ownership.
- [ ] Implement centralized error handling.
- [ ] Define common request validation and response formats.
- [ ] Coordinate shared database schema changes.
- [ ] Write authentication and authorization tests.
- [ ] Document backend setup and API conventions.

#### Expected Deliverable

A working backend foundation with authentication, database connectivity, reusable middleware, and consistent API behavior.

#### Primary Files

```text
server/src/
├── config/
├── middleware/
├── routes/auth.routes.js
├── controllers/auth.controller.js
├── services/auth.service.js
├── validators/
├── utils/
├── app.js
└── server.js
```

---

### Person 2 — Trading Engine and Accounting

**Primary ownership:** Order lifecycle, trade execution, holdings, cash ledger, and financial correctness.

#### Tasks

- [ ] Define and implement order validation rules.
- [ ] Implement simulated market buy orders.
- [ ] Implement simulated market sell orders.
- [ ] Select execution prices from available market-price snapshots.
- [ ] Implement database transactions for order execution.
- [ ] Maintain cash balances and the cash ledger consistently.
- [ ] Update holdings and average cost after executions.
- [ ] Implement completed trade and order history records.
- [ ] Implement idempotency protection for order submissions.
- [ ] Prevent negative cash balances and invalid share quantities.
- [ ] Test rollback after execution failures.
- [ ] Test concurrent buy and sell requests.
- [ ] Document financial calculations and execution assumptions.

#### Expected Deliverable

A reliable trading engine that preserves financial consistency and exposes stable APIs for the frontend.

#### Primary Files

```text
server/src/
├── controllers/orders.controller.js
├── controllers/trades.controller.js
├── routes/orders.routes.js
├── routes/trades.routes.js
├── services/trading.service.js
├── services/portfolio-accounting.service.js
├── repositories/
└── tests/trading/
```

**Critical requirement:** Order execution must update the order, trade, holdings, and cash ledger atomically. Use PostgreSQL transactions, suitable row-level locking or equivalent concurrency controls, and database constraints.

---

### Person 3 — Frontend and User Experience

**Primary ownership:** React application, UI components, navigation, charts, and frontend API integration.

#### Tasks

- [ ] Set up React, Vite, and frontend development scripts.
- [ ] Configure React Router and application layouts.
- [ ] Establish reusable components and styling conventions.
- [ ] Build registration and login screens.
- [ ] Build the market dashboard and stock search.
- [ ] Build stock detail pages and price charts.
- [ ] Implement the buy/sell order ticket.
- [ ] Build portfolio and holdings screens.
- [ ] Build order and trade history views.
- [ ] Implement watchlist screens.
- [ ] Create frontend API services using Axios.
- [ ] Integrate authentication with protected routes.
- [ ] Add loading, empty, validation, and error states.
- [ ] Verify responsive behavior and accessibility basics.
- [ ] Test complete user workflows against the integrated backend.

#### Expected Deliverable

A polished, responsive frontend that allows users to complete the primary paper-trading workflow.

#### Primary Files

```text
client/src/
├── assets/
├── components/
├── features/
│   ├── auth/
│   ├── market/
│   ├── trading/
│   └── portfolio/
├── layouts/
├── pages/
├── services/
├── hooks/
├── utils/
├── App.jsx
└── main.jsx
```

**Parallel development rule:** Person 3 should use agreed API contracts and mock responses while backend development is in progress. Switch to the real APIs as each endpoint becomes available.

---

### Person 4 — Market Data, Analytics, Testing, and Deployment

**Primary ownership:** Instrument catalogue, price ingestion, portfolio analytics integration, cross-module testing, and release coordination.

#### Tasks

- [ ] Create the initial catalogue of supported Indian equities.
- [ ] Prepare seeded or historical stock-price data.
- [ ] Implement market data ingestion and normalization.
- [ ] Implement stock search and historical price APIs in coordination with Person 1.
- [ ] Evaluate external data providers and their licensing requirements.
- [ ] Define timestamp and stale-price handling.
- [ ] Coordinate portfolio valuation and historical snapshot support with Person 2.
- [ ] Implement benchmark comparison if suitable data is available.
- [ ] Write integration and end-to-end tests.
- [ ] Verify financial invariants across the application.
- [ ] Configure production environment variables and deployment.
- [ ] Verify the deployed frontend, backend, and database.
- [ ] Prepare final screenshots, demo scenarios, and release documentation.

#### Expected Deliverable

A traceable market-data layer, integrated portfolio analytics, verified end-to-end behavior, and a deployed application.

#### Primary Files

```text
server/src/
├── controllers/market.controller.js
├── routes/market.routes.js
├── services/market.service.js
├── services/analytics.service.js
├── repositories/
└── tests/integration/

server/prisma/
└── seed.js
```

Person 4 coordinates testing and deployment, but all developers remain responsible for tests and fixes within their own modules.

---

## 4. Shared Architecture

```text
React + Vite Client
        |
        | REST API
        v
Express.js Backend
        |
        ├── Authentication
        ├── Market Data
        ├── Trading Engine
        ├── Portfolio Accounting
        └── Watchlists
                |
                v
            PostgreSQL
```

### Architecture Rules

1. Keep route handlers thin; business logic belongs in services.
2. Keep database access and financial calculations organized into reusable modules.
3. Validate all incoming requests.
4. Enforce authorization on every user-specific resource.
5. Use database transactions for financial state changes.
6. Store monetary values using suitable decimal representations.
7. Keep market data and trading execution separate.
8. Store timestamps for prices and executions.
9. Never trust client-supplied balances, ownership, or execution prices.
10. Keep credentials and secrets in environment variables.

## 5. Database Ownership and Schema

The database schema is shared infrastructure. Person 1 coordinates the migration workflow, Person 2 owns the trading-related invariants, and Person 4 coordinates market-data and analytics requirements.

| Table | Primary Responsibility |
|---|---|
| `users` | User accounts and authentication |
| `instruments` | Stock symbols, names, and exchange identifiers |
| `market_prices` | Timestamped prices and historical OHLCV data |
| `orders` | Order requests and execution status |
| `trades` | Completed simulated executions |
| `holdings` | Current quantities and average cost |
| `cash_ledger` | Auditable virtual cash movements |
| `watchlists` | User-selected stocks |
| `portfolio_snapshots` | Historical portfolio valuation, introduced when needed |

### Database Rules

- Use foreign keys, unique constraints, and indexes.
- Store monetary values using appropriate decimal database types.
- Define explicit order status transitions.
- Record each cash movement in the ledger.
- Preserve a trade's execution price and timestamp.
- Ensure failed executions cannot leave partial financial updates.
- Coordinate schema changes and migrations through pull requests.

## 6. Trading Engine Requirements

The first release will support simulated market orders executed at the latest valid stored price snapshot.

### Buy Flow

1. Validate the instrument and quantity.
2. Obtain a valid execution-price snapshot.
3. Calculate the order cost using precise monetary arithmetic.
4. Begin a database transaction.
5. Safely serialize access to the relevant account state.
6. Verify sufficient available cash.
7. Create the order and trade records.
8. Update holdings and average cost.
9. Record the cash debit in the ledger.
10. Commit the transaction.

### Sell Flow

1. Validate the instrument and quantity.
2. Obtain a valid execution-price snapshot.
3. Begin a database transaction.
4. Safely serialize access to the relevant holdings.
5. Verify sufficient shares.
6. Create the order and trade records.
7. Update or remove the holding.
8. Record the cash credit in the ledger.
9. Commit the transaction.

### Financial Invariants

- Available cash cannot become negative.
- Users cannot sell more shares than they own.
- Each accepted order can execute no more than once.
- Trade, cash, and holding records must remain consistent.
- A failed transaction must roll back completely.
- Realized and unrealized profit/loss must follow documented formulas.

Fees will initially be zero unless explicitly introduced and modeled.

---

## 7. Four-Week Development Schedule

### Week 1 — Foundation

**Goal:** Establish the repository, database, API contracts, and initial application interfaces.

| Person | Work Items |
|---|---|
| Person 1 | Express setup, Prisma connectivity, authentication, error handling |
| Person 2 | Trading rules, order/trade/holding/ledger schema requirements |
| Person 3 | Design system, navigation, login screens, dashboard layout, mock data |
| Person 4 | Stock catalogue, seeded price data, market schema, testing and deployment plan |

#### Milestones

- [ ] Repository and client/server applications run locally.
- [ ] Database schema and migration conventions are agreed upon.
- [ ] Authentication APIs work.
- [ ] Instrument catalogue is available.
- [ ] Frontend can render the initial dashboard.
- [ ] API contracts and shared response formats are documented.

**Week 1 exit criterion:** Every developer can work independently against agreed interfaces.

### Week 2 — Core Functionality

**Goal:** Complete the first end-to-end trading flow.

| Person | Work Items |
|---|---|
| Person 1 | Complete authentication, authorization, and backend integration support |
| Person 2 | Buy/sell execution, transactions, ledger, holdings, idempotency, core tests |
| Person 3 | Stock views, order ticket, portfolio UI, initial API integration |
| Person 4 | Price endpoints, stock search, data seeding, market-data tests |

#### Milestones

- [ ] Users can authenticate.
- [ ] Stocks and stored prices can be retrieved.
- [ ] Buy and sell orders can be submitted.
- [ ] Cash, holdings, trades, and ledger update consistently.
- [ ] Invalid orders are rejected safely.
- [ ] Core trading tests pass.

**Week 2 exit criterion:** A user can place a simulated trade and observe consistent changes in cash, holdings, and trade history.

### Week 3 — Integration and Analytics

**Goal:** Complete the main user experience and connect all core modules.

| Person | Work Items |
|---|---|
| Person 1 | Authorization review, API integration support, security fixes |
| Person 2 | Concurrency testing, accounting validation, trading-engine fixes |
| Person 3 | Real API integration, charts, history screens, responsive UI |
| Person 4 | Portfolio snapshots, integration tests, staging deployment |

#### Milestones

- [ ] Dashboard and stock detail pages use real backend APIs.
- [ ] Portfolio valuation and profit/loss are visible.
- [ ] Watchlists and trade history work.
- [ ] Price timestamps are displayed appropriately.
- [ ] Critical integration tests pass.
- [ ] Staging deployment is usable.

**Week 3 exit criterion:** The primary user journey works from registration through trading and portfolio review.

### Week 4 — Hardening and Release

**Goal:** Improve reliability, deploy, and prepare the final demonstration.

| Person | Work Items |
|---|---|
| Person 1 | Security review, authorization tests, backend error handling |
| Person 2 | Financial correctness audit, rollback and concurrency tests |
| Person 3 | UI polish, responsive behavior, error and empty states |
| Person 4 | Production deployment, end-to-end verification, release documentation |

#### Milestones

- [ ] Critical financial invariants are tested.
- [ ] Duplicate and concurrent order requests are handled safely.
- [ ] Authentication and ownership checks are verified.
- [ ] Production configuration is validated.
- [ ] Frontend and backend are deployed.
- [ ] README and setup instructions reflect the implementation.
- [ ] Screenshots and a demo walkthrough are prepared.

**Week 4 exit criterion:** The application is deployed, documented, and demonstrably reliable for its intended simulation scope.

---

## 8. API Contracts and Integration Rules

The backend and frontend must agree on request/response formats before integration.

### Example Order Request

```json
{
  "symbol": "RELIANCE",
  "side": "BUY",
  "quantity": 5,
  "idempotencyKey": "unique-client-generated-key"
}
```

The authenticated user must be derived from the authentication mechanism. The backend determines the authoritative execution price and balance.

### Proposed Endpoint Groups

| Endpoint | Responsibility | Primary Owner |
|---|---|---|
| `/api/auth/*` | Registration and login | Person 1 |
| `/api/stocks/*` | Stock catalogue and price history | Person 4 |
| `/api/orders/*` | Order submission and history | Person 2 |
| `/api/trades/*` | Completed trade history | Person 2 |
| `/api/portfolio/*` | Holdings, valuation, and performance | Person 2, with Person 4 supporting analytics |
| `/api/watchlists/*` | Watchlist operations | Person 1 for shared API conventions; Person 3 for UI |

All endpoints must use consistent status codes, error responses, validation rules, and authorization behavior.

---

## 9. Git Workflow and Collaboration

Use a single GitHub repository with `main` as the stable branch.

### Branch Naming

```text
feature/authentication
feature/trading-engine
feature/frontend-dashboard
feature/market-data
feature/portfolio-analytics
test/integration
fix/concurrent-orders
```

### Workflow

1. Pull the latest `main`.
2. Create a focused feature branch.
3. Implement and test the change.
4. Open a pull request.
5. Obtain review from the relevant module owner.
6. Resolve feedback and merge.
7. Verify integration on `main`.

### Review Responsibilities

- Person 1 reviews shared backend conventions and authentication changes.
- Person 2 reviews changes affecting financial state or trading calculations.
- Person 3 reviews frontend structure and user experience.
- Person 4 coordinates integration testing, deployment, and release readiness.

Database migrations and shared API changes require coordination before merging. No developer should commit directly to `main`.

---

## 10. Testing Strategy

### Unit Tests

- Order-cost calculations.
- Average-cost updates.
- Realized and unrealized P&L.
- Portfolio valuation.
- Request validation.
- Order status transitions.

### Integration Tests

- Registration and login.
- Protected endpoint authorization.
- Successful buy and sell flows.
- Insufficient cash and insufficient holdings.
- Transaction rollback.
- Duplicate idempotency key handling.
- User-specific resource ownership.

### Concurrency Tests

- Two simultaneous buy requests competing for insufficient cash.
- Two simultaneous sell requests competing for the same shares.
- Concurrent retries of the same idempotent request.
- Conflicting transactions against the same holding.

Tests must verify final database state and ledger consistency, not just HTTP response codes.

---

## 11. Team Operating Rhythm

- **Daily:** A short check-in covering completed work, next tasks, and blockers.
- **Twice weekly:** Integrate modules and resolve contract mismatches.
- **Weekly:** Demonstrate working functionality and review milestones.
- **Final week:** Freeze new features early enough to stabilize the application.

If a task is blocked by another module, use an agreed mock or interface rather than waiting idle.

## 12. Definition of Done

A feature is complete when:

- [ ] It satisfies its acceptance criteria.
- [ ] Inputs are validated.
- [ ] Relevant error cases are handled.
- [ ] Tests are added or updated where appropriate.
- [ ] No secrets or credentials are committed.
- [ ] Documentation is updated if the interface or setup changes.
- [ ] Code has been reviewed and merged.
- [ ] The integrated application still works.

## 13. Risk Management

| Risk | Mitigation |
|---|---|
| Market data unavailable or expensive | Begin with seeded/historical data and isolate the provider behind a service interface. |
| Incorrect accounting | Use precise monetary arithmetic, documented formulas, and automated tests. |
| Concurrent orders create inconsistent state | Use PostgreSQL transactions, appropriate locking, and concurrency tests. |
| Frontend waits on unfinished APIs | Agree on API contracts and use mocks early. |
| Integration conflicts | Assign clear module ownership and coordinate shared changes. |
| Deployment delays | Deploy a minimal working application early and test configuration continuously. |
| Scope expansion | Complete P0 requirements before adding advanced features. |

## 14. Out of Scope

The initial four-week release will not include:

- Real-money deposits or withdrawals.
- Real brokerage execution.
- Options, futures, or complex derivatives.
- A full exchange matching engine.
- Guaranteed real-time prices.
- Advanced tax, settlement, or regulatory workflows.

These may be considered after the core simulator is complete and stable.

---

## Final Project Goal

Throttle Trade should demonstrate strong full-stack engineering through a polished frontend, modular backend, reliable simulated trading engine, auditable accounting, and tested market-data integration.

**Priority order:**

1. Financial correctness.
2. Core trading functionality.
3. Integration and automated testing.
4. User experience.
5. Advanced features.

The defining milestone is the successful completion of an end-to-end trade with consistent cash, holdings, trade history, and ledger records. Every other feature should build on that foundation.
