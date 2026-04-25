import { useState } from "react";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";
import "./auth.css";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) {
      return alert("Please fill all fields");
    }

    try {
      const res = await API.post("/auth/signup", form);

      if (res.data.success) {
        alert("Signup Successful ✅");
        navigate("/");
      } else {
        alert(res.data.message || "Signup failed");
      }
    } catch (err) {
      alert("Server error");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Create Account 🚀</h2>
        <p className="auth-subtitle">Start your journey</p>

        <input
          className="auth-input"
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />

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

        <button className="auth-button" onClick={handleSubmit}>
          Signup
        </button>

        <p style={{ marginTop: "12px", fontSize: "12px" }}>
          Already have an account?{" "}
          <Link to="/" style={{ color: "#2563eb" }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}