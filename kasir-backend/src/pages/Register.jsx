import { useState } from "react";

function Register() {

  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleRegister() {

    alert(
      `Registrasi ${nama}`
    );

  }

  return (

    <div className="container mt-5">

      <h1>Register</h1>

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Nama"
        value={nama}
        onChange={(e) =>
          setNama(e.target.value)
        }
      />

      <input
        type="email"
        className="form-control mb-3"
        placeholder="Email"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <input
        type="password"
        className="form-control mb-3"
        placeholder="Password"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <button
        className="btn btn-success"
        onClick={handleRegister}
      >
        Register
      </button>

    </div>

  );

}

export default Register;