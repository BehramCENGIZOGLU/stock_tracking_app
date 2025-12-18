// bu dosya : 
// kayıt (register), giriş(login) ve çıkış(logout) akışını yönetir.
import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { query } from "../db.js";
import { JWT_SECRET } from "../config.js";
import { validate } from "../middleware/validate.js";

const router = Router();

const passwordRule = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().regex(passwordRule, "Şifre zayıf (min 8, harf+sayı).")
});

router.post("/register", validate(registerSchema), async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const exists = await query("SELECT 1 FROM users WHERE email=$1", [email]);
    if (exists.rowCount > 0) {
      return res.status(409).json({ message: "Bu e-posta zaten kayıtlı." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const created = await query(
      "INSERT INTO users(name,email,password_hash) VALUES($1,$2,$3) RETURNING id,email",
      [name, email, passwordHash]
    );

    return res.status(201).json({ message: "Tebrikler! Başarıyla kaydoldunuz.", user: created.rows[0] });
  } catch (e) {
    next(e);
  }
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

router.post("/login", validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const userRes = await query("SELECT id,email,password_hash FROM users WHERE email=$1", [email]);
    if (userRes.rowCount === 0) return res.status(401).json({ message: "E-posta veya şifre hatalı." });
    

    const user = userRes.rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ message: "E-posta veya şifre hatalı." });
    const token = jwt.sign(
        { email: user.email }, 
        JWT_SECRET, 
        { subject: user.id, expiresIn: "2h" }
    );

    // İlk giriş mi? (watchlist var mı)
    const wl = await query("SELECT 1 FROM user_watchlist WHERE user_id=$1 LIMIT 1", [user.id]);
    // kullanıcının hiç seçimi var mı kontrol eder.
    const hasWatchlist = wl.rowCount > 0;
    // hasWatchlist false ise frontend "hisse seçim ekranına" yönlendirir.
    

    return res.json({
      message: "Başarıyla giriş yaptınız.",
      token,
      hasWatchlist
    });
  } catch (e) {
    next(e);
  }
});

router.post("/logout", (req, res) => {
  return res.json({ message: "Başarıyla çıkış yaptınız." });
});

export default router;
