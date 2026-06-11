import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
      if (!username || !password) {
      alert("Email dan Password wajib diisi!");
      return;
    }

    try {
      const response = await axios.post(
  "http://localhost:3000/login",
  {
    username,
    password,
  }
);

console.log(
  "TOKEN DARI API =",
  response.data.token
);

localStorage.setItem(
  "token",
  response.data.token
);

console.log(
  "TOKEN DI LOCALSTORAGE =",
  localStorage.getItem("token")
);

alert("Login berhasil");
navigate("/dashboard");
      
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Login gagal");
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
          <h2 style={{ color: "#ffffff", fontWeight: "bold" }}>Kasir App</h2>
          <p style={{ color: "#b0b0b0" }}>Selamat Datang Kembali</p>
        </div>

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
          onClick={handleLogin}
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

        <p className="text-center mt-4 mb-0" style={{ color: "#b0b0b0" }}>
          Belum punya akun?
          <Link to="/register" className="ms-2 text-info text-decoration-none">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;