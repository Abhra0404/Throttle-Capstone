# Throttle Trade

**A full-stack paper trading platform for the Indian stock market.**

Throttle Trade is a web-based stock market simulator that allows users to explore Indian equities, execute simulated buy and sell orders using virtual money, manage portfolios, and analyze investment performance — without risking real capital.

The project focuses on building a reliable trading engine, transaction-safe portfolio accounting, market data integration, and an intuitive trading dashboard.

> **Disclaimer:** Throttle Trade is an educational simulation platform. It does not execute real trades, provide brokerage services, or handle real-money deposits.

## Overview

Throttle Trade aims to make stock market simulation practical and accessible while demonstrating full-stack development and backend engineering principles.

Users will be able to:

- Explore stocks listed on the National Stock Exchange of India (NSE).
- View available market prices and historical price charts.
- Place simulated market buy and sell orders.
- Manage virtual cash and stock holdings.
- Track portfolio value, profit and loss, and trade history.
- Create watchlists to follow selected stocks.
- Analyze portfolio performance over time.

The initial version will use virtual funds and stored market price snapshots. Real-time market data and additional order types may be introduced in later iterations.

## Key Features

### Market Dashboard
- Browse supported Indian equities.
- View stock prices and historical charts.
- Inspect available price and market information.
- Track selected stocks through watchlists.

### Paper Trading
- Start with a configurable virtual cash balance.
- Place simulated buy and sell orders.
- Validate available cash and share quantities before execution.
- Maintain order status and execution history.
- Prevent duplicate order execution on request retries.

### Portfolio Management
- Track current stock holdings.
- Calculate portfolio market value and invested value.
- Display realized and unrealized profit or loss.
- Track available cash and overall portfolio value.
- Review completed trades and cash movements.

### Portfolio Analytics
- Visualize portfolio performance over time.
- Compare performance against a supported market benchmark.
- Review trading activity and portfolio allocation.

### Authentication and Data Integrity
- User registration and login.
- Protected API endpoints.
- Secure password hashing.
- User-specific portfolios and watchlists.
- Transaction-safe updates to cash balances, holdings, and trades.

*Features will be marked complete as they are implemented and tested.*

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React, JavaScript, Vite |
| Styling | Tailwind CSS, shadcn/ui where applicable |
| Charts | Lightweight Charts / Recharts |
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | JWT, bcrypt |
| API communication | Axios |
| Routing | React Router |
| Testing | Vitest, Supertest |
| Version control | Git, GitHub |

The application will use JavaScript with ES modules across the frontend and backend.

## Architecture

Throttle Trade will follow a **modular monolith architecture** with a separate frontend and backend.

```text
                   ┌──────────────────────┐
                   │     React Client     │
                   │ Dashboard, Charts,   │
                   │ Orders, Portfolio    │
                   └──────────┬───────────┘
                              │ HTTP / REST API
                   ┌──────────▼───────────┐
                   │    Express Server    │
                   │ Authentication       │
                   │ Request Validation   │
                   │ Business Logic       │
                   └──────────┬───────────┘
                              │
              ┌───────────────┼────────────────┐
              │               │                │
     ┌────────▼───────┐ ┌─────▼────────┐ ┌─────▼──────────┐
     │ Trading Engine │ │ Market Data  │ │ Portfolio      │
     │ Orders & Trades│ │ Service      │ │ Analytics      │
     └────────┬───────┘ └─────┬────────┘ └─────┬──────────┘
              │               │                │
              └───────────────┼────────────────┘
                              │
                   ┌──────────▼───────────┐
                   │     PostgreSQL       │
                   │ Users, Orders, Trades│
                   │ Holdings, Price Data │
                   │ Cash Ledger          │
                   └──────────────────────┘
```

### Backend Design Principles

- **Separation of concerns:** Routes, controllers, services, and data access logic will have distinct responsibilities.
- **Transactional execution:** Related financial records will be updated atomically using database transactions.
- **Concurrency safety:** Database locking and appropriate constraints will protect against conflicting order requests.
- **Idempotency:** Repeated submissions of the same order request will not create duplicate executions.
- **Auditable accounting:** Cash movements will be recorded in a ledger rather than relying solely on a mutable balance.
- **Input validation:** API requests will be validated before reaching business logic.

## Database Design

The initial database schema is planned around these entities:

| Table | Purpose |
|---|---|
| `users` | User accounts and authentication data |
| `instruments` | Supported stock symbols and exchange identifiers |
| `market_prices` | Stored prices and historical OHLCV data |
| `orders` | Submitted orders and execution statuses |
| `trades` | Completed simulated executions |
| `holdings` | Current share quantities and average cost |
| `cash_ledger` | Auditable virtual cash movements |
| `watchlists` | User-selected stocks |

Prisma will manage database schema definitions and migrations. Appropriate indexes, relationships, and constraints will be added as the data model develops.

## Project Structure

```text
throttle-trade/
├── client/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── features/
│       │   ├── auth/
│       │   ├── market/
│       │   ├── trading/
│       │   └── portfolio/
│       ├── hooks/
│       ├── layouts/
│       ├── pages/
│       ├── services/
│       ├── utils/
│       ├── App.jsx
│       └── main.jsx
│
├── server/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── validators/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   ├── tests/
│   └── package.json
│
├── .gitignore
├── package.json
└── README.md
```

This structure may evolve as implementation progresses.

## Getting Started

### Prerequisites

Install the following before starting development:

- Node.js (an active LTS release recommended)
- npm
- PostgreSQL
- Git

### 1. Clone the Repository

```bash
git clone <repository-url>
cd throttle-trade
```

Replace `<repository-url>` with the URL of your GitHub repository.

### 2. Install Dependencies

Install root dependencies and the dependencies for each application, according to the package configuration:

```bash
npm install
npm install --prefix client
npm install --prefix server
```

### 3. Configure Environment Variables

Create local environment files for the client and server based on the environment templates provided in the repository.

Example backend configuration:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/throttle_trade"
JWT_SECRET=replace_with_a_strong_random_secret
CLIENT_URL=http://localhost:5173
```

Example frontend configuration:

```env
VITE_API_URL=http://localhost:5000/api
```

Replace the database credentials and secret with your local values. Never commit real credentials, private keys, or populated environment files.

### 4. Set Up the Database

Create a PostgreSQL database named `throttle_trade`, then configure `DATABASE_URL` in the backend environment file.

Once the Prisma schema is configured, apply the initial migration:

```bash
cd server
npx prisma migrate dev --name init
npx prisma generate
```

These commands assume that the Prisma schema and database configuration have already been created.

### 5. Start the Applications

Start the backend and frontend using the scripts configured in their respective `package.json` files.

For example, if both applications define a `dev` script:

```bash
# Terminal 1
npm run dev --prefix server
```

```bash
# Terminal 2
npm run dev --prefix client
```

The local addresses will typically be:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

Actual commands and ports may differ depending on the final project configuration.

## Trading and Accounting Rules

Correct accounting is central to the project.

1. Orders must be validated against the user's available cash or owned share quantity.
2. A buy or sell execution must update the corresponding trade, holding, and cash records consistently.
3. Failed transactions must not leave partially updated financial records.
4. Duplicate requests must not execute the same order more than once.
5. Portfolio values and profit/loss calculations must use documented pricing and accounting rules.
6. Prices must include timestamps so users can distinguish fresh data from stale snapshots.

The initial implementation will support market orders executed against the latest available stored price snapshot. Limit orders and more advanced order types are outside the initial scope.

## Market Data

The initial release will use seeded or historical price data for a curated set of Indian equities. A market data provider can be integrated later through a dedicated market data service.

The application will clearly identify the timestamp and nature of its prices. Live market data will not be implied unless a suitable provider is configured.

Any external market data source must be used in accordance with its licensing, subscription, and redistribution terms.

## Testing

Testing will focus on business correctness as well as application behavior.

Planned test coverage includes:

- Authentication and API authorization.
- Valid and invalid buy/sell orders.
- Insufficient cash and insufficient holdings.
- Concurrent order submissions.
- Duplicate request handling.
- Transaction rollback on failure.
- Portfolio valuation and profit/loss calculations.
- API error handling and validation.

The trading engine's financial invariants will receive priority over superficial test coverage.

## Development Roadmap

The project is planned for a four-week development cycle.

- [ ] **Week 1 — Foundation:** Repository setup, database schema, authentication, stock catalogue, and price storage.
- [ ] **Week 2 — Trading Engine:** Order execution, transaction safety, cash ledger, holdings, and trade history.
- [ ] **Week 3 — Portfolio and Analytics:** Charts, watchlists, profit/loss calculations, and portfolio performance.
- [ ] **Week 4 — Release:** Integration testing, concurrency testing, deployment, documentation, and demo preparation.

### Potential Future Enhancements

- Limit orders and order cancellation.
- Market-session and trading-holiday support.
- Improved historical market data ingestion.
- Benchmark comparisons and drawdown analytics.
- Paper-trading competitions and leaderboards.
- Real-time price updates where supported by the chosen provider.

## Team Workflow

For a four-person team, work can be divided into these areas:

1. **Backend and API:** Authentication, application structure, database integration, and REST endpoints.
2. **Trading Engine:** Order execution, transaction safety, cash ledger, and accounting tests.
3. **Frontend:** Dashboard, stock views, order ticket, portfolio, and charts.
4. **Market Data and Quality:** Price ingestion, analytics support, integration testing, and deployment.

Team members should agree on API contracts and database interfaces early to reduce integration conflicts.

## Contributing

1. Create a feature branch from `main`.
2. Keep changes focused and use descriptive commit messages.
3. Test changes before opening a pull request.
4. Review changes before merging them into `main`.
5. Never commit secrets or local environment files.

## Disclaimer

Throttle Trade is intended for educational purposes and simulated investing only. It is not a brokerage platform, investment advisory service, or source of guaranteed-real-time market data. Simulated execution prices and portfolio results may differ significantly from real market conditions.

## License

A license has not yet been selected. Add a `LICENSE` file before distributing the project under an open-source license.

---

**Throttle Trade** — Learn the mechanics of trading by building the system behind the simulation.
