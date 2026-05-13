import { FileBarChart, Download, TrendingUp, School, CheckCircle2, AlertTriangle } from "lucide-react";

const rekapWilayah = [
  { wilayah: "Dinkes Surakarta", total: 320, selesai: 280, persentase: 87 },
  { wilayah: "Dinkes Nusantara", total: 210, selesai: 145, persentase: 69 },
  { wilayah: "Dinkes Sukamaju", total: 180, selesai: 110, persentase: 61 },
  { wilayah: "Dinkes Teknologi", total: 140, selesai: 90, persentase: 64 },
  { wilayah: "Dinkes Maju Jaya", total: 100, selesai: 55, persentase: 55 },
];

export default function SuperAdminlaporan() {
  return (
    <div style={{ width: "100%" }}>
      {/* HEADER */}
      <div className="flex items-start justify-between mb-6" style={{ gap: "16px", flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontSize: "clamp(22px,4vw,32px)", fontWeight: 800, marginBottom: "8px" }}>
            Laporan & Rekap Nasional
          </h1>
          <p className="text-muted" style={{ fontSize: "14px", lineHeight: 1.7 }}>
            Rekap progres assessment UKS per wilayah dan jenjang secara nasional.
          </p>
        </div>
        <button style={{ display: "flex", alignItems: "center", gap: "8px", background: "linear-gradient(135deg, var(--primary), var(--secondary))", color: "white", border: "none", padding: "12px 22px", borderRadius: "14px", fontWeight: 700, cursor: "pointer", fontSize: "14px" }}>
          <Download size={18} />
          Ekspor Laporan
        </button>
      </div>

      {/* SUMMARY STATS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "18px", marginBottom: "28px" }}>
        {[
          { icon: <School size={22} />, label: "Total Sekolah", value: "1,450", color: "var(--primary)", bg: "var(--bg-light)" },
          { icon: <CheckCircle2 size={22} />, label: "Sudah Selesai", value: "842", color: "#15803D", bg: "#DCFCE7" },
          { icon: <TrendingUp size={22} />, label: "Progress Nasional", value: "78%", color: "#4338CA", bg: "#EEF2FF" },
          { icon: <AlertTriangle size={22} />, label: "Belum Lapor", value: "318", color: "#DC2626", bg: "#FEE2E2" },
        ].map((s, i) => (
          <div key={i} className="card" style={{ padding: "22px", borderRadius: "22px", border: "1px solid var(--border)" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: s.bg, color: s.color, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px" }}>
              {s.icon}
            </div>
            <div className="text-muted" style={{ fontSize: "13px", marginBottom: "6px" }}>{s.label}</div>
            <div style={{ fontSize: "28px", fontWeight: 800, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* TABLE PER WILAYAH */}
      <div className="card glass-panel" style={{ padding: "28px", borderRadius: "28px" }}>
        <h3 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "6px" }}>Rekap Per Wilayah / OPD</h3>
        <p className="text-muted" style={{ fontSize: "13px", marginBottom: "24px" }}>Progress assessment berdasarkan Dinas Kesehatan wilayah</p>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
            <thead>
              <tr style={{ background: "var(--bg-light)" }}>
                {["Wilayah / OPD", "Total Sekolah", "Sudah Selesai", "Progress", "Aksi"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "16px 18px", fontSize: "13px", fontWeight: 700 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rekapWilayah.map((row, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "16px 18px", fontWeight: 600 }}>{row.wilayah}</td>
                  <td style={{ padding: "16px 18px", fontSize: "14px" }}>{row.total}</td>
                  <td style={{ padding: "16px 18px", fontSize: "14px" }}>{row.selesai}</td>
                  <td style={{ padding: "16px 18px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: "160px" }}>
                      <div style={{ flex: 1, height: "8px", borderRadius: "999px", background: "#E5E7EB", overflow: "hidden" }}>
                        <div style={{ width: `${row.persentase}%`, height: "100%", borderRadius: "999px", background: row.persentase >= 80 ? "#16A34A" : row.persentase >= 60 ? "#F59E0B" : "#DC2626" }} />
                      </div>
                      <span style={{ fontWeight: 700, fontSize: "13px" }}>{row.persentase}%</span>
                    </div>
                  </td>
                  <td style={{ padding: "16px 18px" }}>
                    <button className="btn btn-outline" style={{ padding: "6px 14px", borderRadius: "10px", fontSize: "13px", display: "flex", alignItems: "center", gap: "5px" }}>
                      <FileBarChart size={13} /> Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
