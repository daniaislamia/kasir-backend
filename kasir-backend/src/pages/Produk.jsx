import axios from "axios";
import { useEffect, useState } from "react";

function Produk() {
  const [nama, setNama] = useState("");
  const [harga, setHarga] = useState("");
  const [stok, setStok] = useState("");
  const [produk, setProduk] = useState([]);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadProduk();
  }, []);

  // Fungsi bantu ambil header dengan token
  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const loadProduk = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/produk",
        getAuthHeader() // ✅ Tambah token
      );
      console.log("DATA PRODUK:", res.data);
      setProduk(res.data.data || []);
    } catch (err) {
      console.log("ERROR LOAD PRODUK:", err);
      setProduk([]);
    }
  };

  const simpanProduk = async () => {
    if (!nama || !harga || !stok) {
      alert("Nama, harga dan stok wajib diisi!");
      return;
    }

    try {
      if (editId) {
        // Update produk
        await axios.put(
          `http://localhost:3000/api/produk/${editId}`,
          { nama_produk: nama, harga, stok },
          getAuthHeader() // ✅ Tambah token
        );
        alert("Produk berhasil diupdate");
      } else {
        // Tambah produk baru
        await axios.post(
          "http://localhost:3000/api/produk",
          { nama_produk: nama, harga, stok },
          getAuthHeader() // ✅ Tambah token
        );
        alert("Produk berhasil ditambahkan");
      }

      // Reset form
      await loadProduk();
      setNama("");
      setHarga("");
      setStok("");
      setEditId(null);
    } catch (err) {
      console.log(err);
      alert("Gagal menyimpan produk");
    }
  };

  const editProduk = (item) => {
    setEditId(item.id);
    setNama(item.nama_produk);
    setHarga(item.harga);
    setStok(item.stok);
  };

  const hapusProduk = async (id) => {
    if (!window.confirm("Yakin hapus produk?")) return;

    try {
      await axios.delete(
        `http://localhost:3000/api/produk/${id}`,
        getAuthHeader() // ✅ Tambah token
      );
      alert("Produk berhasil dihapus");
      loadProduk();
    } catch (err) {
      console.log(err);
      alert("Gagal menghapus produk");
    }
  };

  // Filter pencarian
  const produkFilter = produk.filter((item) =>
    (item?.nama_produk || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h2 className="mb-4">
        <i className="bi bi-box-seam me-2"></i>
        Manajemen Produk
      </h2>

      {/* Form Tambah/Edit */}
      <div className="card shadow border-0 mb-4">
        <div className="card-body">
          <div className="mb-3">
            <label className="form-label">Nama Produk</label>
            <input
              type="text"
              className="form-control"
              placeholder="Masukkan nama produk"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Harga Produk</label>
            <input
              type="number"
              className="form-control"
              placeholder="Masukkan harga produk"
              value={harga}
              onChange={(e) => setHarga(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Stok Produk</label>
            <input
              type="number"
              className="form-control"
              placeholder="Masukkan stok produk"
              value={stok}
              onChange={(e) => setStok(e.target.value)}
            />
          </div>

          <button className="btn btn-primary" onClick={simpanProduk}>
            {editId ? "Update Produk" : "Simpan Produk"}
          </button>
        </div>
      </div>

      {/* Tabel Daftar Produk */}
      <div className="card shadow border-0">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4>Daftar Produk</h4>
            <input
              type="text"
              className="form-control w-25"
              placeholder="Cari Produk..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <p>
            Total Produk : <strong>{produk.length}</strong>
          </p>

          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Nama Produk</th>
                <th>Harga</th>
                <th>Stok</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {produkFilter.length > 0 ? (
                produkFilter.map((item, index) => (
                  <tr key={item.id || index}>
                    <td>{item.id}</td>
                    <td>{item.nama_produk}</td>
                    <td>Rp {Number(item.harga || 0).toLocaleString("id-ID")}</td>
                    <td>{item.stok ?? "-"}</td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => editProduk(item)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => hapusProduk(item.id)}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    Produk tidak ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Produk;