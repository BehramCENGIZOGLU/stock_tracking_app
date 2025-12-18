// bu dosya Dashboard ekranında tek bir hisseyi (stock) temsil eder.
export default function StockCard({ stock, onRemove, onAlert }) {
  return (
    <div className="card stock-card">
      <div className="stock-top">
        <div>
          <h3 className="stock-symbol">{stock.symbol}</h3>
          {stock.display_name && (
            <p className="stock-name">{stock.display_name}</p>
          )}
        </div>
      </div>
      <div className="stock-price">
        Fiyat:{" "}
        <span className="price-value">
          {stock.price ?? "-"}
        </span>
      </div>
      <div className="stock-actions">
        <button
          className="btn btn-primary"
          onClick={() => onAlert(stock)}
        >
          Alarm Kur
        </button>

        <button
          className="btn btn-danger"
          onClick={() => onRemove(stock.id)}
        >
          Takibi Bırak
        </button>
      </div>
    </div>
  );
}
