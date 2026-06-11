import { Link } from "react-router-dom";

function Sidebar() {
return (
<div
className="bg-dark text-white shadow"
style={{
minHeight: "100vh",
padding: "25px",
}}
> <h2 className="fw-bold mb-4">
🛒 Kasir App </h2>


  <div className="d-flex flex-column gap-3">

    <Link
      to="/dashboard"
      className="text-white text-decoration-none"
    >
      🏠 Dashboard
    </Link>

    <Link
      to="/produk"
      className="text-white text-decoration-none"
    >
      📦 Produk
    </Link>

    <Link
      to="/transaksi"
      className="text-white text-decoration-none"
    >
      💳 Transaksi
    </Link>

    <Link
      to="/laporan"
      className="text-white text-decoration-none"
    >
      📊 Laporan
    </Link>

    <button
      className="btn btn-danger mt-4"
      onClick={() => {
        localStorage.removeItem("token");
        window.location.href = "/";
      }}
    >
      Logout
    </button>

  </div>
</div>


);
}

export default Sidebar;
