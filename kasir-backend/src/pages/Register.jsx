// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Register() {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!nama || !email || !password) {
      alert("Semua field wajib diisi!");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:3000/register",
        {
          username: nama,
          email: email,
          password: password,
          role: "kasir"
        }
      );

      alert(res.data.message);
      navigate("/login");

    } catch (err) {
      console.log(err);
      alert(
        err.response?.data?.message ||
        "Registrasi gagal"
      );
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
        }}
      >
        <div className="text-center mb-4">
          <h1 style={{ fontSize: "42px" }}>🛒</h1>
          <h2 style={{ color: "#ffffff", fontWeight: "bold" }}>
            Kasir App
          </h2>
          <p style={{ color: "#ffffff" }}>Buat Akun Baru</p>
        </div>

        {/* INPUT NAMA */}
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Masukkan Nama"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          style={{
            backgroundColor: "#ffffff",
            color: "#ffffff",
            border: "1px solid #3d3d5c",
            padding: "12px",
          }}
        />

        {/* INPUT EMAIL */}
        <input
          type="email"
          className="form-control mb-3"
          placeholder="Masukkan Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            backgroundColor: "#ffffff",
            color: "#ffffff",
            border: "1px solid #3d3d5c",
            padding: "12px",
          }}
        />

        {/* INPUT PASSWORD */}
        <input
          type="password"
          className="form-control mb-4"
          placeholder="Masukkan Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            backgroundColor: "#ffffff",
            color: "#ffffff",
            border: "1px solid #3d3d5c",
            padding: "12px",
          }}
        />

        <button
          className="btn w-100"
          onClick={handleRegister}
          style={{
            backgroundColor: "#2563eb",
            color: "#ffffff",
            fontWeight: "bold",
            padding: "12px",
            borderRadius: "10px",
            border: "none",
          }}
        >
          REGISTER
        </button>

        <p
          className="text-center mt-4 mb-0"
          style={{
            color: "#b0b0b0",
          }}
        >
          Sudah punya akun?
          <Link
            to="/login"
            className="ms-2 text-info text-decoration-none"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;