// bu dosya : 
// frontend tarafında kimlik doğrulama (register/login/logout) işlemlerini tek bir yerde toplar.
// amaç (login.jsx, register.jsx) içinde http detaylarını tekrar tekrar yazmamak.
import http from "./http";

export const register = (data) => http.post("/api/auth/register", data);

export const login = async (data) => {
  const res = await http.post("/api/auth/login", data);
  localStorage.setItem("token", res.data.token);
  return res.data;
};

export const logout = () => {
  localStorage.removeItem("token");
};