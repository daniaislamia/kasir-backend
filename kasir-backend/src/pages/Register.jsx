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
        "http://localhost:3000/register",  // ← Endpoint yang benar
        {
          username: nama,
          email: email,
          password: password,
          role: "kasir"
        }
      );

      alert(res.data.message || "Registrasi berhasil!");
      navigate("/login");

    } catch (err) {
      console.log(err);
      alert(
        err.response?.data?.message ||
        err.response?.data?.error ||
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
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Link to="/" className="text-decoration-none text-muted" style={{ fontSize: '14px' }}>
            ← Kembali
          </Link>
          <div className="text-center flex-grow-1">
            <h1 style={{ fontSize: "32px", marginBottom: '0' }}>🛒</h1>
          </div>
          <span style={{ width: '70px' }}></span>
        </div>

        <div className="text-center mb-3">
          <h2 style={{ color: "#ffffff", fontWeight: "bold" }}>
            Kasir App
          </h2>
          <p style={{ color: "#b0b0b0" }}>
            Buat Akun Baru
          </p>
        </div>

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Masukkan Nama"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          style={{
            backgroundColor: "#2a2a40",
            color: "#ffffff",
            border: "1px solid #3d3d5c",
            padding: "12px",
          }}
        />

        <input
          type="email"
          className="form-control mb-3"
          placeholder="Masukkan Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            backgroundColor: "#2a2a40",
            color: "#ffffff",
            border: "1px solid #3d3d5c",
            padding: "12px",
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

        <p className="text-center mt-4 mb-2" style={{ color: "#b0b0b0" }}>
          Sudah punya akun?
          <Link to="/login" className="ms-2 text-info text-decoration-none">
            Login
          </Link>
        </p>

        <p className="text-center mb-0">
          <Link to="/" className="text-muted text-decoration-none" style={{ fontSize: '12px' }}>
            🏠 Kembali ke Landing Page
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;