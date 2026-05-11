import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const result = login(role, username, password);
    if (!result.ok) setError(result.message);
    setLoading(false);
  }

  const demoAccounts = [
    { role: "user", label: "Kepala Sekolah (SDN 01 Laweyan)", user: "kepsek_laweyan", pass: "demo123" },
    { role: "user", label: "Kepala Sekolah (SMPN 05 Banjarsari)", user: "kepsek_banjarsari", pass: "demo123" },
    { role: "admin", label: "Admin Verifikator", user: "admin_uks", pass: "admin123" },
  ];

  function fillDemo(acc) {
    setRole(acc.role);
    setUsername(acc.user);
    setPassword(acc.pass);
    setError("");
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f5f3", padding: 16 }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, background: "#E1F5EE",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 12px", fontSize: 28
          }}>🏥</div>
          <h1 style={{ fontSize: 20, fontWeight: 600, margin: "0 0 4px" }}>Sistem Penilaian UKS</h1>
          <p style={{ fontSize: 13, color: "#888", margin: 0 }}>Usaha Kesehatan Sekolah</p>
        </div>

        {/* Login Card */}
        <div style={{ background: "white", borderRadius: 12, border: "0.5px solid #e0e0e0", padding: 28 }}>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Masuk sebagai</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} style={inputStyle} required>
                <option value="">-- Pilih peran --</option>
                <option value="user">Kepala Sekolah</option>
                <option value="admin">Admin / Verifikator</option>
              </select>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Username</label>
              <input
                type="text" value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username" style={inputStyle} required
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Password</label>
              <input
                type="password" value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password" style={inputStyle} required
              />
            </div>
            {error && (
              <div style={{ background: "#FCEBEB", color: "#A32D2D", padding: "8px 12px", borderRadius: 8, fontSize: 13, marginBottom: 14 }}>
                {error}
              </div>
            )}
            <button type="submit" disabled={loading} style={{
              width: "100%", padding: "10px", borderRadius: 8, border: "none",
              background: loading ? "#9FE1CB" : "#1D9E75", color: "white",
              fontSize: 14, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer"
            }}>
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const labelStyle = { display: "block", fontSize: 12, color: "#666", marginBottom: 5, fontWeight: 500 };
const inputStyle = {
  width: "100%", padding: "9px 10px", borderRadius: 8,
  border: "0.5px solid #d0d0d0", fontSize: 13, color: "#222",
  background: "#fafafa", outline: "none", boxSizing: "border-box"
};
