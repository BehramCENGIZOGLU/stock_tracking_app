import { useEffect, useState } from "react";
import http from "../api/http";
import { getWatchlist, removeFromWatchlist } from "../api/watchlist";
import socket, { connectSocket, joinWatchlist } from "../socket/socketClient";
import StockCard from "../components/StockCard";
import AlertModal from "../components/AlertModal";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [stocks, setStocks] = useState([]);
  const [prices, setPrices] = useState({});
  const [alertStock, setAlertStock] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    getWatchlist().then(async (list) => {
      setStocks(list);

      const latest = await http.get("/api/stocks/latest");
      const priceMap = {};
      for (const p of latest.data) {
        priceMap[p.symbol] = p.price;
      }
      setPrices(priceMap);

      connectSocket(() => {
        socket.on("priceUpdate", (data) => {
          setPrices((prev) => ({
            ...prev,
            [data.symbol]: data.price
          }));
        });

        joinWatchlist(list.map((s) => s.symbol));
      });
    });

    return () => socket.off("priceUpdate");
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    nav("/login");
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <div className="brand">
            <div className="brand-title">Stock Tracker</div>
            <div className="brand-subtitle">
              Canlı fiyat ve alarm sistemi
            </div>
          </div>

          <div className="nav-actions">
            <button className="btn" onClick={() => nav("/stocks")}>
              Hisse Seçimi
            </button>

            <button className="btn" onClick={() => nav("/profile")}>
              Profil
            </button>

            <button className="btn btn-logout" onClick={logout}>
              Çıkış Yap
            </button>
          </div>
        </div>

        <h2>Dashboard</h2>

        <div className="grid">
          {stocks.map((s) => (
            <StockCard
              key={s.id}
              stock={{ ...s, price: prices[s.symbol] }}
              onRemove={async (id) => {
                await removeFromWatchlist(id);
                setStocks((prev) => prev.filter((x) => x.id !== id));
              }}
              onAlert={setAlertStock}
            />
          ))}
        </div>

        {alertStock && (
          <AlertModal
            stock={alertStock}
            onClose={() => setAlertStock(null)}
          />
        )}
      </div>
    </div>
  );
}
