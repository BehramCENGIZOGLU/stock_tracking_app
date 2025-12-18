// bu dosyanın amacı :
// client (react) her istekte authorization header'ında jwt gönderir.
// middleware token'i ;
// 1) header'dan alır
// 2) doğrular (imza+süre) 
// 3) geçerliyse kullanıcı bilgisini req.user içine koyar
// 4) router'a geçiş izni verir.

import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Yetkisiz: token yok." });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { id: payload.sub, email: payload.email };
    next();
  } catch {
    return res.status(401).json({ message: "Yetkisiz: token geçersiz." });
  }
}
