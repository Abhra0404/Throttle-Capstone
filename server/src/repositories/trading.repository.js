
import { Prisma } from "@prisma/client";
import prisma from "../config/database.js";

const executeTradeTransaction = async (userId, { symbol, side, quantity }) => {
  return prisma.$transaction(
    async (tx) => {
      const portfolio = await tx.portfolio.findUnique({
        where: { userId },
      });

      if (!portfolio) {
        const error = new Error("Portfolio not found.");
        error.statusCode = 404;
        throw error;
      }

      const stock = await tx.stock.findUnique({
        where: { symbol },
      });

      if (!stock || !stock.isActive) {
        const error = new Error("Stock not found or inactive.");
        error.statusCode = 404;
        throw error;
      }

      const price = new Prisma.Decimal(stock.currentPrice.toString());
      const tradeTotal = price.mul(quantity);
      const cash = new Prisma.Decimal(portfolio.cashBalance.toString());

      const holding = await tx.holding.findUnique({
        where: {
          portfolioId_stockId: {
            portfolioId: portfolio.id,
            stockId: stock.id,
          },
        },
      });

      let realizedPnl = new Prisma.Decimal(0);

      if (side === "BUY") {
        if (cash.lessThan(tradeTotal)) {
          const error = new Error("Insufficient virtual cash.");
          error.statusCode = 400;
          throw error;
        }

        const oldQuantity = holding?.quantity ?? 0;
        const newQuantity = oldQuantity + quantity;

        const oldCost = holding
          ? new Prisma.Decimal(holding.averagePrice.toString()).mul(oldQuantity)
          : new Prisma.Decimal(0);

        const newAveragePrice = oldCost
          .plus(tradeTotal)
          .div(newQuantity)
          .toDecimalPlaces(2);

        await tx.portfolio.update({
          where: { id: portfolio.id },
          data: {
            cashBalance: {
              decrement: tradeTotal,
            },
          },
        });

        await tx.holding.upsert({
          where: {
            portfolioId_stockId: {
              portfolioId: portfolio.id,
              stockId: stock.id,
            },
          },
          update: {
            quantity: newQuantity,
            averagePrice: newAveragePrice,
          },
          create: {
            portfolioId: portfolio.id,
            stockId: stock.id,
            quantity,
            averagePrice: price,
          },
        });
      } else {
        if (!holding || holding.quantity < quantity) {
          const error = new Error("Insufficient stock quantity to sell.");
          error.statusCode = 400;
          throw error;
        }

        const averagePrice = new Prisma.Decimal(
          holding.averagePrice.toString()
        );

        realizedPnl = price
          .minus(averagePrice)
          .mul(quantity)
          .toDecimalPlaces(2);

        await tx.portfolio.update({
          where: { id: portfolio.id },
          data: {
            cashBalance: {
              increment: tradeTotal,
            },
          },
        });

        const remainingQuantity = holding.quantity - quantity;

        if (remainingQuantity === 0) {
          await tx.holding.delete({
            where: { id: holding.id },
          });
        } else {
          await tx.holding.update({
            where: { id: holding.id },
            data: {
              quantity: remainingQuantity,
            },
          });
        }
      }

      const order = await tx.order.create({
        data: {
          portfolioId: portfolio.id,
          stockId: stock.id,
          side,
          quantity,
          price,
          total: tradeTotal,
          realizedPnl,
        },
        select: {
          id: true,
          side: true,
          status: true,
          quantity: true,
          price: true,
          total: true,
          realizedPnl: true,
          createdAt: true,
          stock: {
            select: {
              symbol: true,
              name: true,
            },
          },
        },
      });

      return order;
    },
    {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    }
  );
};

export const executeTrade = async (userId, tradeData) => {
  // Serializable transactions can conflict under concurrent trading.
  // Retry serialization conflicts a small number of times.
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await executeTradeTransaction(userId, tradeData);
    } catch (error) {
      if (error.code === "P2034" && attempt < 2) {
        continue;
      }

      throw error;
    }
  }
};

export const findStocks = async ({ search, sector, page, limit }) => {
  const where = {
    isActive: true,
    ...(sector ? { sector: { equals: sector, mode: "insensitive" } } : {}),
    ...(search
      ? {
          OR: [
            { symbol: { contains: search, mode: "insensitive" } },
            { name: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [stocks, total] = await Promise.all([
    prisma.stock.findMany({
      where,
      orderBy: { symbol: "asc" },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        symbol: true,
        name: true,
        sector: true,
        currentPrice: true,
        change: true,
        changePercent: true,
      },
    }),
    prisma.stock.count({ where }),
  ]);

  return {
    stocks,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const findStockBySymbol = (symbol) => {
  return prisma.stock.findFirst({
    where: {
      symbol,
      isActive: true,
    },
    select: {
      id: true,
      symbol: true,
      name: true,
      sector: true,
      currentPrice: true,
      change: true,
      changePercent: true,
      volume: true,
    },
  });
};

export const findPortfolioByUserId = async (userId) => {
  const portfolio = await prisma.portfolio.findUnique({
    where: { userId },
    include: {
      holdings: {
        include: {
          stock: {
            select: {
              symbol: true,
              name: true,
              currentPrice: true,
              change: true,
              changePercent: true,
            },
          },
        },
        orderBy: { createdAt: "asc" },
      },
      orders: {
        where: { side: "SELL", status: "EXECUTED" },
        select: { realizedPnl: true },
      },
    },
  });

  if (!portfolio) return null;

  const cashBalance = new Prisma.Decimal(portfolio.cashBalance.toString());

  let totalInvested = new Prisma.Decimal(0);
  let marketValue = new Prisma.Decimal(0);

  const holdings = portfolio.holdings.map((holding) => {
    const averagePrice = new Prisma.Decimal(
      holding.averagePrice.toString()
    );
    const currentPrice = new Prisma.Decimal(
      holding.stock.currentPrice.toString()
    );

    const invested = averagePrice.mul(holding.quantity);
    const currentValue = currentPrice.mul(holding.quantity);
    const unrealizedPnl = currentValue.minus(invested);

    totalInvested = totalInvested.plus(invested);
    marketValue = marketValue.plus(currentValue);

    return {
      id: holding.id,
      symbol: holding.stock.symbol,
      name: holding.stock.name,
      quantity: holding.quantity,
      averagePrice,
      currentPrice,
      invested,
      currentValue,
      unrealizedPnl,
      unrealizedPnlPercent: invested.isZero()
        ? new Prisma.Decimal(0)
        : unrealizedPnl.div(invested).mul(100).toDecimalPlaces(2),
    };
  });

  const realizedPnl = portfolio.orders.reduce(
    (total, order) => total.plus(order.realizedPnl.toString()),
    new Prisma.Decimal(0)
  );

  const totalPnl = realizedPnl.plus(
    marketValue.minus(totalInvested)
  );

  const totalValue = cashBalance.plus(marketValue);

  return {
    id: portfolio.id,
    cashBalance,
    totalInvested,
    marketValue,
    totalValue,
    realizedPnl,
    unrealizedPnl: marketValue.minus(totalInvested),
    totalPnl,
    totalPnlPercent: totalInvested.isZero()
      ? new Prisma.Decimal(0)
      : totalPnl.div(totalInvested).mul(100).toDecimalPlaces(2),
    holdings,
  };
};

export const findOrdersByUserId = (userId, { page, limit }) => {
  return prisma.order.findMany({
    where: {
      portfolio: { userId },
    },
    include: {
      stock: {
        select: {
          symbol: true,
          name: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  });
};

export const countOrdersByUserId = (userId) => {
  return prisma.order.count({
    where: {
      portfolio: { userId },
    },
  });
};
