import { useEffect, useState } from "react";
import axios from "axios";

function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/users"
      );
      setUsers(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container mt-4">
      {/* 1. Tombol Tambah User di samping Judul */}
      <div className="d-flex justify-content-between mb-3">
        <h2>Manajemen User</h2>

        <button
          className="btn btn-success"
        >
          + Tambah User
        </button>
      </div>

      {/* Statistik User */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card bg-primary text-white shadow">
            <div className="card-body text-center">
              <h5>Total User</h5>
              <h2>{users.length}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card bg-danger text-white shadow">
            <div className="card-body text-center">
              <h5>Admin</h5>
              <h2>
                {
                  users.filter(
                    (u) => u.role === "admin"
                  ).length
                }
              </h2>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card bg-success text-white shadow">
            <div className="card-body text-center">
              <h5>User</h5>
              <h2>
                {
                  users.filter(
                    (u) => u.role === "user"
                  ).length
                }
              </h2>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow border-0">
        <div className="card-body">

          {/* 2. Tampilkan Jumlah User */}
          <div className="alert alert-info">
            Total User : {users.length}
          </div>

          <table className="table table-bordered">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Role</th>
                <th>Aksi</th> {/* Tambah kolom aksi */}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>

                  {/* 3. Badge Role */}
                  <td>
                    <span
                      className={
                        user.role === "admin"
                          ? "badge bg-danger"
                          : "badge bg-primary"
                      }
                    >
                      {user.role}
                    </span>
                  </td>

                  {/* 4. Tombol Aksi */}
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Users;