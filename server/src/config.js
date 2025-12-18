// bu dosya : 
// .env dosyasını uygulamaya yükler
// ortam değişkenlerini tek merkezde toplar
// güvenli, okunabilir ve tutarlı bir yapı sağlar.
import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 5000;
export const DATABASE_URL = process.env.DATABASE_URL;
export const JWT_SECRET = process.env.JWT_SECRET;
export const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

if (!FINNHUB_API_KEY) {
  console.warn(
    "WARN: FINNHUB_API_KEY is missing. Price fetching will fail."
  );
}
export const PRICE_POLL_INTERVAL_MS = Number(process.env.PRICE_POLL_INTERVAL_MS || 300000);
export const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";
