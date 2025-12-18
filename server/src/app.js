// bu dosya : 
// express uygulamasını oluşturur.
// global middleware'leri tanımlar.
// tüm route'ları bağlar.
// hata yakalama mekanizmasını merkezileştirir.
import express from "express";
import cors from "cors";
// frontend ( react ) localhost:5173 backend localhost:5000 de çalışır.
// tarayıcı bu durumu bloklar cors middleware'i ise bu engeli kontrollü bir şekilde kaldırır. 
import { CORS_ORIGIN } from "./config.js";
import { errorHandler } from "./middleware/error.js";
import authRoutes from "./routes/auth.routes.js";
import stocksRoutes from "./routes/stocks.routes.js";
import watchlistRoutes from "./routes/watchlist.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import alertsRoutes from "./routes/alerts.routes.js";
// her iş alanını ayrı route dosyasına böldük.

export const app = express();

app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json()); 

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/stocks", stocksRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/alerts", alertsRoutes);
app.use(errorHandler);
// request (istek) -> cors -> json parse -> route ( auth / stocks / ...) -> error handler -> response (cevap) şeklinde.
