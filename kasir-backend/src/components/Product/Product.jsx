function Product(props) {
  return (

    <div className="card mb-3">

      <div className="card-body">

        <h3>{props.nama}</h3>

        <p>
          Harga: Rp {props.harga}
        </p>

      </div>

    </div>

  );
}

export default Product;