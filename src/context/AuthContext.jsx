import { createContext, useContext, useState } from "react";
import { SCHOOLS, ADMIN_CREDENTIALS } from "../data/questions";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  function login(role, username, password) {
    if (role === "admin") {
      if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        setUser({ role: "admin" });
        return { ok: true };
      }
      return { ok: false, message: "Username atau password admin salah" };
    }
    if (role === "user") {
      const school = SCHOOLS.find(
        (s) => s.username === username && s.password === password
      );
      if (school) {
        setUser({ role: "user", school });
        return { ok: true };
      }
      return { ok: false, message: "Username atau password salah" };
    }
    return { ok: false, message: "Pilih peran terlebih dahulu" };
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
