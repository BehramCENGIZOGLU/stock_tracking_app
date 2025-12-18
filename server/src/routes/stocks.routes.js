// bu dosya : 
// sistede takip edilebilir tüm aktif hisseleri listeler.
// sadece giriş yapmış kullanıcıların erişmesine izin verir
import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { query } from "../db.js";

const router = Router();
router.get("/", requireAuth, async (req, res, next) => {
  try {
    const result = await query("SELECT id, symbol, display_name FROM stocks WHERE is_active=true ORDER BY symbol");
    res.json(result.rows);
  } catch (e) {
    next(e);
  }
});

router.get("/latest", requireAuth, async (req, res, next) => {
  try {
    const r = await query(`
      SELECT DISTINCT ON (s.symbol)
        s.symbol,
        sp.price,
        sp.captured_at
      FROM stocks s
      JOIN stock_prices sp ON sp.stock_id = s.id
      ORDER BY s.symbol, sp.captured_at DESC
    `);

    res.json(r.rows);
  } catch (e) {
    next(e);
  }
});

export default router;