// bu kod kullanıcıya seçtiği hisse için fiyat alarmı oluşturma ekranını (modal/popup mantığı) sağlar.
import { useState } from "react";
import { createAlert } from "../api/alerts";

export default function AlertModal({ stock, onClose }) {
  const [price, setPrice] = useState("");

  const [direction, setDirection] = useState("ABOVE");

  const submit = async () => {
    await createAlert({
      stockId: stock.id,
      targetPrice: Number(price),
      direction
    });
    alert("Alarm oluşturuldu");
    onClose();
  };

  return (
    <div className="modal-backdrop">

      <div className="card modal">

        <div className="modal-header">
          <h3 className="modal-title">
            {stock.symbol} Alarm
          </h3>

          <button className="btn" onClick={onClose}>
            Kapat
          </button>
        </div>

        <div className="modal-body">

          <div className="form-row">
            <span className="label">Hedef fiyat</span>
            <input
              className="input"
              placeholder="Hedef fiyat"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className="form-row">
            <span className="label">Koşul</span>
            <select
              className="select"
              value={direction}
              onChange={(e) => setDirection(e.target.value)}
            >
              <option value="ABOVE">Üstüne çıkınca</option>
              <option value="BELOW">Altına inince</option>
            </select>
          </div>

          <div className="modal-actions">
            <button className="btn" onClick={onClose}>
              İptal
            </button>

            <button className="btn btn-primary" onClick={submit}>
              Kaydet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
