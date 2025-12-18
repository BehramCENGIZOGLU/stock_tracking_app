# Stock Tracking App

Node.js, Express, PostgreSQL ve React (Vite) kullanılarak geliştirilmiş;  
kullanıcı kayıt/giriş, hisse seçimi (watchlist), canlı fiyat takibi (Socket.IO) ve fiyat alarmı oluşturma özelliklerine sahip bir web uygulamasıdır.

---

## 🚀 Temel Özellikler

- Kullanıcı kayıt ve giriş (JWT ile kimlik doğrulama)
- Hisse listesi görüntüleme ve çoklu hisse seçimi
- Kullanıcıya özel takip listesi (watchlist)
- Canlı fiyat güncellemeleri (Socket.IO)
- Fiyat alarmı oluşturma (ABOVE / BELOW)
- Profil ekranı (şifre güncelleme)
- Finnhub API üzerinden gerçek zamanlı fiyat verisi
- PostgreSQL üzerinde fiyat geçmişi saklama

---

## 🧰 Kullanılan Teknolojiler

### Backend
- Node.js
- Express
- PostgreSQL
- pg
- dotenv
- bcrypt
- jsonwebtoken
- zod
- socket.io
- cors

### Frontend
- React
- Vite
- react-router-dom
- axios
- socket.io-client

---

## ⚙️ Kurulum ve Çalıştırma

### Gereksinimler
- Node.js (18+ önerilir)
- PostgreSQL
- Finnhub API Key

---

## 📦 Backend (Server) Kurulumu

server/.env oluşturun:

PORT=5000
DATABASE_URL=postgres://user:password@localhost:5432/stock_tracking_database
JWT_SECRET=change-me
FINNHUB_API_KEY=your_finnhub_api_key
CORS_ORIGIN=http://localhost:5173
PRICE_POLL_INTERVAL_MS=300000

```bash
cd server
npm install
 ```


## 🎨 Frontend (Client) Kurulumu

client/.env oluşturun:

VITE_API_BASE_URL=http://localhost:5000

cd client
npm install

## 🗄️ Veritabanı / Seed İşlemleri
cd server
node scripts/seedStocks.js

## Backend (Server) Çalıştırma 

cd server 
npm run dev

## Frontend (Client) Çalıştırma

cd client
npm run dev

