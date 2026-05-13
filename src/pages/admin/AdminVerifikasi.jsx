import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck, Eye, CheckCircle2, Clock3,
  AlertTriangle, School, Search, X, Award,
} from "lucide-react";
import { useUKS } from "../../context/UKSContext";
import { useAuth } from "../../context/AuthContext";
import {
  SCHOOL_REGISTRY, PREDIKAT_UKS, STATUS_OPTIONS,
  JENJANG_OPTIONS, PENGUMUMAN_LIST, getAdminStats,
} from "../../data/questions";

export default function AdminVerifikasi() {
  const navigate = useNavigate();
  const { verifySchool } = useUKS();
  const { user } = useAuth();

  const [schools, setSchools]       = useState(SCHOOL_REGISTRY);
  const [search, setSearch]         = useState("");
  const [filterStatus, setFilter]   = useState("");
  const [modalSchool, setModal]     = useState(null);
  const [selPredikat, setSelPred]   = useState("madya");
  const [catatan, setCatatan]       = useState("");
  const [confirming, setConfirming] = useState(false);

  const stats = getAdminStats(schools);

  const filtered = schools.filter((s) => {
    const q = search.toLowerCase();
    const matchSearch = s.nama.toLowerCase().includes(q) || s.wilayah.toLowerCase().includes(q);
    const matchStatus = !filterStatus || s.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const pengumuman = PENGUMUMAN_LIST.filter((p) => p.role.includes("admin")).slice(0, 3);

  function handleVerify() {
    if (!modalSchool) return;
    setConfirming(true);
    setTimeout(() => {
      verifySchool(modalSchool.id, selPredikat, catatan, user?.username || "Admin");
      setSchools((prev) =>
        prev.map((s) =>
          s.id === modalSchool.id
            ? { ...s, status: "Terverifikasi", predikat: selPredikat, certificateReady: true }
            : s
        )
      );
      setConfirming(false);
      setModal(null);
      setCatatan("");
      setSelPred("madya");
    }, 800);
  }

  return (
    <div style={{ width: "100%", overflowX: "hidden", display: "flex", flexDirection: "column", gap: "22px" }}>
      {/* HEADER */}
      <div className="flex items-start justify-between" style={{ flexWrap: "wrap", gap: "16px" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ fontSize: "clamp(24px, 4vw, 30px)", fontWeight: 700, lineHeight: 1.2, marginBottom: 6 }}>
            Verifikasi Assessment
          </h1>
          <p className="text-muted" style={{ fontSize: "14px", lineHeight: 1.6 }}>
            Monitoring progres dan verifikasi hasil assessment sekolah binaan.
          </p>
        </div>
        <div className="badge badge-glow" style={{ whiteSpace: "nowrap", alignSelf: "flex-start" }}>
          Tahun 2026 / 2027
        </div>
      </div>

      {/* STATISTIK */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "18px" }}>
        <StatCard icon={<School size={22} />}       title="Total Sekolah"       value={String(stats.total)}   color="var(--secondary)" bg="var(--accent-glow)" />
        <StatCard icon={<CheckCircle2 size={22} />}  title="Terverifikasi"       value={String(stats.selesai)} color="#16A34A"          bg="#DCFCE7" />
        <StatCard icon={<Clock3 size={22} />}        title="Menunggu Verifikasi" value={String(stats.menunggu)} color="#D97706"          bg="#FEF3C7" />
        <StatCard icon={<AlertTriangle size={22} />} title="Belum Selesai"       value={String(stats.belum)}   color="#DC2626"          bg="#FEE2E2" />
      </div>

      {/* PENGUMUMAN */}
      <div className="card glass-panel" style={{ padding: "20px", borderRadius: "22px" }}>
        <div className="flex items-center gap-2" style={{ marginBottom: "14px" }}>
          <AlertTriangle size={18} color="#D97706" />
          <h3 style={{ fontSize: "17px", fontWeight: 700 }}>Pengumuman</h3>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {pengumuman.map((p) => (
            <div key={p.id} style={{ padding: "14px 16px", borderRadius: "14px", background: p.tipe === "warning" ? "#FFF7ED" : p.tipe === "success" ? "#F0FFF4" : "#EFF6FF", border: `1px solid ${p.tipe === "warning" ? "#FED7AA" : p.tipe === "success" ? "#C6F6D5" : "#BFDBFE"}`, fontSize: "13px", lineHeight: 1.6 }}>
              <strong style={{ display: "block", marginBottom: "2px" }}>{p.judul}</strong>
              {p.isi}
            </div>
          ))}
        </div>
      </div>

      {/* FILTER */}
      <div className="card glass-panel" style={{ padding: "18px", borderRadius: "22px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px" }}>
          <div style={{ position: "relative" }}>
            <Search size={18} style={{ position: "absolute", top: "50%", left: "14px", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input type="text" placeholder="Cari sekolah / wilayah..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ ...inputStyle, paddingLeft: "44px" }} />
          </div>
          <select style={inputStyle} value={filterStatus} onChange={(e) => setFilter(e.target.value)}>
            {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <select style={inputStyle}>
            <option value="">Semua Jenjang</option>
            {JENJANG_OPTIONS.map((j) => <option key={j}>{j}</option>)}
          </select>
        </div>
      </div>

      {/* LIST SEKOLAH */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "18px" }}>
        {filtered.map((school) => {
          const isVerified = school.status === "Terverifikasi";
          const canVerify  = school.progress === 100 && !isVerified;
          const pred       = PREDIKAT_UKS.find((p) => p.key === school.predikat);

          return (
            <div key={school.id} className="card glass-panel" style={{ padding: "22px", borderRadius: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* CARD HEADER */}
              <div className="flex items-start justify-between" style={{ gap: "12px", flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontSize: "17px", fontWeight: 700, lineHeight: 1.4, marginBottom: "2px", wordBreak: "break-word" }}>{school.nama}</h3>
                  <div className="text-muted" style={{ fontSize: "13px" }}>{school.jenjang} · {school.wilayah}</div>
                </div>
                <StatusBadge status={school.status} />
              </div>

              {/* PROGRESS */}
              <div>
                <div className="flex items-center justify-between" style={{ marginBottom: "8px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 600 }}>Progress Assessment</span>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-muted)" }}>{school.progress}%</span>
                </div>
                <div style={{ width: "100%", height: "10px", background: "var(--border)", borderRadius: "999px", overflow: "hidden" }}>
                  <div style={{ width: `${school.progress}%`, height: "100%", borderRadius: "999px", background: school.progress === 100 ? "#16A34A" : school.progress > 60 ? "#F59E0B" : "var(--primary)", transition: "0.4s" }} />
                </div>
              </div>

              {/* PREDIKAT (jika sudah terverifikasi) */}
              {isVerified && pred && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 14px", borderRadius: "12px", background: pred.bg }}>
                  <Award size={16} color={pred.color} />
                  <span style={{ fontSize: "13px", fontWeight: 700, color: pred.color }}>Predikat: {pred.label}</span>
                </div>
              )}

              {/* ALERT belum selesai */}
              {school.progress < 100 && (
                <div style={{ padding: "12px 14px", borderRadius: "12px", background: "#FEF2F2", color: "#B91C1C", fontSize: "13px", lineHeight: 1.5 }}>
                  Sekolah belum menyelesaikan seluruh assessment.
                </div>
              )}

              {/* BUTTONS */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "10px" }}>
                <button onClick={() => navigate(`/admin/verifikasi/${school.id}`)} style={lihatBtn}>
                  <Eye size={15} /> Lihat Detail
                </button>
                {!isVerified && (
                  <button
                    disabled={!canVerify}
                    onClick={() => { setModal(school); setSelPred("madya"); setCatatan(""); }}
                    style={{ ...verifBtn, opacity: canVerify ? 1 : 0.45, cursor: canVerify ? "pointer" : "not-allowed" }}
                  >
                    <ShieldCheck size={15} /> Verifikasi
                  </button>
                )}
                {isVerified && (
                  <div style={{ ...verifBtn, background: "linear-gradient(135deg,#16A34A,#15803D)", cursor: "default", justifyContent: "center" }}>
                    <CheckCircle2 size={15} /> Terverifikasi
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL VERIFIKASI */}
      {modalSchool && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ background: "var(--card-bg)", borderRadius: "28px", padding: "32px", maxWidth: "520px", width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between" style={{ marginBottom: "22px" }}>
              <div className="flex items-center gap-3">
                <div style={{ width: 44, height: 44, borderRadius: "14px", background: "#DBEAFE", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ShieldCheck size={22} color="#1D4ED8" />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "18px" }}>Konfirmasi Verifikasi</div>
                  <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>{modalSchool.nama}</div>
                </div>
              </div>
              <button onClick={() => setModal(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
                <X size={22} />
              </button>
            </div>

            {/* PILIH PREDIKAT */}
            <div style={{ marginBottom: "18px" }}>
              <label style={{ fontSize: "14px", fontWeight: 600, display: "block", marginBottom: "10px" }}>
                Predikat UKS
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {PREDIKAT_UKS.map((p) => (
                  <button
                    key={p.key}
                    onClick={() => setSelPred(p.key)}
                    style={{
                      padding: "12px 14px", borderRadius: "14px", border: `2px solid ${selPredikat === p.key ? p.color : "var(--border)"}`,
                      background: selPredikat === p.key ? p.bg : "var(--card-bg)", color: selPredikat === p.key ? p.color : "var(--text-main)",
                      fontWeight: selPredikat === p.key ? 700 : 600, fontSize: "14px", cursor: "pointer", textAlign: "left",
                    }}
                  >
                    {p.label}
                    <div style={{ fontSize: "11px", opacity: 0.75, marginTop: "2px", fontWeight: 400 }}>{p.deskripsi}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* CATATAN */}
            <div style={{ marginBottom: "22px" }}>
              <label style={{ fontSize: "14px", fontWeight: 600, display: "block", marginBottom: "8px" }}>
                Catatan Verifikasi (opsional)
              </label>
              <textarea
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                placeholder="Tambahkan catatan untuk sekolah..."
                rows={3}
                style={{ width: "100%", borderRadius: "14px", border: "1px solid var(--border)", background: "var(--card-bg)", padding: "12px 14px", fontSize: "14px", outline: "none", resize: "vertical", color: "var(--text-main)" }}
              />
            </div>

            {/* INFO */}
            <div style={{ padding: "14px", borderRadius: "14px", background: "#EFF6FF", border: "1px solid #BFDBFE", fontSize: "13px", lineHeight: 1.6, marginBottom: "22px", color: "#1E40AF" }}>
              <strong>Catatan:</strong> Setelah diverifikasi, sertifikat UKS akan otomatis tersedia untuk diunduh oleh sekolah.
            </div>

            {/* ACTION */}
            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={() => setModal(null)} style={{ flex: 1, height: "48px", borderRadius: "14px", border: "1px solid var(--border)", background: "var(--card-bg)", color: "var(--text-main)", fontWeight: 600, cursor: "pointer" }}>
                Batal
              </button>
              <button
                onClick={handleVerify}
                disabled={confirming}
                style={{ flex: 2, height: "48px", borderRadius: "14px", border: "none", background: "linear-gradient(135deg,#2563EB,#1D4ED8)", color: "white", fontWeight: 700, cursor: confirming ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", opacity: confirming ? 0.7 : 1 }}
              >
                <ShieldCheck size={18} />
                {confirming ? "Memproses..." : "Konfirmasi & Terbitkan Sertifikat"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── sub-components ─── */
function StatusBadge({ status }) {
  const map = {
    "Terverifikasi":       { bg: "#DCFCE7", color: "#15803D" },
    "Menunggu Verifikasi": { bg: "#FEF3C7", color: "#B45309" },
    "Selesai":             { bg: "#DCFCE7", color: "#15803D" },
    "Proses":              { bg: "#DBEAFE", color: "#1D4ED8" },
    "Belum Selesai":       { bg: "#FEE2E2", color: "#DC2626" },
  };
  const s = map[status] || { bg: "#F3F4F6", color: "#6B7280" };
  return (
    <div style={{ padding: "6px 12px", borderRadius: "999px", fontSize: "11px", fontWeight: 700, background: s.bg, color: s.color, whiteSpace: "nowrap" }}>
      {status}
    </div>
  );
}

function StatCard({ icon, title, value, color, bg }) {
  return (
    <div className="card" style={{ padding: "22px", borderRadius: "22px", border: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "16px", minWidth: 0 }}>
      <div style={{ width: "54px", height: "54px", borderRadius: "18px", background: bg, color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{icon}</div>
      <div style={{ minWidth: 0 }}>
        <div className="text-muted" style={{ fontSize: "13px", marginBottom: "4px" }}>{title}</div>
        <div style={{ fontSize: "26px", fontWeight: 700, lineHeight: 1.2 }}>{value}</div>
      </div>
    </div>
  );
}

const inputStyle = { width: "100%", height: "46px", borderRadius: "14px", border: "1px solid var(--border)", background: "var(--card-bg)", color: "var(--text-main)", fontSize: "14px", padding: "0 14px", outline: "none" };
const lihatBtn  = { height: "44px", borderRadius: "13px", border: "1px solid var(--border)", background: "var(--card-bg)", color: "var(--text-main)", display: "flex", alignItems: "center", justifyContent: "center", gap: "7px", cursor: "pointer", fontWeight: 600, fontSize: "13px" };
const verifBtn  = { height: "44px", borderRadius: "13px", border: "none", background: "linear-gradient(135deg, #2563EB, #1D4ED8)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", gap: "7px", fontWeight: 600, fontSize: "13px" };