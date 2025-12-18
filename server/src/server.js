// bu dosya : 
// express app'i alır.
// gerçek bir node.js http server oluşturur.
// Socket.IO'yu bu server'a bağlar
// arka planda çalışan poller'i başlatır.
// serveri dinlemeye başlar.
import http from "http";
import { app } from "./app.js";
import { PORT } from "./config.js";
import { initSocket } from "./socket/socket.js";
// socket.io sunucusunu kuran fonksiyonu alır.
import { startPricePoller } from "./services/pricePoller.service.js";
// 5 dakikada bir çalışan fiyat çekme + yayınlama servisinin başlatıcısı işine yarar

const httpServer = http.createServer(app);
initSocket(httpServer);
// httpServer'ı alır socket.io sunucusunu bu server'a bağlar.

startPricePoller();
// arka planda çalışan fiyat servislerini başlatır (dış api çağrıları, db insert, spcket publish, alarm kontrol)

httpServer.listen(PORT, () => {
  console.log(`Server listening on :${PORT}`);
});
