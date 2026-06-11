import axios from "axios";
import { useEffect, useState } from "react";

function Transaksi() {
  const [daftarProduk, setDaftarProduk] = useState([]);
  const [produkDipilih, setProdukDipilih] = useState("");
  const [qty, setQty] = useState(1);
  const [bayar, setBayar] = useState("");
  const [keranjang, setKeranjang] = useState([]);

  useEffect(() => {
    loadProduk();
  }, []);

  const loadProduk = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:3000/produk",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setDaftarProduk(res.data.data || []);
    } catch (err) {
      console.log("ERROR LOAD PRODUK:", err);
    }
  };

  const tambahKeKeranjang = () => {
    if (!produkDipilih) {
      alert("Pilih produk terlebih dahulu!");
      return;
    }

    const produk = daftarProduk.find(
      (p) => p.id === parseInt(produkDipilih)
    );

    if (!produk) {
      alert("Produk tidak ditemukan");
      return;
    }

    const itemBaru = {
      id: produk.id,
      nama: produk.nama_produk,
      harga: Number(produk.harga),
      qty: Number(qty),
      subtotal: Number(produk.harga) * Number(qty),
    };

    setKeranjang([...keranjang, itemBaru]);
    setProdukDipilih("");
    setQty(1);
  };

  const hapusItem = (index) => {
    const dataBaru = keranjang.filter((_, i) => i !== index);
    setKeranjang(dataBaru);
  };

  const totalBelanja = keranjang.reduce(
    (total, item) => total + item.subtotal,
    0
  );

  const kembalian = Number(bayar || 0) - totalBelanja;

  const simpanTransaksi = async () => {
    if (keranjang.length === 0) {
      alert("Keranjang masih kosong!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3000/transaksi",
        {
          total: totalBelanja
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log(response.data);
      alert("Transaksi berhasil disimpan");
      resetTransaksi();
    } catch (err) {
      console.log(err.response?.data);
      alert(
        err.response?.data?.message ||
        "Gagal menyimpan transaksi"
      );
    }
  };

  const resetTransaksi = () => {
    setKeranjang([]);
    setBayar("");
    setProdukDipilih("");
    setQty(1);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">
        🛒 Transaksi Kasir
      </h2>

      <div className="card shadow border-0 mb-4">
        <div className="card-body">
          <select
            className="form-select mb-3"
            value={produkDipilih}
            onChange={(e) => setProdukDipilih(e.target.value)}
          >
            <option value="">Pilih Produk</option>
            {daftarProduk.map((item) => (
              <option
                key={item.id}
                value={item.id}
              >
                {item.nama_produk} - Rp {Number(item.harga).toLocaleString("id-ID")}
              </option>
            ))}
          </select>

          <input
            type="number"
            min="1"
            className="form-control mb-3"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
          />

          <button
            className="btn btn-success"
            onClick={tambahKeKeranjang}
          >
            Tambah ke Keranjang
          </button>
        </div>
      </div>

      <div className="card shadow border-0">
        <div className="card-body">
          <h4 className="mb-3">Keranjang Belanja</h4>

          <table className="table table-bordered">
            <thead className="table-dark">
              <tr>
                <th>No</th>
                <th>Produk</th>
                <th>Qty</th>
                <th>Harga</th>
                <th>Subtotal</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {keranjang.length > 0 ? (
                keranjang.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.nama}</td>
                    <td>{item.qty}</td>
                    <td>Rp {item.harga.toLocaleString("id-ID")}</td>
                    <td>Rp {item.subtotal.toLocaleString("id-ID")}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => hapusItem(index)}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    Belum ada transaksi
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <hr />

          <h3 className="text-end">
            Total : Rp {totalBelanja.toLocaleString("id-ID")}
          </h3>

          <input
            type="number"
            className="form-control mb-3"
            placeholder="Masukkan uang pembayaran"
            value={bayar}
            onChange={(e) => setBayar(e.target.value)}
          />

          <h5>
            Bayar : Rp {Number(bayar || 0).toLocaleString("id-ID")}
          </h5>

          <h4 className="text-success">
            Kembalian : Rp {kembalian > 0 ? kembalian.toLocaleString("id-ID") : "0"}
          </h4>

          <button className="btn btn-primary me-2 mt-3">
            Cetak Struk
          </button>

          <button
            className="btn btn-success mt-3"
            onClick={simpanTransaksi}
          >
            Simpan Transaksi
          </button>
        </div>
      </div>
    </div>
  );
}

export default Transaksi;