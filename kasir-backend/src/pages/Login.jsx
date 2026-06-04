import { useState } from "react";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin() {

    alert(
      `Login dengan ${email}`
    );

  }

  return (

    <div className="container mt-5">

      <h1>Login</h1>

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
        className="btn btn-primary"
        onClick={handleLogin}
      >
        Login
      </button>

    </div>

  );

}

export default Login;