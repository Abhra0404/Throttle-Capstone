
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { stocks } from "../../client/src/data/mockData.js";

const additionalStocks = [
  ["ADANIENT", "Adani Enterprises", "Energy"],
  ["ADANIPORTS", "Adani Ports", "Industrials"],
  ["APOLLOHOSP", "Apollo Hospitals", "Healthcare"],
  ["ASIANPAINT", "Asian Paints", "Consumer"],
  ["AXISBANK", "Axis Bank", "Banking"],
  ["BAJAJ-AUTO", "Bajaj Auto", "Automotive"],
  ["BAJFINANCE", "Bajaj Finance", "Financial Services"],
  ["BAJAJFINSV", "Bajaj Finserv", "Financial Services"],
  ["BHARTIARTL", "Bharti Airtel", "Telecom"],
  ["BPCL", "Bharat Petroleum", "Energy"],
  ["BRITANNIA", "Britannia Industries", "Consumer"],
  ["CIPLA", "Cipla", "Healthcare"],
  ["COALINDIA", "Coal India", "Metals"],
  ["DIVISLAB", "Divi's Laboratories", "Healthcare"],
  ["DRREDDY", "Dr. Reddy's Laboratories", "Healthcare"],
  ["EICHERMOT", "Eicher Motors", "Automotive"],
  ["GRASIM", "Grasim Industries", "Materials"],
  ["HCLTECH", "HCL Technologies", "IT"],
  ["HINDALCO", "Hindalco Industries", "Metals"],
  ["HINDUNILVR", "Hindustan Unilever", "Consumer"],
  ["IOC", "Indian Oil Corporation", "Energy"],
  ["ITC", "ITC", "Consumer"],
  ["JSWSTEEL", "JSW Steel", "Metals"],
  ["KOTAKBANK", "Kotak Mahindra Bank", "Banking"],
  ["LT", "Larsen & Toubro", "Industrials"],
  ["M&M", "Mahindra & Mahindra", "Automotive"],
  ["MARUTI", "Maruti Suzuki", "Automotive"],
  ["NESTLEIND", "Nestle India", "Consumer"],
  ["NTPC", "NTPC", "Utilities"],
  ["ONGC", "ONGC", "Energy"],
  ["POWERGRID", "Power Grid Corporation", "Utilities"],
  ["SBILIFE", "SBI Life Insurance", "Financial Services"],
  ["SHREECEM", "Shree Cement", "Materials"],
  ["SUNPHARMA", "Sun Pharmaceutical", "Healthcare"],
  ["TATACONSUM", "Tata Consumer Products", "Consumer"],
  ["TATAMOTORS", "Tata Motors", "Automotive"],
  ["TATASTEEL", "Tata Steel", "Metals"],
  ["TECHM", "Tech Mahindra", "IT"],
  ["TITAN", "Titan Company", "Consumer"],
  ["ULTRACEMCO", "UltraTech Cement", "Materials"],
  ["UPL", "UPL", "Materials"],
  ["WIPRO", "Wipro", "IT"],
];

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing from .env");
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Starting stock database seed...");

  const seedStocks = [
    ...stocks,
    ...additionalStocks.map(([symbol, name, sector]) => ({
      symbol,
      name,
      sector,
      price: 100,
      change: 0,
      changePercent: 0,
    })),
  ];

  for (const stock of seedStocks) {
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

  console.log(`\nSuccessfully seeded ${seedStocks.length} stocks.`);
}

main()
  .catch((error) => {
    console.error("Stock seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
