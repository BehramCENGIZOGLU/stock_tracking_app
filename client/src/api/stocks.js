import http from "./http";

export const getStocks = async () => {
  const res = await http.get("/api/stocks");
  return res.data;
};
