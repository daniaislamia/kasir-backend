import { useEffect, useState } from "react";
import axios from "axios";

import Product from "../components/Product/Product";

function Home() {

  const [products, setProducts] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState("");
  const [jumlah, setJumlah] = useState(1);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {

    axios
      .get("http://127.0.0.1:3000/produk")
      .then((response) => {

        console.log(response.data);

        setProducts(response.data.data || []);

      })
      .catch((error) => {

        console.log(error);

      });

  }, []);

  // TAMBAH TRANSAKSI
  function handleTambahTransaksi() {

    const produkDipilih = products.find(
      (product) =>
        product.nama_produk === selectedProduct
    );

    if (!produkDipilih) {

      alert("Pilih produk dulu");
      return;

    }

    const transaksiBaru = {

      nama: produkDipilih.nama_produk,
      harga: produkDipilih.harga,
      jumlah: Number(jumlah),
      total:
        produkDipilih.harga * Number(jumlah),

    };

    setCart([...cart, transaksiBaru]);

  }

  // TAMBAH PRODUK
  function handleTambahProduk() {

    const namaBaru = prompt(
      "Masukkan nama produk"
    );

    const hargaBaru = prompt(
      "Masukkan harga produk"
    );

    if (!namaBaru || !hargaBaru) {

      return;

    }

    const produkBaru = {

      id: products.length + 1,
      nama_produk: namaBaru,
      harga: Number(hargaBaru),

    };

    setProducts([...products, produkBaru]);

  }

  return (

    <div className="container mt-4">

      <h1 className="mb-4">
        Dashboard Kasir
      </h1>

      {/* CARD DASHBOARD */}

      <div className="row mb-4">

        <div className="col-md-4">

          <div className="card text-center shadow">

            <div className="card-body">

              <h5>Total Produk</h5>

              <h2>{products.length}</h2>

            </div>

          </div>

        </div>

        <div className="col-md-4">

          <div className="card text-center shadow">

            <div className="card-body">

              <h5>Total Transaksi</h5>

              <h2>{cart.length}</h2>

            </div>

          </div>

        </div>

        <div className="col-md-4">

          <div className="card text-center shadow">

            <div className="card-body">

              <h5>Total Pendapatan</h5>

              <h2>

                Rp {

                  cart.reduce(
                    (total, item) =>
                      total + item.total,
                    0
                  )

                }

              </h2>

            </div>

          </div>

        </div>

      </div>

      {/* TRANSAKSI MINI */}

      <div className="card mb-4 shadow">

        <div className="card-body">

          <h3 className="mb-3">
            Transaksi Kasir
          </h3>

          <div className="mb-3">

            <label className="form-label">
              Pilih Produk
            </label>

            <select
              className="form-select"
              value={selectedProduct}
              onChange={(e) =>
                setSelectedProduct(
                  e.target.value
                )
              }
            >

              <option value="">
                -- Pilih Produk --
              </option>

              {products.map((product) => (

                <option
                  key={product.id}
                  value={product.nama_produk}
                >
                  {product.nama_produk}
                </option>

              ))}

            </select>

          </div>

          <div className="mb-3">

            <label className="form-label">
              Jumlah
            </label>

            <input
              type="number"
              className="form-control"
              value={jumlah}
              onChange={(e) =>
                setJumlah(e.target.value)
              }
            />

          </div>

          <button
            className="btn btn-primary"
            onClick={handleTambahTransaksi}
          >
            Tambah Transaksi
          </button>

        </div>

      </div>

      {/* KERANJANG TRANSAKSI */}

      <div className="card shadow mb-4">

        <div className="card-body">

          <h3 className="mb-3">
            Keranjang Transaksi
          </h3>

          {cart.length > 0 ? (

            <>

              <table className="table">

                <thead>

                  <tr>

                    <th>Produk</th>
                    <th>Harga</th>
                    <th>Jumlah</th>
                    <th>Total</th>
                    <th>Aksi</th>

                  </tr>

                </thead>

                <tbody>

                  {cart.map((item, index) => {

                    return (

                      <tr key={index}>

                        <td>{item.nama}</td>
                        <td>Rp {item.harga}</td>
                        <td>{item.jumlah}</td>
                        <td>Rp {item.total}</td>

                        <td>

                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => {

                              const transaksiBaru =
                                cart.filter(
                                  (_, i) =>
                                    i !== index
                                );

                              setCart(
                                transaksiBaru
                              );

                            }}
                          >
                            Hapus
                          </button>

                        </td>

                      </tr>

                    );

                  })}

                </tbody>

              </table>

              <button
                className="btn btn-success mt-3"
                onClick={() => {

                  const totalBelanja =
                    cart.reduce(
                      (total, item) =>
                        total + item.total,
                      0
                    );

                  alert(
                    `Total Belanja: Rp ${totalBelanja}`
                  );

                }}
              >
                Checkout
              </button>

            </>

          ) : (

            <p>Belum ada transaksi</p>

          )}

        </div>

      </div>

      {/* DAFTAR PRODUK */}

      <h2 className="mb-3">
        Daftar Produk
      </h2>

      <button
        className="btn btn-success mb-3"
        onClick={handleTambahProduk}
      >
        Tambah Produk
      </button>

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Cari produk..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      <p>
        Jumlah Produk: {products.length}
      </p>

      {products
        .filter((product) =>
          product.nama_produk
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )
        )
        .map((product) => (

          <Product
            key={product.id}
            nama={product.nama_produk}
            harga={product.harga}
          />

        ))}

    </div>

  );

}

export default Home;