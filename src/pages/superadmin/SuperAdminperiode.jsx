import { CalendarDays, Plus, Pencil, Trash2, CheckCircle2, Clock3 } from "lucide-react";
import { PERIODE_LIST } from "../../data/questions";


export default function SuperAdminperiode() {
  return (
    <div style={{ width: "100%" }}>
      {/* HEADER */}
      <div className="flex items-start justify-between mb-6" style={{ gap: "16px", flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontSize: "clamp(22px,4vw,32px)", fontWeight: 800, marginBottom: "8px" }}>
            Periode Assessment
          </h1>
          <p className="text-muted" style={{ fontSize: "14px", lineHeight: 1.7 }}>
            Kelola periode penilaian UKS: buat, aktifkan, dan arsipkan periode assessment.
          </p>
        </div>
        <button style={{ display: "flex", alignItems: "center", gap: "8px", background: "linear-gradient(135deg, var(--primary), var(--secondary))", color: "white", border: "none", padding: "12px 22px", borderRadius: "14px", fontWeight: 700, cursor: "pointer", fontSize: "14px" }}>
          <Plus size={18} />
          Tambah Periode
        </button>
      </div>

      {/* CARDS */}
      <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
        {PERIODE_LIST.map((p) => (
          <div key={p.id} className="card glass-panel" style={{ padding: "26px 28px", borderRadius: "24px", display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "18px", flex: 1, minWidth: "220px" }}>
              <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: p.status === "Aktif" ? "#DCFCE7" : "var(--bg-light)", display: "flex", alignItems: "center", justifyContent: "center", color: p.status === "Aktif" ? "#15803D" : "var(--text-muted)", flexShrink: 0 }}>
                <CalendarDays size={26} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "17px", marginBottom: "4px" }}>{p.nama}</div>
                <div className="text-muted" style={{ fontSize: "13px" }}>{p.mulai} — {p.selesai}</div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "28px", flexWrap: "wrap" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "22px", fontWeight: 800, color: "var(--primary)" }}>{p.sekolahIkut.toLocaleString()}</div>
                <div className="text-muted" style={{ fontSize: "12px" }}>Sekolah Ikut</div>
              </div>

              <span style={{ background: p.status === "Aktif" ? "#DCFCE7" : "#F3F4F6", color: p.status === "Aktif" ? "#15803D" : "#6B7280", padding: "6px 16px", borderRadius: "999px", fontSize: "13px", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "6px" }}>
                {p.status === "Aktif" ? <CheckCircle2 size={14} /> : <Clock3 size={14} />}
                {p.status}
              </span>

              <div style={{ display: "flex", gap: "8px" }}>
                <button className="btn btn-outline" style={{ padding: "8px 14px", borderRadius: "10px", fontSize: "13px", display: "flex", alignItems: "center", gap: "5px" }}>
                  <Pencil size={13} /> Edit
                </button>
                {p.status !== "Aktif" && (
                  <button style={{ padding: "8px 14px", borderRadius: "10px", fontSize: "13px", background: "#FEE2E2", color: "#DC2626", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}>
                    <Trash2 size={13} /> Hapus
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
