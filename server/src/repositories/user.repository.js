
import prisma from "../config/database.js";

export const findUserByEmail = (email) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

export const findUserById = (userId) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      portfolio: {
        select: {
          id: true,
          cashBalance: true,
          createdAt: true,
        },
      },
    },
  });
};

export const createUserWithPortfolio = (userData) => {
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: userData,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    const portfolio = await tx.portfolio.create({
      data: {
        userId: user.id,
        cashBalance: "500000.00",
      },
      select: {
        id: true,
        cashBalance: true,
        createdAt: true,
      },
    });

    return {
      ...user,
      portfolio,
    };
  });
};
