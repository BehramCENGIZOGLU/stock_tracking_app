import { useEffect, useState } from "react";
import { getStocks } from "../api/stocks";
import { saveWatchlist } from "../api/watchlist";
import { useNavigate } from "react-router-dom";

export default function StockSelect() {
  const [stocks, setStocks] = useState([]);
  const [selected, setSelected] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    getStocks().then(setStocks);
    // component ilk açıldığında hisseleri çek
  }, []);

  const submit = async () => {
    await saveWatchlist(selected);
    nav("/");
  };

  const logout = () => {
    localStorage.removeItem("token");
    nav("/login");
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h2>Hisse Seçimi</h2>

          <div className="nav-actions">
            <button className="btn" onClick={() => nav("/profile")}>
              Profil
            </button>

            <button className="btn btn-logout" onClick={logout}>
              Çıkış Yap
            </button>
          </div>
        </div>

        {stocks.map((s) => (
          <div key={s.id} className="form-row">
            <input
              type="checkbox"
              onChange={() =>
                setSelected((prev) =>
                  prev.includes(s.id)
                    ? prev.filter((id) => id !== s.id)
                    : [...prev, s.id]
                )
              }
            />
            <span style={{ marginLeft: 8 }}>
              {s.symbol} {s.display_name && `- ${s.display_name}`}
            </span>
          </div>
        ))}

        <div className="form-actions">
          <button className="btn btn-primary" onClick={submit}>
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
}
