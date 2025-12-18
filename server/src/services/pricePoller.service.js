// bu dosyanın amacı : 
// belirli aralıklarla fiyatları çeker, db'ye yazar, 
// socket ile yayınlar ve fyat alarmı tetikler.
import { PRICE_POLL_INTERVAL_MS } from "../config.js";
import { query } from "../db.js";
import { fetchPriceForSymbol } from "./stockSource.service.js";
import { getIO } from "../socket/socket.js";

export function startPricePoller() {
  runOnce().catch(console.error);
  // uygulama açılır açılmaz hemen bir kere fiyat çekmek için.
  setInterval(() => runOnce().catch(console.error), PRICE_POLL_INTERVAL_MS);
}

async function runOnce() {
  const stocksRes = await query("SELECT id, symbol FROM stocks WHERE is_active=true");
  const stocks = stocksRes.rows;

  for (const s of stocks) {
    try {
      const { symbol, price } = await fetchPriceForSymbol(s.symbol);
      await query(
        "INSERT INTO stock_prices(stock_id, price, captured_at) VALUES($1,$2, now())",
        [s.id, price]
      );
      const io = getIO();
      // socket server durumunu alır.
      io.emit("priceUpdate", {
        // sadece ilgili odaya mesaj gönderir. bu odaya katılanlar yani takip eden kullanıcılar güncellemeyi alır.
        symbol,
        price,
        capturedAt: new Date().toISOString()
      });
      console.log("EMIT priceUpdate:", symbol, price);
      await checkAndTriggerAlerts(s.id, symbol, price);
    } catch (e) {
      console.error("poll error", s.symbol, e.message);
    }
  }
}

async function checkAndTriggerAlerts(stockId, symbol, price) {
  const alertsRes = await query(
    `SELECT id, user_id, target_price, direction
     FROM price_alerts
     WHERE stock_id=$1 AND is_active=true`,
    [stockId]
  );
  
  if (alertsRes.rowCount === 0) return;

  for (const a of alertsRes.rows) {
    const target = Number(a.target_price);
    const shouldTrigger =
      (a.direction === "ABOVE" && price >= target) ||
      (a.direction === "BELOW" && price <= target);

    if (!shouldTrigger) continue;

    await query(
      "UPDATE price_alerts SET is_active=false, triggered_at=now() WHERE id=$1",
      [a.id]
    );

    const io = getIO();
    io.emit(`alert:${a.user_id}`, {
      alertId: a.id,
      symbol,
      price,
      targetPrice: target,
      direction: a.direction,
      triggeredAt: new Date().toISOString()
    });
  }
}