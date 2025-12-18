// bu dosya frontend tarafında fiyat alarmı (price alert) ile ilgili tüm backend iletişimini toplar.
import http from "./http";
export const getAlerts = async () => {
  const res = await http.get("/api/alerts");
  return res.data;
};

export const createAlert = async (data) => {
  const res = await http.post("/api/alerts", data);
  return res.data;
};
