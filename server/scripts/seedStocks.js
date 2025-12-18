// server/scripts/seedStocks.js
import { query } from "../src/db.js";

/*
  Finnhub ile %100 uyumlu, US market hisseleri
  (stabil ve sorunsuz çalışan semboller)
*/
const stocks = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "MSFT", name: "Microsoft Corp." },
  { symbol: "GOOGL", name: "Alphabet Class A" },
  { symbol: "AMZN", name: "Amazon.com Inc." },
  { symbol: "META", name: "Meta Platforms" },
  { symbol: "TSLA", name: "Tesla Inc." },
  { symbol: "NVDA", name: "Nvidia Corp." },
  { symbol: "NFLX", name: "Netflix Inc." },
  { symbol: "AMD", name: "Advanced Micro Devices" },
  { symbol: "INTC", name: "Intel Corp." },

  { symbol: "ORCL", name: "Oracle Corp." },
  { symbol: "IBM", name: "IBM" },
  { symbol: "ADBE", name: "Adobe Inc." },
  { symbol: "CRM", name: "Salesforce Inc." },
  { symbol: "UBER", name: "Uber Technologies" },
  { symbol: "DIS", name: "Walt Disney Co." },
  { symbol: "PYPL", name: "PayPal Holdings" },
  { symbol: "BABA", name: "Alibaba Group" },
  { symbol: "QCOM", name: "Qualcomm Inc." },
  { symbol: "AVGO", name: "Broadcom Inc." }
];

for (const s of stocks) {
  await query(
    `
    INSERT INTO stocks(symbol, display_name)
    VALUES ($1, $2)
    ON CONFLICT (symbol) DO NOTHING
    `,
    [s.symbol, s.name]
  );
}

console.log("✅ Stocks seeded successfully");
process.exit();
