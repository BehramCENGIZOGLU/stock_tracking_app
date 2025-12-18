// bu dosyanın amacı : 
// get /api/watchlist : kullanıcının seçili hisselerini döndürür
// put /api/watchlist : kullanıcının seçimlerini tamamen günceller (eskiyi sil, yeniyi yaz)
// delete /api/watchlist : tek bir hisseyi takipten çıkarır
// app.js -> app.use("/api/watchlist", watchlistRoutes)
import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { query } from "../db.js";
import { z } from "zod";
import { validate } from "../middleware/validate.js";

const router = Router();

router.get("/", requireAuth, async (req, res, next) => {
  try {
    const result = await query(
      `SELECT s.id, s.symbol, s.display_name
       FROM user_watchlist uw
       JOIN stocks s ON s.id = uw.stock_id
       WHERE uw.user_id = $1
       ORDER BY s.symbol`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (e) { next(e); }
});

const saveSchema = z.object({
  stockIds: z.array(z.string().uuid()).min(1, "En az 1 hisse seçiniz.")
});
router.put("/", requireAuth, validate(saveSchema), async (req, res, next) => {
  try {
    const { stockIds } = req.body;
    await query("BEGIN");
    // transaction başlatma yani : 
    // eski seçimleri sil, yeni seçimleri ekle.
    // eğer ekleme sırasında hata olursa ; eski seçimler silinmiş halde kalmasın, her şey geri alınsın.

    await query("DELETE FROM user_watchlist WHERE user_id=$1", [req.user.id]);

    for (const stockId of stockIds) {
      await query(
        "INSERT INTO user_watchlist(user_id, stock_id) VALUES($1,$2) ON CONFLICT DO NOTHING",
        [req.user.id, stockId]
      );
    }

    await query("COMMIT");

    res.json({ message: "Takip listesi güncellendi." });
  } catch (e) {
    await query("ROLLBACK");
    // hata durumunda ROLLBACK yani BEGIN sonrası yapılan tüm değişiklikleri geri al
    next(e);
  }
});

router.delete("/:stockId", requireAuth, async (req, res, next) => {
  try {
    const { stockId } = req.params;
    await query("DELETE FROM user_watchlist WHERE user_id=$1 AND stock_id=$2", [req.user.id, stockId]);
    res.json({ message: "Takip bırakıldı." });
  } catch (e) { next(e); }
});

export default router;
