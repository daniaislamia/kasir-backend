import { useEffect, useState } from "react";
import axios from "axios";

import Product from "../components/Product/Product";

function Home() {

  const [products, setProducts] = useState([]);

  useEffect(() => {

    axios
      .get("http://127.0.0.1:3000/produk")
      .then((response) => {

        console.log(response.data);

        setProducts(response.data.data);

      })
      .catch((error) => {

        console.log(error);

      });

  }, []);

  return (

    <div className="container mt-4">

      <h1 className="mb-3">
        Daftar Produk
      </h1>

      <button className="btn btn-success mb-3">
        Tambah Produk
      </button>

      <p>Jumlah Produk: {products.length}</p>

      {products.length > 0 ? (

        products.map((product) => (

          <Product
            key={product.id}
            nama={product.nama_produk}
            harga={product.harga}
          />

        ))

      ) : (

        <p>Data produk tidak ada</p>

      )}

    </div>

  );
}

export default Home;