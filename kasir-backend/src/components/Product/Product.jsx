function Product({ nama, harga }) {

  return (

    <div className="card mb-3">

      <div className="card-body">

        <h3>{nama}</h3>

        <p>Harga: Rp {harga}</p>

      </div>

    </div>

  );

}

export default Product;