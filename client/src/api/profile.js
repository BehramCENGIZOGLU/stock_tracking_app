// Bu dosya frontend tarafında kullanıcı profil bilgileri ve şifre güncelleme işlemlerinin backend ile haberleşmesini sağlar.
import http from "./http";

export const getProfile = async () => {
  const res = await http.get("/api/profile");
  return res.data;
};

export const updatePassword = async (data) => {
  const res = await http.put("/api/profile", data);
  return res.data;
};
