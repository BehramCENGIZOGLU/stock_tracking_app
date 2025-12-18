// bu dosya kullanıcının takip ettiği hisseler (watchlist) ile ilgili tüm backend iletişimini toplar.
import http from "./http";

export const getWatchlist = async () => {
  const res = await http.get("/api/watchlist");
  return res.data;
};

export const saveWatchlist = async (stockIds) => {
  const res = await http.put("/api/watchlist", { stockIds });
  return res.data;
};

export const removeFromWatchlist = async (stockId) => {
  const res = await http.delete(`/api/watchlist/${stockId}`);
  return res.data;
};
