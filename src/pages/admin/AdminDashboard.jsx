import {
  ShieldCheck, Users, AlertTriangle, Clock3,
  School, BellRing, CheckCircle2,
} from "lucide-react";
import { SCHOOL_REGISTRY, PENGUMUMAN_LIST, getAdminStats, PREDIKAT_UKS } from "../../data/questions";

export default function AdminDashboard() {
  const stats = getAdminStats(SCHOOL_REGISTRY);
  const pengumuman = PENGUMUMAN_LIST.filter((p) => p.role.includes("admin")).slice(0, 3);
  const belumSelesai = SCHOOL_REGISTRY.filter((s) => s.status === "Belum Selesai" || s.status === "Proses").slice(0, 5);

  const predikatCount = {};
  PREDIKAT_UKS.forEach((p) => { predikatCount[p.key] = SCHOOL_REGISTRY.filter((s) => s.predikat === p.key).length; });

  const selesai  = SCHOOL_REGISTRY.filter((s) => s.status === "Terverifikasi" || s.status === "Selesai").length;
  const menunggu = SCHOOL_REGISTRY.filter((s) => s.status === "Menunggu Verifikasi").length;
  const belum    = SCHOOL_REGISTRY.filter((s) => s.status === "Belum Selesai" || s.status === "Proses").length;

  return (
    <div style={{ width: "100%", overflowX: "hidden" }}>
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4 mb-6" style={{ flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontSize: "clamp(22px, 4vw, 30px)", fontWeight: 700, marginBottom: 6, lineHeight: 1.2 }}>
            Dashboard Koordinator Wilayah
          </h1>
          <p className="text-muted" style={{ fontSize: "14px", lineHeight: 1.6 }}>
            Monitoring progres penilaian UKS sekolah binaan
          </p>
        </div>
        <div className="badge badge-glow">Tahun Ajaran 2026/2027</div>
      </div>

      {/* STATISTIK */}
      <div className="grid gap-5 mb-6" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
        <StatCard icon={<Users size={24} />}         title="Total Sekolah"       value={String(stats.total)}   color="var(--secondary)" bg="var(--accent-glow)" />
        <StatCard icon={<ShieldCheck size={24} />}   title="Terverifikasi"       value={String(selesai)}       color="var(--primary)"   bg="var(--bg-light)" />
        <StatCard icon={<AlertTriangle size={24} />} title="Menunggu Verifikasi" value={String(menunggu)}      color="#D97706"           bg="#FEF3C7" />
        <StatCard icon={<Clock3 size={24} />}        title="Belum Selesai"       value={String(belum)}         color="#EF4444"           bg="#FEE2E2" />
      </div>

      {/* GRAFIK + PENGUMUMAN */}
      <div className="grid gap-6 mb-6" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", alignItems: "start" }}>
        {/* PIE CHART */}
        <div className="card glass-panel" style={{ padding: "24px", borderRadius: "24px", minWidth: 0 }}>
          <div className="flex items-center gap-2 mb-5">
            <CheckCircle2 size={22} color="var(--primary)" />
            <h3 style={{ fontSize: "20px", fontWeight: 700 }}>Progres Sekolah Binaan</h3>
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
            <div style={{
              width: "200px", height: "200px", borderRadius: "50%", position: "relative",
              background: `conic-gradient(#10B981 0% ${(selesai / stats.total * 100).toFixed(1)}%, #F59E0B ${(selesai / stats.total * 100).toFixed(1)}% ${((selesai + menunggu) / stats.total * 100).toFixed(1)}%, #EF4444 ${((selesai + menunggu) / stats.total * 100).toFixed(1)}% 100%)`,
            }}>
              <div style={{ position: "absolute", inset: "28px", background: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", textAlign: "center" }}>
                <div style={{ fontSize: "28px", fontWeight: 700 }}>{stats.total}</div>
                <div className="text-muted" style={{ fontSize: "12px" }}>Total Sekolah</div>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <LegendItem color="#10B981" label="Terverifikasi"       value={`${selesai} Sekolah`} />
            <LegendItem color="#F59E0B" label="Menunggu Verifikasi" value={`${menunggu} Sekolah`} />
            <LegendItem color="#EF4444" label="Belum Selesai"       value={`${belum} Sekolah`} />
          </div>
        </div>

        {/* PENGUMUMAN */}
        <div className="card glass-panel" style={{ padding: "24px", borderRadius: "24px", minWidth: 0 }}>
          <div className="flex items-center gap-2 mb-5">
            <BellRing size={22} color="#F59E0B" />
            <h3 style={{ fontSize: "20px", fontWeight: 700 }}>Pengumuman</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {pengumuman.map((p) => (
              <div key={p.id} style={{ padding: "16px", borderRadius: "16px", background: p.tipe === "warning" ? "#FEF3C7" : p.tipe === "success" ? "#E8FFF1" : "#DBEAFE" }}>
                <div style={{ fontWeight: 700, marginBottom: "4px", color: p.tipe === "warning" ? "#92400E" : p.tipe === "success" ? "#166534" : "#1E40AF" }}>{p.judul}</div>
                <div style={{ fontSize: "13px", lineHeight: 1.6, color: p.tipe === "warning" ? "#92400E" : p.tipe === "success" ? "#166534" : "#1E40AF" }}>{p.isi}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* REKAP PREDIKAT */}
      <div className="card glass-panel mb-6" style={{ padding: "24px", borderRadius: "24px" }}>
        <div className="flex items-center gap-2 mb-5">
          <ShieldCheck size={22} color="var(--secondary)" />
          <h3 style={{ fontSize: "20px", fontWeight: 700 }}>Rekapitulasi Predikat UKS</h3>
        </div>
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))" }}>
          {PREDIKAT_UKS.map((p) => (
            <div key={p.key} style={{ padding: "20px", borderRadius: "18px", background: p.bg, textAlign: "center" }}>
              <div style={{ fontSize: "32px", fontWeight: 700, color: p.color, marginBottom: "6px" }}>{predikatCount[p.key] || 0}</div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: p.color }}>{p.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* SEKOLAH BELUM SELESAI */}
      <div className="card glass-panel" style={{ padding: "24px", borderRadius: "24px" }}>
        <div className="flex items-center gap-2 mb-5">
          <School size={22} color="#EF4444" />
          <h3 style={{ fontSize: "20px", fontWeight: 700 }}>Sekolah Perlu Perhatian</h3>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {belumSelesai.map((s) => (
            <div key={s.id} style={{ padding: "16px", borderRadius: "16px", border: "1px solid var(--border)", background: "var(--card-bg)" }}>
              <div className="flex items-center justify-between gap-3 mb-3" style={{ flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "15px" }}>{s.nama}</div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{s.jenjang} · {s.wilayah}</div>
                </div>
                <div style={{ fontWeight: 700, fontSize: "13px", color: "#EF4444" }}>{s.progress}%</div>
              </div>
              <div style={{ width: "100%", height: "8px", borderRadius: "999px", background: "#ECECEC", overflow: "hidden" }}>
                <div style={{ width: `${s.progress}%`, height: "100%", background: "#EF4444", borderRadius: "999px" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, color, bg }) {
  return (
    <div className="card" style={{ padding: "22px", borderRadius: "22px", border: "1px solid var(--border)", background: "var(--card-bg)", minWidth: 0 }}>
      <div style={{ width: "56px", height: "56px", borderRadius: "18px", background: bg, color, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>{icon}</div>
      <div className="text-muted" style={{ fontSize: "13px", marginBottom: "8px" }}>{title}</div>
      <div style={{ fontSize: "30px", fontWeight: 700, lineHeight: 1.2 }}>{value}</div>
    </div>
  );
}
function LegendItem({ color, label, value }) {
  return (
    <div className="flex items-center justify-between gap-3" style={{ flexWrap: "wrap" }}>
      <div className="flex items-center gap-3">
        <div style={{ width: "14px", height: "14px", borderRadius: "50%", background: color }} />
        <span style={{ fontSize: "14px", fontWeight: 600 }}>{label}</span>
      </div>
      <div className="text-muted" style={{ fontSize: "13px" }}>{value}</div>
    </div>
  );
}