import { createContext, useState } from "react";

export const AuthContext = createContext();

function AuthProvider({ children }) {

  const [user, setUser] = useState({
    token: localStorage.getItem("token"),
    username: localStorage.getItem("username"),
    email: localStorage.getItem("email"),
    role: localStorage.getItem("role"),
    foto: localStorage.getItem("foto"),
  });

  const login = (data) => {

    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.username);
    localStorage.setItem("email", data.email);
    localStorage.setItem("role", data.role);
    localStorage.setItem("foto", data.foto);

    setUser({
      token: data.token,
      username: data.username,
      email: data.email,
      role: data.role,
      foto: data.foto,
    });
  };

  const logout = () => {

    localStorage.clear();

    setUser({
      token: null,
      username: null,
      email: null,
      role: null,
      foto: null,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;