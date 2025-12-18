// bu dosyanın amacı frontend'ten backend'e giden tüm http isteklerini merkezi ve güvenli şekilde yönetmek
import axios from "axios";

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true
});

http.interceptors.request.use((config) => {
    // bir request gönderilmeden hemen önce config'i yakala ve düzenle
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default http;
