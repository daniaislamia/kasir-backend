import { useState } from "react";

import Product from "../components/Product/Product";
import productsData from "../utils/constants/data";

function Home() {

  const [products, setProducts] = useState(productsData);

  function handleTambah() {

    const newProduct = {
      id: products.length + 1,
      nama: "Kopi",
      harga: 4000,
    };

    setProducts([...products, newProduct]);
  }

  return (
    <main>

      <h1>Daftar Produk</h1>

      <button onClick={handleTambah}>
        Tambah Produk
      </button>

      {products.map((product) => (
        <Product
          key={product.id}
          nama={product.nama}
          harga={product.harga}
        />
      ))}

    </main>
  );
}

export default Home;