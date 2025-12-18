// src/services/stockSource.service.js
// Amaç: Dış API'den fiyatları çekip normalize etmek
import { FINNHUB_API_KEY } from "../config.js";
export async function fetchPriceForSymbol(symbol) {
  if (!FINNHUB_API_KEY) {
    throw new Error("FINNHUB_API_KEY missing in .env");
  }
  const url = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${FINNHUB_API_KEY}`;
  const res = await fetch(url);

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Finnhub fetch failed for ${symbol} status=${res.status} body=${text}`);
  }

  const data = await res.json();
  const price = Number(data?.c);
  // burada yapılan işlem data yani finnhub api'den gelen json cevabıdır. c ( current price (anlık fiyat)) finnhub api'sinde fiyat alanı standard olarak c dir.

  if (!Number.isFinite(price) || price <= 0) throw new Error(`Finnhub price parse failed for ${symbol}`);
  return { symbol, price };
}