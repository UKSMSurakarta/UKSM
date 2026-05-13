import { useState } from "react";
import {
  Globe, Map, School, Settings, CheckCircle2, Clock3, AlertTriangle, Search, Filter,
} from "lucide-react";
import {
  SCHOOL_REGISTRY, OPD_LIST, JENJANG_OPTIONS, STATUS_OPTIONS,
  PERIODE_AKTIF, PENGUMUMAN_LIST, getSuperadminStats,
} from "../../data/questions";

export default function SuperadminDashboard() {
  const [search, setSearch]   = useState("");
  const [jenjang, setJenjang] = useState("");
  const [status, setStatus]   = useState("");

  const stats   = getSuperadminStats();
  const pengumuman = PENGUMUMAN_LIST.filter((p) => p.role.includes("superadmin")).slice(0, 3);

  const filtered = SCHOOL_REGISTRY.filter((s) => {
    const q = search.toLowerCase();
    const mS = s.nama.toLowerCase().includes(q) || s.wilayah.toLowerCase().includes(q) || s.opd.toLowerCase().includes(q);
    const mJ = !jenjang || s.jenjang === jenjang;
    const mSt = !status || s.status === status;
    return mS && mJ && mSt;
  });

  const selesai  = SCHOOL_REGISTRY.filter((s) => s.status === "Terverifikasi" || s.status === "Selesai").length;
  const menunggu = SCHOOL_REGISTRY.filter((s) => s.status === "Menunggu Verifikasi").length;
  const belum    = SCHOOL_REGISTRY.filter((s) => s.status === "Belum Selesai" || s.status === "Proses").length;

  function getStatusStyle(st) {
    if (st === "Terverifikasi" || st === "Selesai") return { bg: "#DCFCE7", color: "#15803D" };
    if (st === "Menunggu Verifikasi")               return { bg: "#FEF3C7", color: "#B45309" };
    if (st === "Proses")                            return { bg: "#DBEAFE", color: "#1D4ED8" };
    return { bg: "#FEE2E2", color: "#DC2626" };
  }

  return (
    <div style={{ width: "100%", overflowX: "hidden" }}>
      {/* HEADER */}
      <div className="flex items-start justify-between mb-6" style={{ gap: "18px", flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontSize: "clamp(24px,4vw,32px)", fontWeight: 800, marginBottom: "8px", lineHeight: 1.2 }}>
            Dashboard Pusat (Superadmin)
          </h1>
          <p className="text-muted" style={{ fontSize: "14px", lineHeight: 1.7, maxWidth: "700px" }}>
            Monitoring nasional SI-UKS DIGITAL — pengelolaan progres assessment, verifikasi wilayah, dan analisis data UKS.
          </p>
        </div>
        <div className="badge badge-glow">{PERIODE_AKTIF.nama}</div>
      </div>

      {/* STAT CARDS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "22px", marginBottom: "28px" }}>
        <StatCard icon={<Globe size={24} />}       title="Total OPD / Instansi" value={String(stats.totalOpd)}          bg="var(--accent-glow)" color="var(--secondary)" />
        <StatCard icon={<School size={24} />}      title="Total Sekolah"        value={stats.totalSekolah.toLocaleString()} bg="var(--bg-light)"    color="var(--primary)" />
        <StatCard icon={<Settings size={24} />}    title="Periode Aktif"        value={PERIODE_AKTIF.nama}              bg="#EEF2FF"            color="#4338CA" />
        <StatCard icon={<CheckCircle2 size={24} />} title="Progress Nasional"   value={`${stats.persen}%`}              bg="#DCFCE7"            color="#15803D" />
      </div>

      {/* ANALYTICS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: "24px", marginBottom: "28px" }}>
        {/* PIE */}
        <div className="card glass-panel" style={{ padding: "28px", borderRadius: "28px", minWidth: 0 }}>
          <h3 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "6px" }}>Analisis Progress Nasional</h3>
          <p className="text-muted" style={{ fontSize: "13px", marginBottom: "24px" }}>Rekap status assessment seluruh wilayah</p>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
            <div style={{
              width: "220px", height: "220px", borderRadius: "50%", position: "relative",
              background: `conic-gradient(#16A34A 0% ${(selesai / SCHOOL_REGISTRY.length * 100).toFixed(1)}%, #F59E0B ${(selesai / SCHOOL_REGISTRY.length * 100).toFixed(1)}% ${((selesai + menunggu) / SCHOOL_REGISTRY.length * 100).toFixed(1)}%, #DC2626 ${((selesai + menunggu) / SCHOOL_REGISTRY.length * 100).toFixed(1)}% 100%)`,
            }}>
              <div style={{ position: "absolute", inset: "30px", background: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", textAlign: "center" }}>
                <div style={{ fontSize: "36px", fontWeight: 800, lineHeight: 1 }}>{stats.persen}%</div>
                <span className="text-muted" style={{ fontSize: "12px", marginTop: "6px" }}>Total Progress</span>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <LegendItem color="#16A34A" title="Terverifikasi"       value={`${selesai} Sekolah`} />
            <LegendItem color="#F59E0B" title="Menunggu Verifikasi" value={`${menunggu} Sekolah`} />
            <LegendItem color="#DC2626" title="Belum Selesai"       value={`${belum} Sekolah`} />
          </div>
        </div>

        {/* OPD TABLE */}
        <div className="card glass-panel" style={{ padding: "28px", borderRadius: "28px", minWidth: 0 }}>
          <h3 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "6px" }}>Rekap per OPD Wilayah</h3>
          <p className="text-muted" style={{ fontSize: "13px", marginBottom: "20px" }}>Progress assessment per Dinas Kesehatan</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {OPD_LIST.map((o) => (
              <div key={o.id}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 600 }}>{o.nama}</span>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: o.persentase >= 80 ? "#16A34A" : o.persentase >= 60 ? "#F59E0B" : "#DC2626" }}>{o.persentase}%</span>
                </div>
                <div style={{ height: "8px", background: "var(--border)", borderRadius: "999px", overflow: "hidden" }}>
                  <div style={{ width: `${o.persentase}%`, height: "100%", borderRadius: "999px", background: o.persentase >= 80 ? "#16A34A" : o.persentase >= 60 ? "#F59E0B" : "#DC2626", transition: "0.4s" }} />
                </div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "3px" }}>{o.selesai}/{o.totalSekolah} sekolah</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MONITORING TABLE */}
      <div className="card glass-panel" style={{ padding: "28px", borderRadius: "28px", overflow: "hidden" }}>
        <div className="flex items-start justify-between mb-6" style={{ gap: "18px", flexWrap: "wrap" }}>
          <div>
            <h3 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "6px" }}>Monitoring Progress Sekolah</h3>
            <p className="text-muted" style={{ fontSize: "13px" }}>Data {filtered.length} sekolah dari total {SCHOOL_REGISTRY.length}</p>
          </div>
        </div>
        {/* FILTER */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "14px", marginBottom: "20px" }}>
          <div style={{ position: "relative" }}>
            <Search size={17} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input type="text" placeholder="Cari sekolah / wilayah..." value={search} onChange={(e) => setSearch(e.target.value)} style={inp("44px", "44px")} />
          </div>
          <select style={inp("44px")} value={jenjang} onChange={(e) => setJenjang(e.target.value)}>
            <option value="">Semua Jenjang</option>
            {JENJANG_OPTIONS.map((j) => <option key={j}>{j}</option>)}
          </select>
          <select style={inp("44px")} value={status} onChange={(e) => setStatus(e.target.value)}>
            {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        {/* TABLE */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "800px" }}>
            <thead>
              <tr style={{ background: "var(--bg-light)" }}>
                {["Nama Sekolah","Jenjang","OPD / Wilayah","Progress","Status"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "16px 18px", fontSize: "13px", fontWeight: 700 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => {
                const ss = getStatusStyle(s.status);
                return (
                  <tr key={s.id} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={td}><div style={{ fontWeight: 600 }}>{s.nama}</div></td>
                    <td style={td}>{s.jenjang}</td>
                    <td style={td}>{s.opd}</td>
                    <td style={td}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: "160px" }}>
                        <div style={{ flex: 1, height: "8px", background: "#E5E7EB", borderRadius: "999px", overflow: "hidden" }}>
                          <div style={{ width: `${s.progress}%`, height: "100%", background: s.progress >= 80 ? "#16A34A" : s.progress >= 60 ? "#F59E0B" : "#DC2626", borderRadius: "999px" }} />
                        </div>
                        <span style={{ fontSize: "13px", fontWeight: 700, whiteSpace: "nowrap" }}>{s.progress}%</span>
                      </div>
                    </td>
                    <td style={td}>
                      <span style={{ padding: "5px 12px", borderRadius: "999px", background: ss.bg, color: ss.color, fontSize: "12px", fontWeight: 700, whiteSpace: "nowrap" }}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, bg, color }) {
  return (
    <div className="card" style={{ padding: "24px", borderRadius: "26px", border: "1px solid var(--border)" }}>
      <div style={{ width: "56px", height: "56px", borderRadius: "18px", background: bg, color, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "18px" }}>{icon}</div>
      <div className="text-muted" style={{ fontSize: "14px", marginBottom: "8px" }}>{title}</div>
      <div style={{ fontSize: "28px", fontWeight: 800, lineHeight: 1.1 }}>{value}</div>
    </div>
  );
}
function LegendItem({ color, title, value }) {
  return (
    <div className="flex items-center justify-between" style={{ gap: "16px" }}>
      <div className="flex items-center gap-3">
        <div style={{ width: "14px", height: "14px", borderRadius: "999px", background: color }} />
        <span style={{ fontWeight: 600, fontSize: "14px" }}>{title}</span>
      </div>
      <span className="text-muted" style={{ fontSize: "13px" }}>{value}</span>
    </div>
  );
}
const td  = { padding: "16px 18px", fontSize: "14px", verticalAlign: "middle" };
const inp = (h, pl = "16px") => ({ width: "100%", height: h, borderRadius: "14px", border: "1px solid var(--border)", background: "var(--card-bg)", paddingLeft: pl, paddingRight: "14px", outline: "none", fontSize: "14px", color: "var(--text-main)" });