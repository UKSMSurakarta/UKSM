import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); 

  function login(role, username, password) {
    // Manual Accounts
    const accounts = {
      sekolah: { user: "sekolah", pass: "sekolah123", name: "Kepala Sekolah", role: "sekolah" },
      admin: { user: "admin", pass: "admin123", name: "Admin OPD", role: "admin" },
      superadmin: { user: "superadmin", pass: "super123", name: "Superadmin Pusat", role: "superadmin" },
      konten: { user: "konten", pass: "konten123", name: "Pengelola Publikasi", role: "konten" }
    };

    if (!accounts[role]) {
      return { ok: false, message: "Pilih peran yang valid" };
    }

    if (username === accounts[role].user && password === accounts[role].pass) {
      const userData = { 
        role: role, 
        username: accounts[role].name 
      };
      
      if (role === "sekolah") {
        userData.school = { id: "1", name: "SDN 011 Laweyan" };
      }
      
      setUser(userData);
      return { ok: true };
    }

    return { ok: false, message: "Username atau password salah" };
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
