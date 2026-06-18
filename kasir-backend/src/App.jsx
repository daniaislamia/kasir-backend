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
import LandingPage from "./pages/LandingPage";
import Users from "./pages/Users";
import Profile from "./pages/Profile";

import AdminRoute from "./components/AdminRoute";

function Layout() {
  const location = useLocation();

  const hideLayout =
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/register";

  if (hideLayout) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    );
  }

  return (
    <div
      className="container-fluid"
      style={{
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
      }}
    >
      <div className="row">

        <div className="col-lg-2 p-0">
          <Sidebar />
        </div>

        <div className="col-lg-10 p-4">
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

            <Route
              path="/profile"
              element={<Profile />}
            />

            <Route
              path="/users"
              element={
                <AdminRoute>
                  <Users />
                </AdminRoute>
              }
            />

          </Routes>
        </div>

      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;