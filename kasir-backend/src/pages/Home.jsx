function Home() {
return ( <div className="container mt-4">


  <h1 className="mb-4">
    Dashboard Kasir
  </h1>

  <div className="row">

    <div className="col-md-3 mb-3">
      <div className="card bg-primary text-white shadow">
        <div className="card-body">
          <h6>Total Produk</h6>
          <h2>15</h2>
        </div>
      </div>
    </div>

    <div className="col-md-3 mb-3">
      <div className="card bg-success text-white shadow">
        <div className="card-body">
          <h6>Total Transaksi</h6>
          <h2>28</h2>
        </div>
      </div>
    </div>

    <div className="col-md-3 mb-3">
      <div className="card bg-warning text-white shadow">
        <div className="card-body">
          <h6>Produk Terjual</h6>
          <h2>120</h2>
        </div>
      </div>
    </div>

    <div className="col-md-3 mb-3">
      <div className="card bg-danger text-white shadow">
        <div className="card-body">
          <h6>Pendapatan</h6>
          <h5>Rp 2.500.000</h5>
        </div>
      </div>
    </div>

  </div>

  <div className="card shadow border-0 mt-4">
    <div className="card-body">

      <h4>
        Selamat Datang di Sistem Kasir
      </h4>

      <p>
        Kelola produk, transaksi,
        dan laporan penjualan dengan mudah.
      </p>

    </div>
  </div>

  <div className="card shadow border-0 mt-4">
    <div className="card-body">

      <h4 className="mb-3">
        Aktivitas Terbaru
      </h4>

      <ul className="list-group">
        <li className="list-group-item">
          Produk Indomie ditambahkan
        </li>

        <li className="list-group-item">
          Transaksi #TRX001 berhasil
        </li>

        <li className="list-group-item">
          Produk Aqua diperbarui
        </li>

        <li className="list-group-item">
          Pendapatan hari ini bertambah
        </li>
      </ul>

    </div>
  </div>

</div>


);
}

export default Home;
