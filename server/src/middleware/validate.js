// bu dosyanın amacı : 
// express'te gelen istekleri (req.body) zod şemasına uygun olup olmadığını doğrular.
// hatalıysa 400 döner ve detaylı hata verir
// doğruysa temizlenmiş/doğrulanmış veriyi req.body içine koyar.
export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: "Doğrulama hatası",
        errors: result.error.flatten()
      });
    }
    req.body = result.data;
    next();
  };
}