// bu dosya ekranda kısa süreli “bildirim mesajı” göstermek için hazırlanmış Toast (uyarı/bilgi kutusu) sağlar.
export default function Toast({ message }) {
  if (!message) return null;
  return <div style={{ background: "#000", color: "#fff" }}>{message}</div>;
}
