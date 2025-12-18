// bu dosya :
// get /api/profille -> kullanıcının e-posta ve ad bilgisini getirir.
// put /api/profile -> kullanıcı şifre değiştirmek isterse : 
// 1) eski şifreyi doğrular
// 2) yeni şifreyi güç kuralına göre kontrol eder 
// 3) yeni şifreyi onay alanıyla eşleştirir 
// 4) yeni şifrenin eski ile aynı olmasını engeller
// 5) hashleyip db ye yazar.
import { Router } from "express";
import bcrypt from "bcrypt";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { query } from "../db.js";

const router = Router();

router.get("/", requireAuth, async (req, res, next) => {
  try {
    const r = await query("SELECT email, name FROM users WHERE id=$1", [req.user.id]);
    res.json(r.rows[0]);
  } catch (e) { next(e); } 
});

const passwordRule = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

const updateSchema = z.object({
  oldPassword: z.string().optional(),
  newPassword: z.string().optional(),
  newPasswordConfirm: z.string().optional()
  // şifre değiştirme durumunda hepsi dolu olmalı gibi ek kurallar var. bu kurallar refine ile getirdik.
}).refine((data) => {
  // Eğer herhangi bir şifre alanı doluysa hepsi dolu olmalı
  const any = data.oldPassword || data.newPassword || data.newPasswordConfirm;
  if (!any) return true;
  // kullanıcı hiç şifre alanı göndermemişse -> geçerli (true)
  return !!data.oldPassword && !!data.newPassword && !!data.newPasswordConfirm;
  // kullanıcı birini gönderdiyse -> üçüde dolu olmak zorunda uyarısı verdik.
}, "Şifre güncellemek için tüm alanlar doldurulmalı.")
.refine((data) => {
  if (!data.newPassword) return true;
  return passwordRule.test(data.newPassword);
  // burada yeni şifre girilmişse passwordRule e göre test et uymuyorsa hata gönder
}, "Yeni şifre zayıf (min 8, harf+sayı).")
.refine((data) => {
  if (!data.newPassword) return true;
  return data.newPassword === data.newPasswordConfirm;
}, "Yeni şifre onayı uyuşmuyor.");

router.put("/", requireAuth, validate(updateSchema), async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!newPassword) {
      return res.json({ message: "Başarıyla güncelleme yaptınız." });
    }
    const ur = await query("SELECT password_hash FROM users WHERE id=$1", [req.user.id]);
    const ok = await bcrypt.compare(oldPassword, ur.rows[0].password_hash);
    if (!ok) return res.status(400).json({ message: "Mevcut şifre hatalı." });
    const same = await bcrypt.compare(newPassword, ur.rows[0].password_hash);
    if (same) return res.status(400).json({ message: "Yeni şifre mevcut şifre ile aynı olamaz." });
    const hash = await bcrypt.hash(newPassword, 10);
    await query("UPDATE users SET password_hash=$1, updated_at=now() WHERE id=$2", [hash, req.user.id]);

    return res.json({ message: "Başarıyla güncelleme yaptınız." });
  } catch (e) { next(e); }
});

export default router;
