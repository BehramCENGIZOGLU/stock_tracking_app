import { BrowserRouter, Routes, Route } from "react-router-dom";
// BrowserRouter -> tüm uygulamaları saran router sağlayıcısıdır. URL değişkenlerini dinler, sayfa yenilenmeden route geçişi sağlar.
import Login from "./pages/Login";
import Register from "./pages/Register";
import StockSelect from "./pages/StockSelect";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/stocks" element={<ProtectedRoute><StockSelect /></ProtectedRoute>} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>}/>
      </Routes>
    </BrowserRouter>
  );
}