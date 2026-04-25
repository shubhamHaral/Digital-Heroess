import { useState } from "react";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";
import "./auth.css";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      return alert("Please fill all fields");
    }

    try {
      const res = await API.post("/auth/login", form);

      if (res.data.success) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        alert("Login Successful ✅");
        navigate("/dashboard");
      } else {
        alert("Invalid login");
      }
    } catch (err) {
      alert("Server error");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back 👋</h2>
        <p className="auth-subtitle">Login to continue</p>

        <input
          className="auth-input"
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />

        <input
          className="auth-input"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
        />

        <button className="auth-button" onClick={handleLogin}>
          Login
        </button>

        <p style={{ marginTop: "12px", fontSize: "12px" }}>
          Don't have an account?{" "}
          <Link to="/signup" style={{ color: "#2563eb" }}>
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
}