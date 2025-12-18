import { useEffect, useState } from "react";
import { getStocks } from "../api/stocks";
import { getWatchlist, saveWatchlist } from "../api/watchlist";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const [stocks, setStocks] = useState([]);
  const [selected, setSelected] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    getStocks().then(setStocks);
    getWatchlist().then(list => {
      setSelected(list.map(s => s.id));
    });
  }, []);

  const toggle = (id) => {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id]
    );
  };

  const submit = async () => {
    await saveWatchlist(selected);
    alert("Takip listesi güncellendi.");
    nav("/");
  };

  return (
    <>
      <h2>Ayarlar – Hisse Takibi</h2>

      {stocks.map(s => (
        <div key={s.id}>
          <input
            type="checkbox"
            checked={selected.includes(s.id)}
            onChange={() => toggle(s.id)}
          />
          {s.symbol}
        </div>
      ))}

      <button onClick={submit}>Güncelle</button>
    </>
  );
}
