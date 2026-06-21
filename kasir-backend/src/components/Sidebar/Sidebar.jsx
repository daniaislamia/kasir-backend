import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function Sidebar() {

  const { user, logout } = useContext(AuthContext);

  const location = useLocation();

  const menuStyle = (path) => ({
    padding: "10px 15px",
    borderRadius: "10px",
    textDecoration: "none",
    fontWeight: "500",
    transition: "0.3s",
    backgroundColor:
      location.pathname === path ? "#5b5ff8" : "transparent",
    color:
      location.pathname === path ? "#fff" : "#333",
  });

  return (
    <div
      className="bg-white border-end shadow-sm"
      style={{
        minHeight: "100vh",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>

        <h4
          className="fw-bold mb-4"
          style={{ color: "#5b5ff8" }}
        >
          🛒 Kasir App
        </h4>

        {/* Tambahkan bagian profil pengguna di sini */}
        <div
          className="bg-secondary bg-opacity-25 rounded p-3 mb-4 text-center"
        >
          <div
            className="rounded-circle bg-primary text-white mx-auto d-flex align-items-center justify-content-center"
            style={{
              width: "60px",
              height: "60px",
              fontSize: "24px",
              fontWeight: "bold",
            }}
          >
            {user?.username?.charAt(0).toUpperCase() || "U"}
          </div>

          <div className="mt-2 fw-bold">
            {user?.username}
          </div>

          <small className="text-light">
            {user?.role}
          </small>
        </div>

        <small
          className="text-muted text-uppercase"
        >
          Main Menu
        </small>

        <div className="d-flex flex-column gap-2 mt-3">

          <Link
            to="/dashboard"
            style={menuStyle("/dashboard")}
          >
            🏠 Dashboard
          </Link>

          <Link
            to="/produk"
            style={menuStyle("/produk")}
          >
            📦 Produk
          </Link>

          <Link
            to="/transaksi"
            style={menuStyle("/transaksi")}
          >
            💳 Transaksi
          </Link>

          <Link
            to="/laporan"
            style={menuStyle("/laporan")}
          >
            📊 Laporan
          </Link>

          {user?.role === "admin" && (
            <Link
              to="/users"
              style={menuStyle("/users")}
            >
              👥 User
            </Link>
          )}

        </div>
      </div>

      <button
        className="btn btn-outline-danger"
        onClick={() => {
          logout();
          window.location.href = "/";
        }}
      >
        🚪 Logout
      </button>

    </div>
  );
}

export default Sidebar;