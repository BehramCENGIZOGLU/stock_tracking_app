import { useState } from "react";
import { register } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({});

  const nav = useNavigate();

  const submit = async () => {
    await register(form);
    alert("Kayıt başarılı");
    nav("/login");
  };

  return (
    <div className="page">
      <div className="card form-shell">
        <h2 className="form-title">Kayıt</h2>

        <div className="form-row">
          <span className="label">Ad</span>
          <input
            className="input"
            placeholder="Ad"
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />
        </div>

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
            Kayıt Ol
          </button>

          <a href="/login" className="btn">
            Giriş Yap
          </a>
        </div>
      </div>
    </div>
  );
}
