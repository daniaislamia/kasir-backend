import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-5">
        <div className="container-fluid">
          <h3 className="text-white fw-bold">🛒 Kasir App</h3>

          <ul className="navbar-nav mx-auto d-flex flex-row gap-4">
            <li className="nav-item">
              <a className="nav-link text-white" href="#beranda">
                Beranda
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="#fitur">
                Fitur
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="#tentang">
                Tentang Aplikasi
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="#kontak">
                Kontak
              </a>
            </li>
          </ul>

          <div className="d-flex gap-2">
            <Link to="/login" className="btn btn-outline-light">
              Masuk
            </Link>
            <Link to="/register" className="btn btn-primary">
              Daftar
            </Link>
          </div>
        </div>
      </nav>

      <section
        id="beranda"
        className="text-white"
        style={{
          background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
          minHeight: "650px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-5 text-center">
              <h1 style={{ fontSize: "120px" }}>🛒</h1>
            </div>
            <div className="col-md-7">
              <h1 className="fw-bold mb-3">Kelola Usaha Lebih Mudah Bersama Kasir App</h1>
              <p className="fs-5">
                Catat transaksi, kelola stok barang, dan lihat laporan penjualan jadi lebih cepat dan praktis.
              </p>

              <div className="mt-4 d-flex gap-3">
                <Link
                  to="/login"
                  className="btn btn-light btn-lg"
                >
                  Mulai Sekarang
                </Link>
                <a
                  href="#fitur"
                  className="btn btn-outline-light btn-lg"
                >
                  Lihat Fitur
                </a>
              </div>

              <div className="row mt-4">
                <div className="col-md-4">
                  <div className="card p-3 text-center">🔒 Data Aman</div>
                </div>
                <div className="col-md-4">
                  <div className="card p-3 text-center">⚡ Transaksi Cepat</div>
                </div>
                <div className="col-md-4">
                  <div className="card p-3 text-center">📊 Laporan Lengkap</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="fitur" className="container py-5">
        <h2 className="text-center mb-5">Fitur Utama</h2>
        <div className="row g-4">
          <div className="col-md-3">
            <div
              className="card shadow-lg border-0 p-4 text-center h-100"
            >
              📦
              <h5>Kelola Produk</h5>
            </div>
          </div>
          <div className="col-md-3">
            <div
              className="card shadow-lg border-0 p-4 text-center h-100"
            >
              💳
              <h5>Buat Transaksi</h5>
            </div>
          </div>
          <div className="col-md-3">
            <div
              className="card shadow-lg border-0 p-4 text-center h-100"
            >
              📊
              <h5>Lihat Laporan</h5>
            </div>
          </div>
          <div className="col-md-3">
            <div
              className="card shadow-lg border-0 p-4 text-center h-100"
            >
              ⚙️
              <h5>Pengaturan</h5>
            </div>
          </div>
        </div>

        <div className="row text-center mt-5">
          <div className="col-md-4">
            <h2 className="fw-bold text-primary">
              100+
            </h2>
            <p>Transaksi Tercatat</p>
          </div>
          <div className="col-md-4">
            <h2 className="fw-bold text-success">
              50+
            </h2>
            <p>Produk Dikelola</p>
          </div>
          <div className="col-md-4">
            <h2 className="fw-bold text-warning">
              24/7
            </h2>
            <p>Akses Sistem</p>
          </div>
        </div>

        <div className="text-center mt-5">
          <Link to="/login" className="btn btn-lg btn-primary px-5">
            Mulai Gunakan Sekarang
          </Link>
        </div>
      </section>

      <section id="tentang" className="bg-light py-5">
        <div className="container">
          <h2 className="text-center fw-bold mb-4">
            Tentang Kasir App
          </h2>
          <p className="text-center fs-5" style={{ maxWidth: "700px", margin: "0 auto" }}>
            Kasir App adalah sistem pencatatan penjualan sederhana yang dirancang untuk memudahkan pengelolaan usaha.
            Dibuat agar pemilik usaha bisa memantau stok, mencatat transaksi, dan melihat laporan dengan mudah, cepat, dan aman.
          </p>
        </div>
      </section>

      <section id="kontak" className="container py-5">
        <h2 className="text-center mb-4">Kontak Kami</h2>
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <p>📧 Email: support@kasirapp.id</p>
            <p>📞 Telepon: 0812-3456-7890</p>
            <p>📍 Alamat: Jakarta, Indonesia</p>
          </div>
        </div>
      </section>

      <footer className="bg-black text-white text-center py-3">
        <p className="mb-0">
          © 2026 Kasir App | Sistem Informasi Kasir Berbasis Web
        </p>
      </footer>
    </div>
  );
}

export default LandingPage;