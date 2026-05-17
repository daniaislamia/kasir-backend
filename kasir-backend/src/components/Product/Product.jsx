import styles from "./Product.module.css";

function Product(props) {
  return (
    <div className={styles.card}>
      <h2>{props.nama}</h2>
      <p>Harga: Rp {props.harga}</p>
    </div>
  );
}

export default Product;