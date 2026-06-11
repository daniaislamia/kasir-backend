import { Link } from "react-router-dom";

function Navbar() {
return ( <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow">


  <div className="container">

    <Link
      className="navbar-brand fw-bold"
      to="/dashboard"
    >
      🛒 Kasir App
    </Link>

    <div className="navbar-nav ms-auto d-flex align-items-center gap-3">

      <Link
        className="nav-link fw-semibold"
        to="/dashboard"
      >
        Dashboard
      </Link>

      <Link
        className="nav-link fw-semibold"
        to="/produk"
      >
        Produk
      </Link>

      <Link
        className="nav-link fw-semibold"
        to="/transaksi"
      >
        Transaksi
      </Link>

      <Link
        className="nav-link fw-semibold"
        to="/laporan"
      >
        Laporan
      </Link>

      <button
        className="btn btn-outline-light btn-sm rounded-pill px-3"
        onClick={() => {
          window.location.href = "/";
        }}
      >
        Logout
      </button>

    </div>

  </div>

</nav>


);
}

export default Navbar;
