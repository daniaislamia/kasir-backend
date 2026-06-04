import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

import Home from "./pages/Home";
import Produk from "./pages/Produk";
import Transaksi from "./pages/Transaksi";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {

  return (

    <BrowserRouter>

      <Navbar />

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/produk"
          element={<Produk />}
        />

        <Route
          path="/transaksi"
          element={<Transaksi />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

      </Routes>

      <Footer />

    </BrowserRouter>

  );

}

export default App;