function Profile() {
  const username = localStorage.getItem("username");
  const email = localStorage.getItem("email");
  const role = localStorage.getItem("role");

  return (
    <div className="container mt-4">
      <div className="card shadow border-0">
        <div className="card-body p-5">

          <h3 className="mb-4">
            Data Pengguna
          </h3>

          <p>
            <strong>Username :</strong> {username}
          </p>

          <p>
            <strong>Role :</strong> {role}
          </p>

        </div>
      </div>
    </div>
  );
}

export default Profile;