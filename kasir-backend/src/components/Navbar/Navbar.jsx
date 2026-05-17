import styles from "./Navbar.module.css";

function Navbar() {
  return (
    <nav className={styles.navbar}>
      <h2 className={styles.logo}>Kasir App</h2>

      <ul className={styles.menu}>
        <li>Home</li>
        <li>Produk</li>
        <li>Transaksi</li>
      </ul>
    </nav>
  );
}

export default Navbar;