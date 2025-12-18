import { useEffect, useState } from "react";
import { getProfile, updatePassword } from "../api/profile";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState({});
  const [pw, setPw] = useState({});
  const nav = useNavigate();

  useEffect(() => {
    getProfile().then(setUser);
  }, []);

  const submit = async () => {
    await updatePassword(pw);
    alert("Şifre güncellendi");
  };

  const logout = () => {
    localStorage.removeItem("token");
    nav("/login");
  };

  return (
    <div className="page">
      <div className="card form-shell">
        <div className="page-header">
          <h2 className="form-title">Profil</h2>

          <div className="nav-actions">
            <button className="btn" onClick={() => nav("/")}>
              Dashboard
            </button>

            <button className="btn btn-logout" onClick={logout}>
              Çıkış Yap
            </button>
          </div>
        </div>

        <p>
          <strong>E-posta:</strong> {user.email}
        </p>

        <div className="form-row">
          <span className="label">Eski Şifre</span>
          <input
            className="input"
            type="password"
            onChange={(e) =>
              setPw({ ...pw, oldPassword: e.target.value })
            }
          />
        </div>

        <div className="form-row">
          <span className="label">Yeni Şifre</span>
          <input
            className="input"
            type="password"
            onChange={(e) =>
              setPw({ ...pw, newPassword: e.target.value })
            }
          />
        </div>

        <div className="form-row">
          <span className="label">Yeni Şifre (Tekrar)</span>
          <input
            className="input"
            type="password"
            onChange={(e) =>
              setPw({ ...pw, newPasswordConfirm: e.target.value })
            }
          />
        </div>

        <div className="form-actions">
          <button className="btn btn-primary" onClick={submit}>
            Güncelle
          </button>
        </div>
      </div>
    </div>
  );
}
