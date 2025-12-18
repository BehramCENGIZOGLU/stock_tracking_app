// bu dosya : 
// get /api/alerts -> kullanıcının oluşturduğu tüm alarmları listeler.
// post /api/alerts -> kullanıcının seçtiği hisse için yeni bir fiyat alarmı oluşturur
// alarm tetikleme/kapama işlemi poller tarafından yapılır; bu dosya sadece CRUD (oluştur+listele) işini yapar.
import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { z } from "zod";
import { query } from "../db.js";
const router = Router();

router.get("/", requireAuth, async (req, res, next) => {
  try {
    const r = await query(
      `SELECT a.id, s.symbol, a.target_price, a.direction, a.is_active, a.created_at
       FROM price_alerts a
       JOIN stocks s ON s.id = a.stock_id
       WHERE a.user_id=$1
       ORDER BY a.created_at DESC`,
      [req.user.id]
    );
    res.json(r.rows);
  } catch (e) { next(e); }
});

const createSchema = z.object({
  stockId: z.string().uuid(),
  targetPrice: z.number().positive(),
  direction: z.enum(["ABOVE", "BELOW"])
});

router.post("/", requireAuth, validate(createSchema), async (req, res, next) => {
  try {
    const { stockId, targetPrice, direction } = req.body;

    const r = await query(
      `INSERT INTO price_alerts(user_id, stock_id, target_price, direction)
       VALUES($1,$2,$3,$4)
       RETURNING id`,
      [req.user.id, stockId, targetPrice, direction]
    );
    res.status(201).json({ message: "Alarm oluşturuldu.", id: r.rows[0].id });
  } catch (e) { next(e); }
});

export default router;
