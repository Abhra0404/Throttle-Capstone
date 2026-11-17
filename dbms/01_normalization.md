# Database Normalization — Throttle Trade

## 1. Introduction

Normalization is the process of organizing data in a relational database to reduce redundancy and prevent insertion, update, and deletion anomalies.

The Throttle Trade application uses PostgreSQL with Prisma ORM. Its database consists of six main models:

- User
- Portfolio
- Stock
- Holding
- Order
- Watchlist

This document explains the normalization of these models up to Third Normal Form (3NF), including their primary keys, candidate keys, functional dependencies, and relationships.

## 2. Database Models

### 2.1 User

Stores registered user account information.

**Primary Key:** `id`

**Unique Attribute:** `email`

Attributes:
- id
- name
- email
- passwordHash
- createdAt
- updatedAt

### 2.2 Portfolio

Stores the virtual trading portfolio associated with each user.

**Primary Key:** `id`

**Unique Attribute:** `userId`

Attributes:
- id
- userId
- cashBalance
- createdAt
- updatedAt

Each user has one portfolio, establishing a one-to-one relationship between User and Portfolio.

### 2.3 Stock

Stores information about stocks available for paper trading.

**Primary Key:** `id`

**Unique Attribute:** `symbol`

Attributes:
- id
- symbol
- name
- sector
- currentPrice
- change
- changePercent
- volume
- isActive
- createdAt
- updatedAt

### 2.4 Holding

Stores the stocks currently held in a user's portfolio.

**Primary Key:** `id`

**Composite Unique Constraint:** `(portfolioId, stockId)`

Attributes:
- id
- portfolioId
- stockId
- quantity
- averagePrice
- createdAt
- updatedAt

A portfolio can contain multiple holdings, but each stock can appear only once within a particular portfolio.

### 2.5 Order

Stores executed trading orders made by users.

**Primary Key:** `id`

Attributes:
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

Each order belongs to one portfolio and references the stock involved in the transaction.

### 2.6 Watchlist

Stores stocks added to users' watchlists.

**Primary Key:** `id`

**Composite Unique Constraint:** `(userId, stockId)`

Attributes:
- id
- userId
- stockId
- createdAt

The composite unique constraint ensures that a user cannot add the same stock to their watchlist more than once.

## 3. First Normal Form (1NF)

A relation is in First Normal Form when:

- Each attribute contains a single, atomic value.
- There are no repeating groups or multivalued attributes.
- Each record can be uniquely identified using a candidate key.

The Throttle Trade database uses individual columns for attributes such as user name, email, stock symbol, current price, portfolio balance, quantity, and order status.

For example:

- User information is stored separately in the User model.
- Stock information is stored separately in the Stock model.
- Holding quantities and average purchase prices are stored in the Holding model.
- Individual trading transactions are stored in the Order model.

Each model has a primary key that uniquely identifies its records.

The database does not use repeating relational groups or multivalued columns in these models.

Therefore, all six models are designed to satisfy First Normal Form (1NF).

## 4. Second Normal Form (2NF)

A relation is in Second Normal Form when:

- It satisfies First Normal Form.
- Every non-prime attribute is fully functionally dependent on the entire candidate key.
- No partial dependency exists.

The Throttle Trade schema uses single-column primary keys for all six models. Therefore, partial dependencies with respect to these primary keys cannot occur.

The Holding and Watchlist models also contain composite unique constraints:

**Holding:**

`(portfolioId, stockId) → quantity, averagePrice, createdAt, updatedAt`

The quantity and average purchase price depend on the combination of a portfolio and a stock, rather than on either attribute independently.

**Watchlist:**

`(userId, stockId) → createdAt`

The creation timestamp of a watchlist entry depends on the combination of the user and the stock.

Stock information is not repeated in Holding or Watchlist. Instead, these models reference the Stock model through `stockId`.

Similarly, portfolio information is referenced through `portfolioId`, avoiding unnecessary duplication.

Therefore, all six models satisfy Second Normal Form (2NF).

## 5. Third Normal Form (3NF)

A relation is in Third Normal Form when:

- It satisfies Second Normal Form.
- Every non-key attribute depends directly on a candidate key.
- There are no transitive dependencies between non-key attributes.

### User

Functional dependencies:

`id → name, email, passwordHash, createdAt, updatedAt`

`email → id, name, passwordHash, createdAt, updatedAt`

Since email is unique, it acts as an alternate candidate key.

User account information is maintained independently of portfolio and trading information.

### Portfolio

Functional dependencies:

`id → userId, cashBalance, createdAt, updatedAt`

`userId → id, cashBalance, createdAt, updatedAt`

Since `userId` is unique, it acts as an alternate candidate key.

Portfolio information is stored separately from user details and holding records.

### Stock

Functional dependencies:

`id → symbol, name, sector, currentPrice, change, changePercent, volume, isActive, createdAt, updatedAt`

`symbol → id, name, sector, currentPrice, change, changePercent, volume, isActive, createdAt, updatedAt`

Since symbol is unique, it acts as an alternate candidate key.

Stock information is maintained centrally instead of being duplicated across holdings, orders, and watchlists.

### Holding

Functional dependencies:

`id → portfolioId, stockId, quantity, averagePrice, createdAt, updatedAt`

`(portfolioId, stockId) → id, quantity, averagePrice, createdAt, updatedAt`

The composite unique constraint ensures that each stock has only one holding record per portfolio.

Stock names and prices are obtained through the Stock relationship rather than duplicated in the Holding model.

### Order

Functional dependency:

`id → portfolioId, stockId, side, status, quantity, price, total, realizedPnl, createdAt`

Each order is uniquely identified by its ID.

The stock and portfolio details are maintained in their respective models and referenced through foreign keys.

The execution price and total are stored as transaction-specific values, preserving the details of the executed order even when the stock's current price changes.

### Watchlist

Functional dependencies:

`id → userId, stockId, createdAt`

`(userId, stockId) → id, createdAt`

The composite unique constraint prevents duplicate stock entries for the same user.

Stock information is referenced through `stockId`, avoiding duplication of stock attributes.

No transitive dependencies are explicitly represented in the provided Prisma schema. All non-key attributes are designed to depend directly on their respective candidate keys.

Therefore, the six models are designed to satisfy Third Normal Form (3NF).

## 6. Functional Dependencies Summary

| Model | Candidate Key(s) | Functional Dependency |
|---|---|---|
| User | id, email | id → all other attributes |
| Portfolio | id, userId | id → all other attributes |
| Stock | id, symbol | id → all other attributes |
| Holding | id, (portfolioId, stockId) | (portfolioId, stockId) → all other attributes |
| Order | id | id → all other attributes |
| Watchlist | id, (userId, stockId) | (userId, stockId) → all other attributes |

## 7. Relationships Between Models

The Throttle Trade database uses foreign keys to establish relationships between its models.

| Relationship | Type | Description |
|---|---|---|
| User – Portfolio | One-to-One | Each user has one portfolio. |
| User – Watchlist | One-to-Many | A user can have multiple watchlist entries. |
| Portfolio – Holding | One-to-Many | A portfolio can contain multiple holdings. |
| Portfolio – Order | One-to-Many | A portfolio can have multiple trading orders. |
| Stock – Holding | One-to-Many | A stock can be held in multiple portfolios. |
| Stock – Order | One-to-Many | A stock can appear in multiple orders. |
| Stock – Watchlist | One-to-Many | A stock can appear in multiple users' watchlists. |

These relationships are implemented using Prisma relations and foreign-key constraints in PostgreSQL.

## 8. Normalization Benefits

Normalization provides the following benefits to the Throttle Trade application:

- Reduces unnecessary data redundancy.
- Maintains consistency across user, stock, portfolio, and trading records.
- Prevents insertion, update, and deletion anomalies.
- Separates stock information from individual user holdings and transactions.
- Maintains referential integrity through foreign-key constraints.
- Simplifies database maintenance and future feature development.
- Ensures that trading records remain independent of changes to current stock prices.

## 9. Conclusion

The Throttle Trade database consists of six models: User, Portfolio, Stock, Holding, Order, and Watchlist.

Each model uses a primary key, with additional unique constraints and composite unique constraints wherever required.

The schema separates user accounts, stock information, portfolio holdings, trading transactions, and watchlist entries into distinct relational models.

Based on the declared attributes, candidate keys, functional dependencies, and Prisma relationships, the database is designed to satisfy First Normal Form (1NF), Second Normal Form (2NF), and Third Normal Form (3NF).

This normalized database structure provides a consistent and scalable foundation for the Throttle Trade paper-trading platform.