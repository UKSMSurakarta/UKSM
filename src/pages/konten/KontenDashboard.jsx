import { useState } from "react";
import { KONTEN_LIST, KATEGORI_KONTEN } from "../../data/questions";
import { Eye, Edit2, Trash2, Plus, Search } from "lucide-react";

export default function KontenDashboard() {
  const [search, setSearch] = useState("");
  const [filterKat, setFilter] = useState("");

  const filtered = KONTEN_LIST.filter((k) => {
    const q = search.toLowerCase();
    const mS = k.judul.toLowerCase().includes(q) || k.penulis.toLowerCase().includes(q);
    const mK = !filterKat || k.kategori === filterKat;
    return mS && mK;
  });

  const totalViews = KONTEN_LIST.reduce((a, k) => a + k.views, 0);
  const diterbitkan = KONTEN_LIST.filter((k) => k.status === "Diterbitkan").length;
  const draft       = KONTEN_LIST.filter((k) => k.status === "Draft").length;

  return (
    <div style={{ width: "100%", overflowX: "hidden" }}>
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4 mb-6" style={{ flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontSize: "clamp(22px,4vw,30px)", fontWeight: 700, marginBottom: 6, lineHeight: 1.2 }}>Dashboard Konten</h1>
          <p className="text-muted" style={{ fontSize: "14px", lineHeight: 1.6 }}>Kelola artikel, berita, dan konten edukasi website SI-UKS</p>
        </div>
        <button style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", borderRadius: "14px", border: "none", background: "linear-gradient(135deg,var(--primary),var(--secondary))", color: "white", fontWeight: 700, cursor: "pointer" }}>
          <Plus size={18} /> Konten Baru
        </button>
      </div>

      {/* STAT CARDS */}
      <div className="grid gap-5 mb-6" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))" }}>
        <MiniStat label="Total Konten"    value={String(KONTEN_LIST.length)} color="var(--primary)"   bg="var(--bg-light)" />
        <MiniStat label="Diterbitkan"     value={String(diterbitkan)}        color="#16A34A"           bg="#DCFCE7" />
        <MiniStat label="Draft"           value={String(draft)}              color="#D97706"           bg="#FEF3C7" />
        <MiniStat label="Total Tayangan"  value={totalViews.toLocaleString()} color="var(--secondary)" bg="var(--accent-glow)" />
      </div>

      {/* FILTER */}
      <div className="card glass-panel mb-5" style={{ padding: "16px 20px", borderRadius: "20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "12px" }}>
          <div style={{ position: "relative" }}>
            <Search size={16} style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input type="text" placeholder="Cari judul / penulis..." value={search} onChange={(e) => setSearch(e.target.value)} style={inp} />
          </div>
          <select style={inp} value={filterKat} onChange={(e) => setFilter(e.target.value)}>
            <option value="">Semua Kategori</option>
            {KATEGORI_KONTEN.map((k) => <option key={k.value} value={k.value}>{k.label}</option>)}
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="card glass-panel" style={{ padding: "24px", borderRadius: "24px", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "700px" }}>
          <thead>
            <tr style={{ background: "var(--bg-light)" }}>
              {["Judul","Kategori","Penulis","Tanggal","Status","Tayangan","Aksi"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "14px 16px", fontSize: "13px", fontWeight: 700 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((k) => {
              const kat = KATEGORI_KONTEN.find((c) => c.value === k.kategori);
              const statusC = k.status === "Diterbitkan" ? { bg:"#DCFCE7",color:"#16A34A" } : k.status === "Draft" ? { bg:"#FEF3C7",color:"#D97706" } : { bg:"#F3F4F6",color:"#6B7280" };
              return (
                <tr key={k.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={td}><div style={{ fontWeight: 600, maxWidth: "260px" }}>{k.judul}</div></td>
                  <td style={td}>
                    {kat && <span style={{ padding: "4px 10px", borderRadius: "999px", background: kat.bg, color: kat.color, fontSize: "12px", fontWeight: 700 }}>{kat.label}</span>}
                  </td>
                  <td style={td}>{k.penulis}</td>
                  <td style={td}>{k.tanggal}</td>
                  <td style={td}>
                    <span style={{ padding: "4px 10px", borderRadius: "999px", background: statusC.bg, color: statusC.color, fontSize: "12px", fontWeight: 700 }}>{k.status}</span>
                  </td>
                  <td style={td}>{k.views.toLocaleString()}</td>
                  <td style={td}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <IconBtn icon={<Eye size={14} />} color="var(--primary)" />
                      <IconBtn icon={<Edit2 size={14} />} color="#D97706" />
                      <IconBtn icon={<Trash2 size={14} />} color="#DC2626" />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MiniStat({ label, value, color, bg }) {
  return (
    <div className="card" style={{ padding: "20px", borderRadius: "20px", border: "1px solid var(--border)" }}>
      <div style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "8px" }}>{label}</div>
      <div style={{ fontSize: "28px", fontWeight: 700, color }}>{value}</div>
    </div>
  );
}
function IconBtn({ icon, color }) {
  return (
    <button style={{ width: "32px", height: "32px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--card-bg)", color, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
      {icon}
    </button>
  );
}
const inp = { width: "100%", height: "42px", borderRadius: "12px", border: "1px solid var(--border)", background: "var(--card-bg)", paddingLeft: "38px", paddingRight: "14px", outline: "none", fontSize: "14px", color: "var(--text-main)" };
const td  = { padding: "14px 16px", fontSize: "14px", verticalAlign: "middle" };