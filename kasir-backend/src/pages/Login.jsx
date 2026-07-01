// src/pages/Login.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(username, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(135deg, #0f172a, #1e293b)",
      }}
    >
      <div
        className="card border-0 shadow-lg p-5"
        style={{
          width: "450px",
          backgroundColor: "#1e1e2f",
          borderRadius: "20px",
          position: "relative",
        }}
      >
        {/* Tombol Kembali ke Landing Page */}
        <Link
          to="/"
          className="text-decoration-none"
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            color: "#b0b0b0",
            fontSize: "14px",
            transition: "0.3s",
          }}
          onMouseEnter={(e) => {
            e.target.style.color = "#ffffff";
          }}
          onMouseLeave={(e) => {
            e.target.style.color = "#b0b0b0";
          }}
        >
          ← Kembali
        </Link>

        <div className="text-center mb-4">
          <h1 style={{ fontSize: "42px" }}>🛒</h1>
          <h2 style={{ color: "#ffffff", fontWeight: "bold" }}>
            Kasir App
          </h2>
          <p style={{ color: "#b0b0b0" }}>Login ke Akun Anda</p>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Masukkan Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            backgroundColor: "#2a2a40",
            color: "#ffffff",
            border: "1px solid #3d3d5c",
            padding: "12px",
            borderRadius: "8px",
          }}
        />

        <input
          type="password"
          className="form-control mb-4"
          placeholder="Masukkan Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            backgroundColor: "#2a2a40",
            color: "#ffffff",
            border: "1px solid #3d3d5c",
            padding: "12px",
            borderRadius: "8px",
          }}
        />

        <button
          className="btn w-100"
          onClick={handleSubmit}
          style={{
            backgroundColor: "#2563eb",
            color: "#ffffff",
            fontWeight: "bold",
            padding: "12px",
            borderRadius: "10px",
            border: "none",
          }}
        >
          LOGIN
        </button>

        <p
          className="text-center mt-4 mb-0"
          style={{
            color: "#b0b0b0",
          }}
        >
          Belum punya akun?
          <Link
            to="/register"
            className="ms-2 text-info text-decoration-none"
          >
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;