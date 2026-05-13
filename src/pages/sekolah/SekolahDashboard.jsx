import { useAuth } from "../../context/AuthContext";
import { useUKS, TIER_KEYS } from "../../context/UKSContext";
import { TIERS, PERIODE_AKTIF, PENGUMUMAN_LIST, SCHOOLS } from "../../data/questions";
import { useNavigate } from "react-router-dom";
import { Activity, CheckCircle, Clock, Bell, CalendarDays, ClipboardCheck, ArrowRight } from "lucide-react";

export default function SekolahDashboard() {
  const { user } = useAuth();
  const { getSchoolData } = useUKS();
  const navigate = useNavigate();

  const schoolId = user?.school?.id;
  const sd = getSchoolData(schoolId);
  const { tierStatus = {}, answers = {}, verified = false, certificateReady = false } = sd;

  const totalQ = TIER_KEYS.reduce((a, tk) => a + TIERS[tk].questions.length, 0);
  const answered = TIER_KEYS.reduce((a, tk) =>
    a + TIERS[tk].questions.filter((_, i) => {
      const ans = answers[`${tk}_${i}`];
      return ans && ans.memenuhi !== null && ans.memenuhi !== undefined;
    }).length, 0
  );
  const progressPct = totalQ > 0 ? Math.round((answered / totalQ) * 100) : 0;
  const statusLabel = verified ? "Terverifikasi ✓" : progressPct === 100 ? "Menunggu Verifikasi" : "Dalam Proses";

  const schoolInfo = SCHOOLS.find((s) => s.id === schoolId) || SCHOOLS[0];
  const pengumuman = PENGUMUMAN_LIST.filter((p) => p.role.includes("sekolah")).slice(0, 3);
  const deadline = PERIODE_AKTIF.deadline;

  return (
    <div style={{ paddingTop: "6px" }}>
      {/* HEADER */}
      <div className="flex items-center justify-between" style={{ marginBottom: "24px", gap: "14px", flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontSize: "1.35rem", fontWeight: "700", color: "var(--text-main)", marginBottom: "4px" }}>
            Dashboard Penilaian UKS
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
            Selamat datang, {user?.username || "Kepala Sekolah"} · {schoolInfo?.name}
          </p>
        </div>
        <div className="badge badge-glow" style={{ padding: "8px 14px", borderRadius: "999px", fontSize: "12px", fontWeight: "600", whiteSpace: "nowrap" }}>
          {PERIODE_AKTIF.nama}
        </div>
      </div>

      {/* SERTIFIKAT BANNER */}
      {certificateReady && (
        <div
          onClick={() => navigate("/sekolah/hasil")}
          style={{ padding: "16px 20px", borderRadius: "18px", background: "linear-gradient(135deg,#0f4c75,#1b9e6e)", color: "white", cursor: "pointer", marginBottom: "22px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}
        >
          <div>
            <div style={{ fontWeight: 700, fontSize: "15px", marginBottom: "4px" }}>🎉 Sertifikat UKS Tersedia!</div>
            <div style={{ fontSize: "13px", opacity: 0.9 }}>Sekolah Anda telah terverifikasi. Klik untuk mengunduh sertifikat.</div>
          </div>
          <ArrowRight size={22} />
        </div>
      )}

      {/* TOP CARDS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "18px", marginBottom: "22px" }}>
        <TopCard icon={<Activity size={26} />}     label="Status Pengisian"  value={statusLabel}      iconBg="var(--accent-glow)"            iconColor="var(--secondary)" />
        <TopCard icon={<CheckCircle size={26} />}  label="Indikator Terisi"  value={`${answered} / ${totalQ}`} iconBg="var(--bg-light)" iconColor="var(--primary)" />
        <TopCard icon={<Clock size={26} />}        label="Progress"          value={`${progressPct}%`} iconBg="var(--bg-light)"             iconColor="var(--text-main)" />
        <TopCard icon={<CalendarDays size={26} />} label="Deadline Asesmen"  value={deadline}          iconBg="rgba(255,99,71,0.12)"         iconColor="#ff5b45" valueColor="#ff5b45" />
      </div>

      {/* GRID PROGRES + PENGUMUMAN */}
      <div className="dashboard-grid" style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "20px" }}>
        {/* PROGRESS */}
        <div className="card glass-panel" style={{ padding: "24px", borderRadius: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
            <div style={{ width: "46px", height: "46px", borderRadius: "14px", background: "var(--accent-glow)", color: "var(--secondary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ClipboardCheck size={22} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontWeight: "700", color: "var(--text-main)" }}>Progres Trias UKS</h3>
              <p style={{ margin: 0, fontSize: "13px", color: "var(--text-muted)" }}>Monitoring per tier</p>
            </div>
          </div>
          <div style={{ display: "grid", gap: "18px" }}>
            {TIER_KEYS.map((tk) => {
              const tier   = TIERS[tk];
              const total  = tier.questions.length;
              const done   = tier.questions.filter((_, i) => answers[`${tk}_${i}`]?.memenuhi === true).length;
              const pct    = total > 0 ? Math.round((done / total) * 100) : 0;
              return (
                <div key={tk}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-main)" }}>Tier {tier.label}</span>
                    <span style={{ fontSize: "14px", fontWeight: "700", color: tier.color }}>{done}/{total} ({pct}%)</span>
                  </div>
                  <div style={{ height: "10px", background: "var(--border)", borderRadius: "999px", overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: tier.color, borderRadius: "999px", transition: "0.4s" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* PENGUMUMAN */}
        <div className="card glass-panel" style={{ padding: "24px", borderRadius: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
            <div style={{ width: "46px", height: "46px", borderRadius: "14px", background: "rgba(255,193,7,0.12)", color: "#f4a100", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Bell size={22} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontWeight: "700", color: "var(--text-main)" }}>Pengumuman</h3>
              <p style={{ margin: 0, fontSize: "13px", color: "var(--text-muted)" }}>Informasi terbaru</p>
            </div>
          </div>
          <div style={{ display: "grid", gap: "12px" }}>
            {pengumuman.map((p) => (
              <div key={p.id} style={{ padding: "14px 16px", borderRadius: "16px", background: p.tipe === "warning" ? "#FFF7E8" : p.tipe === "success" ? "rgba(29,158,117,0.08)" : "var(--bg-light)", border: `1px solid ${p.tipe === "warning" ? "rgba(255,193,7,0.2)" : p.tipe === "success" ? "rgba(29,158,117,0.15)" : "var(--border)"}` }}>
                <div style={{ fontWeight: "600", marginBottom: "4px", color: p.tipe === "success" ? "var(--secondary)" : "var(--text-main)", fontSize: "14px" }}>{p.judul}</div>
                <div style={{ fontSize: "13px", lineHeight: "1.6", color: "var(--text-muted)" }}>{p.isi}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 950px) { .dashboard-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}

function TopCard({ icon, label, value, iconBg, iconColor, valueColor }) {
  return (
    <div className="card" style={{ display: "flex", alignItems: "center", gap: "16px", padding: "20px", borderRadius: "22px" }}>
      <div style={{ width: "58px", height: "58px", borderRadius: "50%", background: iconBg, color: iconColor, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "4px" }}>{label}</div>
        <div style={{ fontWeight: "700", fontSize: "1.05rem", color: valueColor || "var(--text-main)" }}>{value}</div>
      </div>
    </div>
  );
}