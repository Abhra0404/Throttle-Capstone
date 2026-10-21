
export const marketIndices = [
  {
    name: "NIFTY 50",
    symbol: "NIFTY",
    value: 24872.35,
    change: 184.25,
    changePercent: 0.75,
  },
  {
    name: "SENSEX",
    symbol: "SENSEX",
    value: 81559.54,
    change: 621.30,
    changePercent: 0.77,
  },
  {
    name: "NIFTY BANK",
    symbol: "BANKNIFTY",
    value: 51248.80,
    change: -126.45,
    changePercent: -0.25,
  },
];

export const stocks = [
  {
    symbol: "RELIANCE",
    name: "Reliance Industries",
    price: 1428.5,
    change: 18.4,
    changePercent: 1.31,
    sector: "Energy",
  },
  {
    symbol: "TCS",
    name: "Tata Consultancy Services",
    price: 3245.75,
    change: -12.25,
    changePercent: -0.38,
    sector: "IT",
  },
  {
    symbol: "HDFCBANK",
    name: "HDFC Bank",
    price: 1762.3,
    change: 21.6,
    changePercent: 1.24,
    sector: "Banking",
  },
  {
    symbol: "INFY",
    name: "Infosys",
    price: 1518.9,
    change: 8.15,
    changePercent: 0.54,
    sector: "IT",
  },
  {
    symbol: "ICICIBANK",
    name: "ICICI Bank",
    price: 1286.4,
    change: -5.7,
    changePercent: -0.44,
    sector: "Banking",
  },
  {
    symbol: "SBIN",
    name: "State Bank of India",
    price: 824.6,
    change: 10.2,
    changePercent: 1.25,
    sector: "Banking",
  },
];

export const holdings = [
  {
    symbol: "RELIANCE",
    name: "Reliance Industries",
    quantity: 12,
    averagePrice: 1395.2,
    currentPrice: 1428.5,
  },
  {
    symbol: "HDFCBANK",
    name: "HDFC Bank",
    quantity: 20,
    averagePrice: 1740.0,
    currentPrice: 1762.3,
  },
  {
    symbol: "INFY",
    name: "Infosys",
    quantity: 15,
    averagePrice: 1535.5,
    currentPrice: 1518.9,
  },
];

export const chartRanges = ["1D", "1W", "1M", "3M", "1Y"];

export const portfolioChartData = {
  "1D": [
    { time: "09:15", value: 98400 },
    { time: "10:00", value: 99100 },
    { time: "11:00", value: 98750 },
    { time: "12:00", value: 100200 },
    { time: "13:00", value: 99800 },
    { time: "14:00", value: 101100 },
    { time: "15:00", value: 102450 },
  ],
  "1W": [
    { time: "Mon", value: 96000 },
    { time: "Tue", value: 97400 },
    { time: "Wed", value: 96800 },
    { time: "Thu", value: 99100 },
    { time: "Fri", value: 102450 },
  ],
  "1M": [
    { time: "Week 1", value: 92500 },
    { time: "Week 2", value: 95600 },
    { time: "Week 3", value: 94100 },
    { time: "Week 4", value: 102450 },
  ],
  "3M": [
    { time: "Aug", value: 88000 },
    { time: "Sep", value: 93500 },
    { time: "Oct", value: 102450 },
  ],
  "1Y": [
    { time: "Jan", value: 75000 },
    { time: "Mar", value: 81000 },
    { time: "May", value: 86500 },
    { time: "Jul", value: 91000 },
    { time: "Sep", value: 97000 },
    { time: "Oct", value: 102450 },
  ],
};

export const initialPortfolio = {
  availableCash: 100000,
  totalInvested: 50000,
  totalValue: 102450,
  totalProfitLoss: 2450,
  totalProfitLossPercent: 2.45,
};
