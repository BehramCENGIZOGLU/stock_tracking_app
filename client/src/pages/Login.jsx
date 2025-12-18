import { useState } from "react";
import { login } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({});

  const nav = useNavigate();

  const submit = async () => {
    const res = await login(form);
    nav(res.hasWatchlist ? "/" : "/stocks");
  };

  return (
    <div className="page">
      <div className="card form-shell">
        <h2 className="form-title">Giriş</h2>

        <div className="form-row">
          <span className="label">E-posta</span>
          <input
            className="input"
            placeholder="Email"
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />
        </div>

        <div className="form-row">
          <span className="label">Şifre</span>
          <input
            className="input"
            type="password"
            placeholder="Şifre"
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />
        </div>

        <div className="form-actions">
          <button className="btn btn-primary" onClick={submit}>
            Giriş Yap
          </button>

          <a href="/register" className="btn">
            Kayıt Ol
          </a>
        </div>
      </div>
    </div>
  );
}
