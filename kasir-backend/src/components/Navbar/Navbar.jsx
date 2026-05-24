function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success">

      <div className="container">

        <a className="navbar-brand" href="#">
          Kasir App
        </a>

        <ul className="navbar-nav ms-auto">

          <li className="nav-item">
            <a className="nav-link" href="#">
              Home
            </a>
          </li>

          <li className="nav-item">
            <a className="nav-link" href="#">
              Produk
            </a>
          </li>

          <li className="nav-item">
            <a className="nav-link" href="#">
              Transaksi
            </a>
          </li>

        </ul>

      </div>

    </nav>
  );
}

export default Navbar;