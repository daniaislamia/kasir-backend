import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Home() {
  const [dashboard, setDashboard] = useState({
    totalProduk: 0,
    totalTransaksi: 0,
    totalUser: 0,
    totalPendapatan: 0,
  });

  const username = localStorage.getItem("username") || "Pengguna";
  const userRole = localStorage.getItem("role") || "Pengguna";

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await axios.get("http://localhost:3000/dashboard");
      console.log("DATA DASHBOARD:", res.data);
      setDashboard({
        totalProduk: res.data.totalProduk,
        totalTransaksi: res.data.totalTransaksi,
        totalUser: res.data.totalUser,
        totalPendapatan: res.data.totalPendapatan,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container mt-4">
      {/* TOPBAR - SESUAI CONTOH AWAL */}
      <div className="d-flex justify-content-end mb-4">
        <div className="d-flex align-items-center gap-3">
          {/* Tombol Notifikasi */}
          <button className="btn btn-light shadow-sm">🔔</button>

          {/* Tombol Pengaturan */}
          <button className="btn btn-light shadow-sm">⚙️</button>

          {/* Profil User */}
          <Link to="/profile" className="text-decoration-none">
            <div className="d-flex align-items-center">
              <div
                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                style={{
                  width: "45px",
                  height: "45px",
                  fontWeight: "bold",
                }}
              >
                {username.charAt(0).toUpperCase()}
              </div>
              <div className="ms-2">
                <div className="fw-bold text-dark">{username}</div>
                <small className="text-muted">{userRole}</small>
              </div>
            </div>
          </Link>
        </div>
      </div>
      {/* AKHIR TOPBAR */}

      {/* WELCOME CARD - VERSI KEREN */}
      <div
        className="card border-0 shadow-sm mb-4"
        style={{ borderRadius: "15px" }}
      >
        <div className="card-body p-4">
          <div className="row align-items-center">
            <div className="col-md-8">
              <span className="badge bg-primary mb-3">Dashboard</span>
              <h2 className="fw-bold">Selamat Datang, {username} 👋</h2>
              <p className="text-muted">
                Kelola produk, transaksi, laporan penjualan dan pengguna dengan
                lebih mudah melalui Sistem Informasi Kasir.
              </p>
              <button className="btn btn-primary">Kelola Produk</button>
            </div>
            <div className="col-md-4 text-center">
              <div style={{ fontSize: "100px" }}>🛒</div>
            </div>
          </div>
        </div>
      </div>

      {/* BAGIAN STATISTIK */}
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Total Produk</h6>
                  <h3 className="fw-bold">{dashboard.totalProduk}</h3>
                </div>
                <h1 className="text-primary mb-0">📦</h1>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Total Transaksi</h6>
                  <h3 className="fw-bold">{dashboard.totalTransaksi}</h3>
                </div>
                <h1 className="text-success mb-0">💳</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Total User</h6>
                  <h3 className="fw-bold">{dashboard.totalUser}</h3>
                </div>
                <h1 className="text-info mb-0">👥</h1>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Total Pendapatan</h6>
                  <h3 className="fw-bold">
                    Rp {Number(dashboard.totalPendapatan).toLocaleString("id-ID")}
                  </h3>
                </div>
                <h1 className="text-warning mb-0">💰</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BAGIAN AKTIVITAS SISTEM */}
      <div className="card shadow border-0 mt-4">
        <div className="card-body">
          <h4 className="mb-3">Aktivitas Sistem</h4>
          <ul className="list-group list-group-flush">
            <li className="list-group-item px-0">✅ Kelola Produk</li>
            <li className="list-group-item px-0">✅ Kelola Transaksi</li>
            <li className="list-group-item px-0">✅ Cetak Laporan</li>
            <li className="list-group-item px-0">✅ Manajemen User</li>
          </ul>
        </div>
      </div>

      {/* BAGIAN AKTIVITAS TERBARU */}
      <div className="card shadow border-0 mt-4">
        <div className="card-body">
          <h4 className="mb-3">Aktivitas Terbaru</h4>
          <ul className="list-group list-group-flush">
            <li className="list-group-item px-0">Produk berhasil dikelola</li>
            <li className="list-group-item px-0">Transaksi berhasil diproses</li>
            <li className="list-group-item px-0">Data laporan tersedia</li>
            <li className="list-group-item px-0">Sistem berjalan normal</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Home;