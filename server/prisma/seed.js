
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { stocks } from "../../client/src/data/mockData.js";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing from .env");
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Starting stock database seed...");

  for (const stock of stocks) {
    await prisma.stock.upsert({
      where: {
        symbol: stock.symbol,
      },
      update: {
        name: stock.name,
        sector: stock.sector ?? null,
        currentPrice: String(stock.price),
        change: String(stock.change),
        changePercent: String(stock.changePercent),
        isActive: true,
      },
      create: {
        symbol: stock.symbol,
        name: stock.name,
        sector: stock.sector ?? null,
        currentPrice: String(stock.price),
        change: String(stock.change),
        changePercent: String(stock.changePercent),
        volume: BigInt(0),
        isActive: true,
      },
    });

    console.log(`Seeded: ${stock.symbol}`);
  }

  console.log(`\nSuccessfully seeded ${stocks.length} stocks.`);
}

main()
  .catch((error) => {
    console.error("Stock seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
