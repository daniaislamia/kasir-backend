import {
BrowserRouter,
Routes,
Route,
useLocation,
} from "react-router-dom";

import Sidebar from "./components/Sidebar/Sidebar";

import Home from "./pages/Home";
import Produk from "./pages/Produk";
import Transaksi from "./pages/Transaksi";
import Laporan from "./pages/Laporan";
import Login from "./pages/Login";
import Register from "./pages/Register";

function Layout() {

const location = useLocation();

const hideLayout =
location.pathname === "/" ||
location.pathname === "/login" ||
location.pathname === "/register";

if (hideLayout) {
return ( <Routes>
<Route path="/" element={<Login />} />
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} /> </Routes>
);
}

return (
<div
className="container-fluid"
style={{
backgroundColor: "#f8f9fa",
minHeight: "100vh",
}}
> <div className="row">


    <div className="col-lg-9">
      <Routes>

        <Route
          path="/dashboard"
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
          path="/laporan"
          element={<Laporan />}
        />

      </Routes>
    </div>

    <div className="col-lg-3 p-0">
      <Sidebar />
    </div>

  </div>
</div>


);
}

function App() {
return ( <BrowserRouter> <Layout /> </BrowserRouter>
);
}

export default App;
